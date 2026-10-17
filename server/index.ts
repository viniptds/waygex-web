// Waygex web server: serves the Vite build (dist/) with per-locale SEO tags,
// keeps the old Laravel locale routing, and handles the brief form (POST /api/contact).
import { config } from './config.js' // first: loads .env in development

import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { serve } from '@hono/node-server'
import { getConnInfo } from '@hono/node-server/conninfo'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono, type Context } from 'hono'
import { bodyLimit } from 'hono/body-limit'
import { getCookie, setCookie } from 'hono/cookie'
import { HTTPException } from 'hono/http-exception'
import { Resend } from 'resend'
import { LOCALE_COOKIE, type ContactResponse, type Locale } from '../shared/contact.js'
import { RateLimiter, isHoneypotFilled, validateContact } from './contact.js'
import { confirmationEmail, teamEmail, type RenderedEmail } from './email.js'
import {
  isLocale,
  localeFromAcceptLanguage,
  localeFromPath,
  looksLikeFile,
  prefixLocale,
  swapLocaleInReferer,
} from './locale.js'
import { renderShell } from './seo.js'

// ---------------------------------------------------------------------------
// Boot: locate the Vite build and read the SPA shell once.
// ---------------------------------------------------------------------------

const here = path.dirname(fileURLToPath(import.meta.url))
// cwd/dist covers Docker (WORKDIR /app) and `npm start`; the others cover running
// the compiled file (dist-server/server/index.js) or tsx (server/index.ts) from elsewhere.
const distDir = [path.resolve(process.cwd(), 'dist'), path.resolve(here, '../../dist'), path.resolve(here, '../dist')].find(
  (dir) => existsSync(path.join(dir, 'index.html')),
)
const shellTemplate = distDir ? readFileSync(path.join(distDir, 'index.html'), 'utf8') : undefined

if (shellTemplate && !shellTemplate.includes('<!--app-head-->')) {
  console.warn('[server] dist/index.html has no <!--app-head--> placeholder: SEO tags will not be injected.')
}
if (!distDir) {
  if (config.isProd) console.error('[server] dist/index.html not found: run `npm run build` first. Pages will 404.')
  else console.info('[server] No dist/ build found: open the Vite dev server at http://localhost:5173 (it proxies /api here).')
}

const resend = config.resendApiKey ? new Resend(config.resendApiKey) : undefined
if (!resend) {
  console.warn(
    `[contact] RESEND_API_KEY is not set: POST /api/contact will answer 503 not_configured${
      config.isProd ? '.' : ' and print the would-be emails to this console.'
    }`,
  )
}

const DEV_HINT =
  'Not found. This is the API server (no dist/ build found). In development, open the Vite dev server at http://localhost:5173.'

const ONE_YEAR = 60 * 60 * 24 * 365
const CACHE_IMMUTABLE = 'public, max-age=31536000, immutable'
const CACHE_SHORT = 'public, max-age=3600'
const CONTACT_MAX_BYTES = 16 * 1024

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const rawPath = (c: Context) => new URL(c.req.url).pathname
const isGetLike = (c: Context) => c.req.method === 'GET' || c.req.method === 'HEAD'

const isHttps = (c: Context) =>
  new URL(c.req.url).protocol === 'https:' || c.req.header('x-forwarded-proto')?.split(',')[0]?.trim() === 'https'

const setLocaleCookie = (c: Context, locale: Locale) =>
  setCookie(c, LOCALE_COOKIE, locale, { path: '/', maxAge: ONE_YEAR, sameSite: 'Lax', secure: isHttps(c) })

/**
 * Client IP for rate limiting. Behind Coolify's proxy (Traefik) X-Forwarded-For
 * carries the visitor's address. Note the first entry is client-supplied when the
 * proxy does not strip incoming X-Forwarded-For; good enough for a contact form.
 */
function clientIp(c: Context): string {
  const forwarded = c.req.header('x-forwarded-for')?.split(',')[0]?.trim()
  if (forwarded) return forwarded
  const realIp = c.req.header('x-real-ip')?.trim()
  if (realIp) return realIp
  try {
    return getConnInfo(c).remote.address ?? 'unknown'
  } catch {
    return 'unknown'
  }
}

