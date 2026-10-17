import { Link, useSearchParams } from 'react-router'
import { CHAPTERS, chapterAttrs } from '../components/chapters'
import { Wordmark } from '../components/Logo'
import { useI18n } from '../i18n'

/** Calendly redirects here after a booking, with the event details in the query string. */
export default function SuccessSchedule() {
  const { t, locale } = useI18n()
  const [params] = useSearchParams()
  const event = params.get('event_type_name')
  const host = params.get('assigned_to')
  const start = params.get('event_start_time')
  const end = params.get('event_end_time')

  const fmt = (iso: string | null, opts: Intl.DateTimeFormatOptions) => {
    if (!iso) return null
    const d = new Date(iso)
    return Number.isNaN(d.getTime()) ? null : new Intl.DateTimeFormat(locale === 'pt' ? 'pt-BR' : 'en', opts).format(d)
  }
  const day = fmt(start, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const from = fmt(start, { hour: '2-digit', minute: '2-digit' })
  const to = fmt(end, { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })
  const hasDetails = Boolean(event || host || day)

  return (
    <main className="success" {...chapterAttrs(CHAPTERS.contact)}>
      <Link to={`/${locale}`} aria-label={t.nav.home} className="success-home">
        <Wordmark />
      </Link>
      <h1 className="display success-title">{t.success.heading}</h1>
      <p className="lead success-lead">{t.success.text}</p>
      {hasDetails ? (
        <dl className="success-details">
          {event && (<div><dt>{t.success.event}</dt><dd>{event}</dd></div>)}
          {host && (<div><dt>{t.success.with}</dt><dd>{host}</dd></div>)}
          {day && (<div><dt>{t.success.when}</dt><dd>{day}{from ? `, ${from}${to ? ` – ${to}` : ''}` : ''}</dd></div>)}
        </dl>
      ) : (
        <p className="success-missing">{t.success.missing}</p>
      )}
      <div className="success-actions">
        <Link className="button" to={`/${locale}#contact`}>{t.success.brief}</Link>
        <Link className="link link-plain" to={`/${locale}`}>{t.success.back}</Link>
      </div>
    </main>
  )
}
