// Email templates: simple, table-based HTML with inline styles (works in Gmail,
// Outlook and Apple Mail) plus a plain-text alternative. All visitor input is escaped.
import { LABELS, type Locale } from '../shared/contact.js'
import type { Brief } from './contact.js'
import { escapeHtml } from './html.js'

export const BOOKING_URLS: Record<Locale, string> = {
  en: 'https://calendly.com/vinicius-padovan/initial-presentation',
  pt: 'https://calendly.com/vinicius-padovan/apresentacao-inicial',
}

export interface RenderedEmail {
  subject: string
  html: string
  text: string
}

const NAVY = '#231f4d'
const MAGENTA = '#c02867'
const LAVENDER = '#C5C0FF'
const WHITE = '#ffffff'
const CANVAS = '#f1f0fb' // light lavender tint for the page background
const MUTED = '#5d5a7e' // navy tint for secondary text
const RULE = '#e6e4f7'
const FONT = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`

const LANGUAGE_NAME: Record<Locale, string> = { en: 'English', pt: 'Portuguese' }

/** Escape, then keep the visitor's line breaks. */
const multiline = (value: string) => escapeHtml(value).replace(/\r?\n/g, '<br />')

const firstName = (name: string) => name.split(/\s+/)[0] || name

const excerpt = (value: string, max = 240) => {
  const flat = value.replace(/\s+/g, ' ').trim()
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat
}

function layout(opts: { lang: string; title: string; preheader: string; body: string; footer: string }): string {
  return `<!doctype html>
<html lang="${opts.lang}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light only" />
<meta name="supported-color-schemes" content="light only" />
<title>${opts.title}</title>
</head>
<body style="margin:0;padding:0;background-color:${CANVAS};-webkit-text-size-adjust:100%;">
<div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;mso-hide:all;">${opts.preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${CANVAS};">
  <tr>
    <td align="center" style="padding:32px 12px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:${WHITE};border-radius:12px;">
        <tr>
          <td style="background-color:${NAVY};padding:22px 32px;border-radius:12px 12px 0 0;font-family:${FONT};font-size:20px;line-height:24px;font-weight:700;letter-spacing:-0.01em;color:${WHITE};">
            Waygex<span style="color:${LAVENDER};">.</span>
          </td>
        </tr>
        <tr>
          <td style="height:4px;line-height:4px;font-size:0;background-color:${MAGENTA};">&nbsp;</td>
        </tr>
        <tr>
          <td style="padding:32px;font-family:${FONT};font-size:16px;line-height:1.6;color:${NAVY};">
${opts.body}
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;background-color:${LAVENDER};border-radius:0 0 12px 12px;font-family:${FONT};font-size:13px;line-height:1.5;color:${NAVY};">
            ${opts.footer}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}

const h1 = (html: string) =>
  `<h1 style="margin:0 0 16px;font-family:${FONT};font-size:24px;line-height:1.25;font-weight:700;color:${NAVY};">${html}</h1>`

const h2 = (html: string) =>
  `<h2 style="margin:32px 0 8px;font-family:${FONT};font-size:13px;line-height:1.4;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${MAGENTA};">${html}</h2>`

const p = (html: string, extra = '') => `<p style="margin:0 0 16px;${extra}">${html}</p>`

const link = (href: string, label: string) =>
  `<a href="${escapeHtml(href)}" style="color:${MAGENTA};text-decoration:underline;">${label}</a>`

const button = (href: string, label: string) => `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 8px;">
  <tr>
    <td style="border-radius:8px;background-color:${MAGENTA};">
      <a href="${escapeHtml(href)}" target="_blank" style="display:inline-block;padding:14px 24px;font-family:${FONT};font-size:15px;line-height:20px;font-weight:600;color:${WHITE};text-decoration:none;border-radius:8px;">${label}</a>
    </td>
  </tr>
</table>`

