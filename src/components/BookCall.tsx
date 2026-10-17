import type { ReactNode } from 'react'
import { useI18n } from '../i18n'
import { calendlyUrl, openCalendly } from '../lib/calendly'

/** The one primary action of the site. Opens Calendly as a popup, falls back to the Calendly page. */
export function BookCall({ source, className = 'button', children }: { source: string; className?: string; children?: ReactNode }) {
  const { locale, t } = useI18n()
  return (
    <a className={className} href={calendlyUrl(locale)} target="_blank" rel="noopener" onClick={(e) => openCalendly(e, locale, source)}>
      {children ?? t.nav.book}
    </a>
  )
}
