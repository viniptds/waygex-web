import type { Locale } from '../../shared/contact'
import { site } from '../content/site'

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (opts: { url: string }) => void }
    dataLayer?: Record<string, unknown>[]
  }
}

let loading: Promise<void> | null = null

function loadCalendly(): Promise<void> {
  if (window.Calendly) return Promise.resolve()
  loading ??= new Promise((resolve, reject) => {
    const css = document.createElement('link')
    css.rel = 'stylesheet'
    css.href = 'https://assets.calendly.com/assets/external/widget.css'
    document.head.append(css)
    const js = document.createElement('script')
    js.src = 'https://assets.calendly.com/assets/external/widget.js'
    js.async = true
    js.onload = () => resolve()
    js.onerror = () => {
      loading = null
      reject(new Error('calendly'))
    }
    document.head.append(js)
  })
  return loading
}

export const calendlyUrl = (locale: Locale) => `${site.calendly[locale]}?hide_gdpr_banner=1`

export const track = (event: string, data: Record<string, unknown> = {}) => window.dataLayer?.push({ event, ...data })

/**
 * Click handler for "Book a call" links. The link's href is the Calendly page, so it still works
 * without JavaScript or if the widget fails to load; with the widget, it opens as a popup instead.
 */
export function openCalendly(e: React.MouseEvent<HTMLAnchorElement>, locale: Locale, source: string) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
  e.preventDefault()
  track('book_call', { source })
  const href = e.currentTarget.href
  loadCalendly()
    .then(() => window.Calendly!.initPopupWidget({ url: calendlyUrl(locale) }))
    .catch(() => window.open(href, '_blank', 'noopener'))
}