/** Label/value rows. Values must already be HTML-safe. */
const fieldsTable = (rows: Array<[label: string, valueHtml: string]>) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
${rows
  .map(
    ([label, value]) => `  <tr>
    <td valign="top" style="width:110px;padding:10px 12px 10px 0;border-bottom:1px solid ${RULE};font-family:${FONT};font-size:13px;line-height:1.5;font-weight:600;color:${MUTED};">${escapeHtml(label)}</td>
    <td valign="top" style="padding:10px 0;border-bottom:1px solid ${RULE};font-family:${FONT};font-size:15px;line-height:1.5;color:${NAVY};word-break:break-word;">${value}</td>
  </tr>`,
  )
  .join('\n')}
</table>`

const quote = (html: string) =>
  `<div style="margin:0 0 8px;padding:16px 20px;background-color:${CANVAS};border-left:4px solid ${LAVENDER};border-radius:4px;font-size:15px;line-height:1.6;color:${NAVY};word-break:break-word;">${html}</div>`

const textRows = (rows: Array<[string, string]>) => {
  const width = Math.max(...rows.map(([label]) => label.length)) + 2
  return rows.map(([label, value]) => `${`${label}:`.padEnd(width)}${value}`).join('\n')
}

// ---------------------------------------------------------------------------
// Internal email to the Waygex team (always in English).
// ---------------------------------------------------------------------------

export function teamEmail(brief: Brief, opts: { submittedAt: Date; siteUrl: string }): RenderedEmail {
  const L = LABELS.en
  const stage = L.stage[brief.stage]
  const platforms = brief.platforms.map((pl) => L.platform[pl]).join(', ')
  const budget = brief.budget ? L.budget[brief.budget] : 'Not specified'
  const company = brief.company ?? '—'
  const language = `${LANGUAGE_NAME[brief.locale]} (${brief.locale})`
  const when = `${opts.submittedAt.toISOString().slice(0, 16).replace('T', ' ')} UTC`
  const site = opts.siteUrl.replace(/^https?:\/\//, '')

  const subject = `New brief: ${brief.name}${brief.company ? ` (${brief.company})` : ''} · ${stage}`

  const languageLine =
    brief.locale === 'en'
      ? `Visitor's language: English.`
      : `Visitor's language: ${LANGUAGE_NAME[brief.locale]}. Reply in ${LANGUAGE_NAME[brief.locale]}.`

  const html = layout({
    lang: 'en',
    title: escapeHtml(subject),
    preheader: escapeHtml(`${stage} · ${platforms} · ${budget}`),
    body: [
      h1(`New brief from ${escapeHtml(brief.name)}`),
      p(`Reply to this email to answer ${escapeHtml(firstName(brief.name))} directly.`),
      p(`<strong>${escapeHtml(languageLine)}</strong>`, `padding:10px 14px;background-color:${CANVAS};border-radius:6px;`),
      fieldsTable([
        ['Name', escapeHtml(brief.name)],
        ['Email', link(`mailto:${brief.email}`, escapeHtml(brief.email))],
        ['Company', escapeHtml(company)],
        ['Stage', escapeHtml(stage)],
        ['Platforms', escapeHtml(platforms)],
        ['Budget', escapeHtml(budget)],
        ['Language', escapeHtml(language)],
      ]),
      h2('Project'),
      quote(multiline(brief.project)),
    ].join('\n'),
    footer: `Sent from the brief form on ${escapeHtml(site)} · ${when}`,
  })

  const text = [
    `New brief from ${brief.name}`,
    '',
    languageLine,
    '',
    textRows([
      ['Name', brief.name],
      ['Email', brief.email],
      ['Company', company],
      ['Stage', stage],
      ['Platforms', platforms],
      ['Budget', budget],
      ['Language', language],
    ]),
    '',
    'Project:',
    brief.project,
    '',
    '---',
    `Reply to this email to answer ${firstName(brief.name)} directly.`,
    `Sent from the brief form on ${site} · ${when}`,
  ].join('\n')

  return { subject, html, text }
}

// ---------------------------------------------------------------------------
// Confirmation to the visitor, in their language.
// ---------------------------------------------------------------------------

const CONFIRMATION_COPY: Record<
  Locale,
  {
    subject: string
    preheader: (first: string) => string
    heading: (first: string) => string
    intro: string
    sooner: string
    cta: string
    summary: string
    labels: { company: string; stage: string; platforms: string; budget: string; project: string }
    reply: string
    signoff: string
    footer: (site: string) => string
  }
