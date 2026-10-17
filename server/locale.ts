// Port of the Laravel `Locale` middleware + `PublicController::setLocale`.
import { LOCALES, type Locale } from '../shared/contact.js'

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (LOCALES as readonly string[]).includes(value)

/** `/en`, `/en/`, `/en/anything` (exact first segment). Returns the locale or undefined. */
export function localeFromPath(pathname: string): Locale | undefined {
  const match = /^\/(en|pt)(?:\/|$)/.exec(pathname)
  return match ? (match[1] as Locale) : undefined
}

/** True when the last path segment has an extension, e.g. `/brand/icon.png`. */
export function looksLikeFile(pathname: string): boolean {
  const last = pathname.slice(pathname.lastIndexOf('/') + 1)
  return /\.[A-Za-z0-9]+$/.test(last)
}

/**
 * Pick 'pt' when the visitor prefers any `pt*` language over any `en*` one,
 * otherwise 'en'. Equal q-values are broken by the order in the header.
 */
export function localeFromAcceptLanguage(header: string | undefined): Locale {
  if (!header) return 'en'
  const best: Record<Locale, { q: number; index: number }> = {
    en: { q: 0, index: Number.POSITIVE_INFINITY },
    pt: { q: 0, index: Number.POSITIVE_INFINITY },
  }
  header.split(',').forEach((part, index) => {
    const [rawTag = '', ...params] = part.split(';')
    const tag = rawTag.trim().toLowerCase()
    const lang: Locale | undefined = tag === 'pt' || tag.startsWith('pt-') ? 'pt' : tag === 'en' || tag.startsWith('en-') ? 'en' : undefined
    if (!lang) return
    let q = 1
    for (const param of params) {
      const m = /^\s*q\s*=\s*([0-9.]+)\s*$/i.exec(param)
      if (m) q = Number(m[1])
    }
    if (!Number.isFinite(q) || q <= 0) return
    const current = best[lang]
    if (q > current.q || (q === current.q && index < current.index)) best[lang] = { q, index }
  })
  const { en, pt } = best
  if (pt.q > en.q) return 'pt'
  if (pt.q > 0 && pt.q === en.q && pt.index < en.index) return 'pt'
  return 'en'
}

/** `/` -> `/en`, `/success-schedule` -> `/en/success-schedule` (query string appended by caller). */
export function prefixLocale(locale: Locale, pathname: string): string {
  return pathname === '/' || pathname === '' ? `/${locale}` : `/${locale}${pathname}`
}

/**
 * Legacy `/locale/:lang`: swap the first segment of the Referer path for `lang`
 * (or prepend it). Only the path and query of the Referer are used, so the
 * redirect always stays on this host.
 */
export function swapLocaleInReferer(referer: string | undefined, locale: Locale): string {
  if (!referer) return `/${locale}`
  let url: URL
  try {
    url = new URL(referer)
  } catch {
    return `/${locale}`
  }
  const segments = url.pathname.split('/').filter(Boolean)
  if (segments[0] === 'locale') return `/${locale}` // never bounce back into this route
  if (isLocale(segments[0])) segments[0] = locale
  else segments.unshift(locale)
  return `/${segments.join('/')}${url.search}`
}
