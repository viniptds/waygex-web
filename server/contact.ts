// Validation and rate limiting for POST /api/contact (contract: shared/contact.ts).
import {
  BUDGETS,
  LOCALES,
  PLATFORMS,
  STAGES,
  type Budget,
  type ContactField,
  type FieldError,
  type Locale,
  type Platform,
  type Stage,
} from '../shared/contact.js'

/** A validated, normalised brief (ContactRequest without the honeypot). */
export interface Brief {
  name: string
  email: string
  company?: string
  project: string
  stage: Stage
  platforms: Platform[]
  budget?: Budget
  locale: Locale
}

export type ValidationResult =
  | { ok: true; brief: Brief }
  | { ok: false; fields: Partial<Record<ContactField, FieldError>> }

export const LIMITS = {
  name: { min: 2, max: 120 },
  email: { max: 254 },
  company: { max: 120 },
  project: { min: 10, max: 4000 },
} as const

// Pragmatic address check: local@domain.tld, no whitespace or characters that
// would need quoting in a header.
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:".]+(?:\.[^\s@<>()[\]\\,;:".]+)*\.(?:\p{L}{2,}|xn--[a-z0-9-]+)$/iu

const includes = <T extends string>(list: readonly T[], value: unknown): value is T =>
  typeof value === 'string' && (list as readonly string[]).includes(value)

/** Single-line fields: trim and collapse any whitespace (incl. newlines) to one space. */
const oneLine = (value: string) => value.replace(/\s+/g, ' ').trim()

/** True when the honeypot field was filled in (bots fill every input). */
export function isHoneypotFilled(input: unknown): boolean {
  if (!input || typeof input !== 'object') return false
  const website = (input as Record<string, unknown>).website
  if (website === undefined || website === null) return false
  return typeof website === 'string' ? website.trim() !== '' : true
}

export function validateContact(input: unknown): ValidationResult {
  const body: Record<string, unknown> = input && typeof input === 'object' && !Array.isArray(input) ? (input as Record<string, unknown>) : {}
  const fields: Partial<Record<ContactField, FieldError>> = {}

  const text = (field: ContactField, raw: unknown, opts: { min?: number; max: number; required: boolean; multiline?: boolean }) => {
    if (raw === undefined || raw === null) {
      if (opts.required) fields[field] = 'required'
      return undefined
    }
    if (typeof raw !== 'string') {
      fields[field] = 'invalid'
      return undefined
    }
    const value = opts.multiline ? raw.replace(/\r\n?/g, '\n').trim() : oneLine(raw)
    if (value === '') {
      if (opts.required) fields[field] = 'required'
      return undefined
    }
    if (opts.min !== undefined && value.length < opts.min) fields[field] = 'too_short'
    else if (value.length > opts.max) fields[field] = 'too_long'
    return value
  }

  const name = text('name', body.name, { ...LIMITS.name, required: true })
  const company = text('company', body.company, { ...LIMITS.company, required: false })
  const project = text('project', body.project, { ...LIMITS.project, required: true, multiline: true })

  const email = text('email', body.email, { ...LIMITS.email, required: true })
  if (email !== undefined && !fields.email && !EMAIL_RE.test(email)) fields.email = 'invalid'

  let stage: Stage | undefined
  if (body.stage === undefined || body.stage === null || body.stage === '') fields.stage = 'required'
  else if (includes(STAGES, body.stage)) stage = body.stage
  else fields.stage = 'invalid'

  let platforms: Platform[] = []
  if (body.platforms === undefined || body.platforms === null) fields.platforms = 'required'
  else if (!Array.isArray(body.platforms)) fields.platforms = 'invalid'
  else if (body.platforms.length === 0) fields.platforms = 'required'
  else if (!body.platforms.every((pl) => includes(PLATFORMS, pl))) fields.platforms = 'invalid'
  else platforms = [...new Set(body.platforms as Platform[])]

  let budget: Budget | undefined
  if (body.budget === undefined || body.budget === null || body.budget === '') budget = undefined
  else if (includes(BUDGETS, body.budget)) budget = body.budget
  else fields.budget = 'invalid'

  const locale: Locale = includes(LOCALES, body.locale) ? body.locale : 'en'

  if (Object.keys(fields).length > 0 || !name || !email || !project || !stage) {
    return { ok: false, fields }
  }

  return {
    ok: true,
    brief: { name, email, ...(company ? { company } : {}), project, stage, platforms, ...(budget ? { budget } : {}), locale },
  }
}

/** Sliding-window, in-memory rate limiter keyed by client IP (single instance only). */
export class RateLimiter {
  private readonly hits = new Map<string, number[]>()

  constructor(
    readonly limit: number,
    readonly windowMs: number,
  ) {}

  /** Records a hit. Returns `{ allowed: false, retryAfter }` (seconds) when over the limit. */
  hit(key: string, now = Date.now()): { allowed: true } | { allowed: false; retryAfter: number } {
    const cutoff = now - this.windowMs
    const recent = (this.hits.get(key) ?? []).filter((t) => t > cutoff)
    if (recent.length >= this.limit) {
      this.hits.set(key, recent)
      const oldest = recent[0] ?? now
      return { allowed: false, retryAfter: Math.max(1, Math.ceil((oldest + this.windowMs - now) / 1000)) }
    }
    recent.push(now)
    this.hits.set(key, recent)
    return { allowed: true }
  }

  /** Drops keys whose newest hit is outside the window. */
  sweep(now = Date.now()): void {
    const cutoff = now - this.windowMs
    for (const [key, times] of this.hits) {
      const newest = times[times.length - 1]
      if (newest === undefined || newest <= cutoff) this.hits.delete(key)
    }
  }

  get size(): number {
    return this.hits.size
  }
}