> = {
  en: {
    subject: 'We received your brief — Waygex',
    preheader: (first) => `Thanks, ${first}. We'll reply within 1–2 business days with next steps.`,
    heading: (first) => `Thanks, ${first}. We've got your brief.`,
    intro:
      "Thanks for telling us what you want to build. We'll read it carefully and reply within 1–2 business days with next steps.",
    sooner: 'Prefer to talk it through sooner? Pick a time for an intro call.',
    cta: 'Book an intro call',
    summary: 'What you sent',
    labels: { company: 'Company', stage: 'Stage', platforms: 'Platforms', budget: 'Budget', project: 'Project' },
    reply: 'Anything to add or change? Just reply to this email.',
    signoff: '— The Waygex team',
    footer: (site) =>
      `You're receiving this because this address was used to send a brief on ${site}. If that wasn't you, you can ignore this email.`,
  },
  pt: {
    subject: 'Recebemos seu briefing — Waygex',
    preheader: (first) => `Obrigado, ${first}. Respondemos em 1 a 2 dias úteis com os próximos passos.`,
    heading: (first) => `Obrigado, ${first}. Recebemos seu briefing.`,
    intro:
      'Obrigado por nos contar o que você quer construir. Vamos ler com atenção e responder em 1 a 2 dias úteis com os próximos passos.',
    sooner: 'Prefere conversar antes? Escolha um horário para uma apresentação inicial.',
    cta: 'Agendar apresentação inicial',
    summary: 'O que você enviou',
    labels: { company: 'Empresa', stage: 'Estágio', platforms: 'Plataformas', budget: 'Orçamento', project: 'Projeto' },
    reply: 'Quer acrescentar ou mudar algo? É só responder a este e-mail.',
    signoff: '— Equipe Waygex',
    footer: (site) =>
      `Você está recebendo este e-mail porque este endereço foi usado para enviar um briefing em ${site}. Se não foi você, pode ignorar esta mensagem.`,
  },
}

export function confirmationEmail(brief: Brief, opts: { siteUrl: string }): RenderedEmail {
  const locale = brief.locale
  const copy = CONFIRMATION_COPY[locale]
  const L = LABELS[locale]
  const first = firstName(brief.name)
  const bookingUrl = BOOKING_URLS[locale]
  const siteHome = `${opts.siteUrl}/${locale}`
  const site = opts.siteUrl.replace(/^https?:\/\//, '')

  const rows: Array<[string, string]> = []
  if (brief.company) rows.push([copy.labels.company, brief.company])
  rows.push([copy.labels.stage, L.stage[brief.stage]])
  rows.push([copy.labels.platforms, brief.platforms.map((pl) => L.platform[pl]).join(', ')])
  if (brief.budget) rows.push([copy.labels.budget, L.budget[brief.budget]])
  rows.push([copy.labels.project, excerpt(brief.project)])

  const html = layout({
    lang: locale === 'pt' ? 'pt-BR' : 'en',
    title: escapeHtml(copy.subject),
    preheader: escapeHtml(copy.preheader(first)),
    body: [
      h1(escapeHtml(copy.heading(first))),
      p(escapeHtml(copy.intro)),
      p(escapeHtml(copy.sooner), 'margin-bottom:8px;'),
      button(bookingUrl, escapeHtml(copy.cta)),
      h2(escapeHtml(copy.summary)),
      fieldsTable(rows.map(([label, value]) => [label, escapeHtml(value)])),
      p(escapeHtml(copy.reply), 'margin-top:24px;'),
      p(escapeHtml(copy.signoff), 'margin:0;font-weight:600;'),
    ].join('\n'),
    footer: `${escapeHtml(copy.footer(site))}<br />${link(siteHome, escapeHtml(site))}`,
  })

  const text = [
    copy.heading(first),
    '',
    copy.intro,
    '',
    copy.sooner,
    `${copy.cta}: ${bookingUrl}`,
    '',
    `${copy.summary}:`,
    textRows(rows),
    '',
    copy.reply,
    '',
    copy.signoff,
    siteHome,
    '',
    '---',
    copy.footer(site),
  ].join('\n')

  return { subject: copy.subject, html, text }
}
