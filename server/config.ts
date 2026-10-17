import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parseEnv } from 'node:util'

export const isProd = process.env.NODE_ENV === 'production'

// In development, read ./.env (if present) without overriding variables that are
// already set in the shell. In production the platform (Coolify, Docker) injects env vars.
if (!isProd) {
  const envFile = resolve(process.cwd(), '.env')
  if (existsSync(envFile)) {
    try {
      const parsed = parseEnv(readFileSync(envFile, 'utf8'))
      for (const [key, value] of Object.entries(parsed)) {
        if (process.env[key] === undefined && value !== undefined) process.env[key] = value
      }
    } catch (err) {
      console.warn(`[config] could not read ${envFile}:`, err)
    }
  }
}

const env = (name: string): string | undefined => {
  const value = process.env[name]?.trim()
  return value ? value : undefined
}

const port = Number.parseInt(env('PORT') ?? '3000', 10)

const contactTo = (env('CONTACT_TO') ?? 'contact@waygex.com')
  .split(',')
  .map((address) => address.trim())
  .filter(Boolean)

const rawGtm = env('GTM_TAG')
// Only accept a real container id: the value is inlined into a <script>.
const gtmTag = rawGtm && /^GTM-[A-Z0-9]+$/i.test(rawGtm) ? rawGtm.toUpperCase() : undefined
if (rawGtm && !gtmTag) console.warn(`[config] GTM_TAG "${rawGtm}" does not look like GTM-XXXXXXX; Tag Manager disabled.`)

export const config = {
  isProd,
  port: Number.isFinite(port) && port > 0 ? port : 3000,
  host: env('HOST') ?? '0.0.0.0',
  siteUrl: (env('SITE_URL') ?? 'https://waygex.com').replace(/\/+$/, ''),
  resendApiKey: env('RESEND_API_KEY'),
  resendFrom: env('RESEND_FROM') ?? 'Waygex <hello@waygex.com>',
  contactTo: contactTo.length > 0 ? contactTo : ['contact@waygex.com'],
  sendConfirmation: env('SEND_CONFIRMATION') !== 'false',
  gtmTag,
} as const

export type Config = typeof config
