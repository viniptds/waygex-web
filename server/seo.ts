// Per-locale <head> tags injected into the Vite-built SPA shell (dist/index.html).
import type { Locale } from '../shared/contact.js'
import { escapeHtml } from './html.js'

interface LocaleSeo {
  htmlLang: string
  ogLocale: string
  title: string
  description: string
  successTitle: string
}

export const SEO: Record<Locale, LocaleSeo> = {
  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    title: 'Waygex — From first idea to launched app',
    description:
      'Waygex is a software studio from Brazil. We design and build web and mobile apps from the first idea to launch, with AI inside the product and in how we work.',
    successTitle: 'Meeting booked — Waygex',
  },
  pt: {
    htmlLang: 'pt-BR',
    ogLocale: 'pt_BR',
    title: 'Waygex — Da primeira ideia ao app no ar',
    description:
      'A Waygex é um estúdio de software do Brasil. Desenhamos e desenvolvemos aplicativos web e mobile da primeira ideia ao lançamento, com IA dentro do produto e no nosso jeito de trabalhar.',
    successTitle: 'Reunião agendada — Waygex',
  },
}

/** Pages that must not be indexed (Calendly's post-booking redirect target). */
const NOINDEX_PATH = /\/success-schedule\/?$/

const gtmHead = (id: string) => `<!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${id}');</script>
    <!-- End Google Tag Manager -->`

const gtmBody = (id: string) => `<!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${id}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->`

export interface ShellOptions {
  locale: Locale
  /** Request pathname, e.g. `/pt/success-schedule` (no query string). */
  pathname: string
  siteUrl: string
  gtmTag?: string
}

export function renderShell(template: string, { locale, pathname, siteUrl, gtmTag }: ShellOptions): string {
  const seo = SEO[locale]
  // Path after the locale segment, without a trailing slash: '' | '/success-schedule'
  const rest = pathname.replace(/^\/(?:en|pt)(?=\/|$)/, '').replace(/\/+$/, '')
  const href = (lang: Locale) => `${siteUrl}/${lang}${rest}`
  const noindex = NOINDEX_PATH.test(pathname)
  const title = noindex ? seo.successTitle : seo.title
  const attr = escapeHtml

  const head = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${attr(seo.description)}" />`,
    noindex ? `<meta name="robots" content="noindex" />` : '',
    `<link rel="canonical" href="${attr(href(locale))}" />`,
    `<link rel="alternate" hreflang="en" href="${attr(href('en'))}" />`,
    `<link rel="alternate" hreflang="pt-BR" href="${attr(href('pt'))}" />`,
    `<link rel="alternate" hreflang="x-default" href="${attr(href('en'))}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Waygex" />`,
    `<meta property="og:title" content="${attr(title)}" />`,
    `<meta property="og:description" content="${attr(seo.description)}" />`,
    `<meta property="og:url" content="${attr(href(locale))}" />`,
    `<meta property="og:image" content="${attr(`${siteUrl}/brand/icon.png`)}" />`,
    `<meta property="og:locale" content="${seo.ogLocale}" />`,
    `<meta property="og:locale:alternate" content="${SEO[locale === 'en' ? 'pt' : 'en'].ogLocale}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${attr(title)}" />`,
    `<meta name="twitter:description" content="${attr(seo.description)}" />`,
    `<meta name="twitter:image" content="${attr(`${siteUrl}/brand/icon.png`)}" />`,
    gtmTag ? gtmHead(gtmTag) : '',
  ]
    .filter(Boolean)
    .join('\n    ')

  return template
    .replace('<html lang="en">', `<html lang="${seo.htmlLang}">`)
    .replace('<!--app-head-->', () => head)
    .replace('<!--app-body-->', () => (gtmTag ? gtmBody(gtmTag) : ''))
}
