// Contract shared by the React brief form (src/) and the API (server/).
// Keep this file dependency-free: it is compiled by both tsconfigs.

export const LOCALES = ['en', 'pt'] as const
export type Locale = (typeof LOCALES)[number]

export const STAGES = ['idea', 'prototype', 'live'] as const
export type Stage = (typeof STAGES)[number]

export const PLATFORMS = ['web', 'ios', 'android', 'ai'] as const
export type Platform = (typeof PLATFORMS)[number]

export const BUDGETS = ['small', 'medium', 'large', 'unsure'] as const
export type Budget = (typeof BUDGETS)[number]

export interface ContactRequest {
  name: string // 2–120 chars
  email: string // valid address, ≤ 254 chars
  company?: string // ≤ 120 chars
  project: string // 10–4000 chars: what they want to build
  stage: Stage
  platforms: Platform[] // at least one
  budget?: Budget
  locale: Locale
  website?: string // honeypot: must be empty, hidden from humans
}

export type ContactField = 'name' | 'email' | 'company' | 'project' | 'stage' | 'platforms' | 'budget'

/** Error codes, translated on the client. */
export type FieldError = 'required' | 'too_short' | 'too_long' | 'invalid'

export type ContactResponse =
  | { ok: true }
  | { ok: false; error: 'validation'; fields: Partial<Record<ContactField, FieldError>> }
  | { ok: false; error: 'rate_limited' | 'send_failed' | 'not_configured' }

/** Human labels used in the emails the server sends (the client has its own copy in i18n). */
export const LABELS: Record<Locale, { stage: Record<Stage, string>; platform: Record<Platform, string>; budget: Record<Budget, string> }> = {
  en: {
    stage: { idea: 'An idea', prototype: 'A prototype', live: 'A live product' },
    platform: { web: 'Web app', ios: 'iOS app', android: 'Android app', ai: 'AI features' },
    budget: { small: 'Under $15k', medium: '$15k – $50k', large: 'Over $50k', unsure: 'Not sure yet' },
  },
  pt: {
    stage: { idea: 'Uma ideia', prototype: 'Um protótipo', live: 'Um produto no ar' },
    platform: { web: 'Aplicação web', ios: 'App iOS', android: 'App Android', ai: 'Recursos de IA' },
    budget: { small: 'Até R$ 75 mil', medium: 'R$ 75 mil – 250 mil', large: 'Acima de R$ 250 mil', unsure: 'Ainda não sei' },
  },
}

export const LOCALE_COOKIE = 'wg_locale'