const reply = (c: Context, body: ContactResponse, status: 200 | 400 | 413 | 415 | 429 | 500 | 503 = 200) =>
  c.json(body, status)

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timed out after ${ms}ms`)), ms)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error: unknown) => {
        clearTimeout(timer)
        reject(error)
      },
    )
  })
}

async function sendEmail(payload: RenderedEmail & { to: string | string[]; replyTo: string }): Promise<void> {
  if (!resend) throw new Error('Resend is not configured')
  const { error } = await withTimeout(
    resend.emails.send({
      from: config.resendFrom,
      to: payload.to,
      replyTo: payload.replyTo,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    }),
    15_000,
  )
  if (error) throw new Error(`Resend ${error.name}: ${error.message}`)
}

function logWouldBeEmail(label: string, email: RenderedEmail & { to: string | string[]; replyTo: string }) {
  const to = Array.isArray(email.to) ? email.to.join(', ') : email.to
  console.info(
    [
      `\n----- [dev] would send ${label} -----`,
      `From:     ${config.resendFrom}`,
      `To:       ${to}`,
      `Reply-To: ${email.replyTo}`,
      `Subject:  ${email.subject}`,
      '',
      email.text,
      `----- end ${label} -----\n`,
    ].join('\n'),
  )
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------

const app = new Hono()

// Security headers + one log line per request (production; API only in dev).
app.use('*', async (c, next) => {
  const started = performance.now()
  await next()
  c.header('X-Content-Type-Options', 'nosniff')
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
  c.header('X-Frame-Options', 'SAMEORIGIN')
  // No Content-Security-Policy on purpose: Calendly's popup widget, Google Tag Manager
  // (and whatever tags it loads) and Fontshare would all need allow-listing. Add a
  // careful CSP (report-only first) once the third parties are settled.
  const pathname = rawPath(c)
  if (pathname !== '/api/health' && (config.isProd || pathname.startsWith('/api/'))) {
    console.log(`${c.req.method} ${pathname} ${c.res.status} ${Math.round(performance.now() - started)}ms`)
  }
})

app.onError((err, c) => {
  if (err instanceof HTTPException) return err.getResponse()
  console.error(`[server] ${c.req.method} ${rawPath(c)} failed:`, err)
  if (rawPath(c) === '/api/contact') return reply(c, { ok: false, error: 'send_failed' }, 500)
  if (rawPath(c).startsWith('/api/')) return c.json({ ok: false, error: 'internal_error' }, 500)
  return c.text('Internal Server Error', 500)
})

// --- API -------------------------------------------------------------------

app.get('/api/health', (c) => {
  c.header('Cache-Control', 'no-store')
  return c.json({ ok: true })
})

const limiter = new RateLimiter(5, 10 * 60 * 1000)
const sweepTimer = setInterval(() => limiter.sweep(), 60 * 1000)
sweepTimer.unref()

app.post(
  '/api/contact',
  async (c, next) => {
    const verdict = limiter.hit(clientIp(c))
    if (!verdict.allowed) {
      c.header('Retry-After', String(verdict.retryAfter))
      return reply(c, { ok: false, error: 'rate_limited' }, 429)
    }
    await next()
  },
  bodyLimit({
    maxSize: CONTACT_MAX_BYTES,
    // Only a huge project description can get here; map it onto the contract.
    onError: (c) => reply(c, { ok: false, error: 'validation', fields: { project: 'too_long' } }, 413),
  }),
  async (c) => {
    // Requiring JSON also forces a CORS preflight for cross-site posts (which we never allow).
    if (!/^application\/json\b/i.test(c.req.header('content-type') ?? '')) {
      return reply(c, { ok: false, error: 'validation', fields: {} }, 415)
    }

    let input: unknown
    try {
      input = JSON.parse(await c.req.text())
    } catch {
      input = undefined // treated as an empty form: every required field reports 'required'
    }

    if (isHoneypotFilled(input)) {
      console.info(`[contact] honeypot filled (ip ${clientIp(c)}): dropped silently`)
      return reply(c, { ok: true })
    }

    const result = validateContact(input)
    if (!result.ok) return reply(c, { ok: false, error: 'validation', fields: result.fields }, 400)

    const brief = result.brief
    const team = {
      ...teamEmail(brief, { submittedAt: new Date(), siteUrl: config.siteUrl }),
      to: config.contactTo,
      replyTo: brief.email,
    }
    const confirmation = config.sendConfirmation
      ? { ...confirmationEmail(brief, { siteUrl: config.siteUrl }), to: brief.email, replyTo: config.contactTo[0] ?? 'contact@waygex.com' }
      : undefined

    if (!resend) {
      if (!config.isProd) {
        logWouldBeEmail('team email', team)
        if (confirmation) logWouldBeEmail(`confirmation (${brief.locale})`, confirmation)
      }
      return reply(c, { ok: false, error: 'not_configured' }, 503)
    }

    try {
      await sendEmail(team)
    } catch (err) {
      console.error('[contact] team email failed:', err)
      return reply(c, { ok: false, error: 'send_failed' }, 500)
    }

    if (confirmation) {
      try {
        await sendEmail(confirmation)
      } catch (err) {
        console.error(`[contact] confirmation to visitor failed (team email was sent):`, err)
      }
    }

    console.info(`[contact] brief from ${brief.email} sent (${brief.locale}, ${brief.stage})`)
    return reply(c, { ok: true })
  },
)

app.all('/api/*', (c) => c.json({ ok: false, error: 'not_found' }, 404))

// --- Locale routing (port of the Laravel Locale middleware) -----------------

// Legacy language switcher: /locale/pt -> back to the Referer page in that language.
app.get('/locale/:lang', (c) => {
  const requested = c.req.param('lang')
  const locale: Locale = isLocale(requested) ? requested : 'en'
  setLocaleCookie(c, locale)
  c.header('Cache-Control', 'no-store')
  return c.redirect(swapLocaleInReferer(c.req.header('referer'), locale), 302)
})

// Any page URL without /en or /pt in front: pick a language and redirect.
app.use('*', async (c, next) => {
  if (!isGetLike(c)) return next()
  const url = new URL(c.req.url)
  const pathname = url.pathname
  if (pathname === '/api' || pathname.startsWith('/api/')) return next()
  if (localeFromPath(pathname) || looksLikeFile(pathname)) return next()

  const fromCookie = getCookie(c, LOCALE_COOKIE)
  const locale = isLocale(fromCookie) ? fromCookie : localeFromAcceptLanguage(c.req.header('accept-language'))
  c.header('Vary', 'Cookie, Accept-Language')
  c.header('Cache-Control', 'no-store')
  return c.redirect(`${prefixLocale(locale, pathname)}${url.search}`, 302)
})

// --- Static files from the Vite build ----------------------------------------

if (distDir) {
  const staticFiles = serveStatic({ root: distDir })
  app.use('*', async (c, next) => {
    const pathname = rawPath(c)
    // Only file-like paths; never expose the raw shell template.
    if (!isGetLike(c) || !looksLikeFile(pathname) || pathname === '/index.html') return next()
    const res = await staticFiles(c, async () => {})
    if (!res) return next()
    res.headers.set('Cache-Control', pathname.startsWith('/assets/') ? CACHE_IMMUTABLE : CACHE_SHORT)
    return res
  })
}

// --- SPA shell for /en/* and /pt/* -------------------------------------------

app.get('*', (c) => {
  const pathname = rawPath(c)
  const locale = localeFromPath(pathname)
  if (!shellTemplate) return c.text(config.isProd ? 'Not found' : DEV_HINT, 404)
  if (!locale) return c.text('Not found', 404)

  setLocaleCookie(c, locale)
  c.header('Cache-Control', 'no-cache')
  return c.html(renderShell(shellTemplate, { locale, pathname, siteUrl: config.siteUrl, gtmTag: config.gtmTag }))
})

// ---------------------------------------------------------------------------
// Start + graceful shutdown
// ---------------------------------------------------------------------------

const server = serve({ fetch: app.fetch, port: config.port, hostname: config.host }, (info) => {
  console.log(
    `[server] listening on http://${info.address}:${info.port} (${config.isProd ? 'production' : 'development'})` +
      ` · static: ${distDir ?? 'none'} · mail to: ${config.contactTo.join(', ')} · confirmation: ${config.sendConfirmation ? 'on' : 'off'}` +
      ` · GTM: ${config.gtmTag ?? 'off'}`,
  )
})

let shuttingDown = false
function shutdown(signal: string) {
  if (shuttingDown) return
  shuttingDown = true
  console.log(`[server] ${signal} received, closing…`)
  clearInterval(sweepTimer)
  server.close((err) => {
    if (err) console.error('[server] error while closing:', err)
    process.exit(err ? 1 : 0)
  })
  if ('closeIdleConnections' in server) server.closeIdleConnections()
  setTimeout(() => {
    console.warn('[server] still busy after 10s, forcing exit')
    process.exit(1)
  }, 10_000).unref()
}
process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
