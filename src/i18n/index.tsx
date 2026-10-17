import { createContext, useContext, type ReactNode } from 'react'
import { LOCALES, LOCALE_COOKIE, type Locale } from '../../shared/contact'
import en, { type Dict } from './en'
import pt from './pt'

const dictionaries: Record<Locale, Dict> = { en, pt }

export const isLocale = (v: unknown): v is Locale => LOCALES.includes(v as Locale)

/** Same rule as the server: saved choice first, then the browser language. */
export function detectLocale(): Locale {
  const saved = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]+)`))?.[1]
  if (isLocale(saved)) return saved
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const l of langs) {
    const code = l.toLowerCase().slice(0, 2)
    if (code === 'pt') return 'pt'
    if (code === 'en') return 'en'
  }
  return 'en'
}

export function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`
}

const I18nContext = createContext<{ locale: Locale; t: Dict }>({ locale: 'en', t: en })

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <I18nContext.Provider value={{ locale, t: dictionaries[locale] }}>{children}</I18nContext.Provider>
}

export const useI18n = () => useContext(I18nContext)

/** Fill {slot} placeholders. */
export const fill = (text: string, slots: Record<string, string>) =>
  text.replace(/\{(\w+)\}/g, (_, k: string) => slots[k] ?? `{${k}}`)
