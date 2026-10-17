# waygex-web

The Waygex marketing site (waygex.com): a React single-page app built with Vite, served by a
small Node server that also handles the project-brief form. It replaces the old Laravel site in
the parent folder and keeps its URLs (`/en/...`, `/pt/...`, `/locale/{lang}`).

## Stack

- **Frontend** (`src/`): React 19, React Router, TypeScript, Vite.
- **Server** (`server/`): [Hono](https://hono.dev) on `@hono/node-server`. It serves the built app,
  injects per-language SEO tags into the HTML shell, redirects to the right language and exposes
  `POST /api/contact`.
- **Email**: [Resend](https://resend.com) (`resend` SDK).
- **Shared contract** (`shared/contact.ts`): request/response types, allowed values and email labels
  for the brief form, used by both the React form and the server.

```
src/              React app
public/           static files copied as-is into dist/ (logos, images, icons)
shared/           code shared by client and server (contact form contract)
server/           Node server: index.ts (routes), contact.ts (validation, rate limit),
                  email.ts (email templates), seo.ts (head tags), locale.ts (language routing)
dist/             vite build output (generated)
dist-server/      compiled server (generated)
```

## Development

Requires Node 20+ (the Docker image uses Node 22).

```bash
npm install
cp .env.example .env   # optional; fill RESEND_API_KEY to really send emails
npm run dev
```

`npm run dev` starts two processes:

- **web**: Vite on http://localhost:5173. Open this one. It hot-reloads and proxies `/api/*` to the server.
- **api**: the Node server on http://localhost:3000 (`tsx watch`, restarts on change).

Without `RESEND_API_KEY`, submitting the form returns `503 not_configured` and the server prints the
emails it would have sent to its console, so the whole flow can be tested without a Resend account.
To test real delivery, use a Resend key and a verified sender (or Resend's `onboarding@resend.dev`
sender, which can only email your own address).

In development the SEO tags and Tag Manager snippet are not injected (Vite serves `index.html`
itself); run a production build to see them.

Other scripts:

| Script               | What it does                                                        |
| -------------------- | ------------------------------------------------------------------- |
| `npm run dev:web`    | Vite only                                                           |
| `npm run dev:api`    | server only                                                         |
| `npm run typecheck`  | type-check app and server                                           |
| `npm run build`      | type-check, build the app to `dist/`, compile the server to `dist-server/` |
| `npm start`          | run the production server (`node dist-server/server/index.js`)      |

## Build and run in production mode locally

```bash
npm run build
NODE_ENV=production PORT=3000 npm start
# open http://localhost:3000
```

Or with Docker:

```bash
docker build -t waygex-web .
docker run --rm -p 3000:3000 --env-file .env waygex-web
```

## Environment variables

| Variable            | Default                      | Description |
| ------------------- | ---------------------------- | ----------- |
| `PORT`              | `3000`                       | Port the server listens on (host is `0.0.0.0`). |
| `SITE_URL`          | `https://waygex.com`         | Public origin for canonical, hreflang and Open Graph URLs and links in emails. No trailing slash. |
| `RESEND_API_KEY`    | (none)                       | Resend API key. Without it the contact endpoint answers `503 not_configured` (a warning is logged at boot). |
| `RESEND_FROM`       | `Waygex <hello@waygex.com>`  | Sender of both emails. **Its domain must be verified in Resend.** |
| `CONTACT_TO`        | `contact@waygex.com`         | Inbox(es) that receive new briefs, comma-separated. The first one is the Reply-To of the visitor's confirmation. |
| `SEND_CONFIRMATION` | `true`                       | Set to `false` to stop emailing a confirmation to the visitor. |
| `GTM_TAG`           | (none)                       | Google Tag Manager container id (`GTM-XXXXXXX`). Empty disables Tag Manager. |

`NODE_ENV=production` is set by the Docker image. Outside production the server also reads `./.env`.

## Deploying on Coolify

The app lives in the `waygex-web/` folder of the repository and ships its own `Dockerfile`.

1. In Coolify: **+ New Resource → Public/Private Repository** (GitHub App or deploy key), pick this
   repository and the branch to deploy.
2. **Build Pack**: `Dockerfile`.
3. **Base Directory**: `/waygex-web` (Dockerfile location stays `/Dockerfile`, relative to the base directory).
4. **Ports Exposes**: `3000`.
5. **Environment Variables**: add `SITE_URL`, `RESEND_API_KEY`, `RESEND_FROM`, `CONTACT_TO`, and
   optionally `SEND_CONFIRMATION` and `GTM_TAG` (see the table above). Mark `RESEND_API_KEY` as a secret.
   They are runtime variables; none is needed at build time.
6. **Health check**: enable it with path `/api/health`, port `3000` (the image also defines a Docker
   `HEALTHCHECK` against the same endpoint).
7. **Domains**: set `https://waygex.com` (and `https://www.waygex.com` with a redirect if wanted).
   Coolify's proxy issues the TLS certificate once DNS points at the server.
8. Deploy. Check the logs for `[server] listening on http://0.0.0.0:3000 (production)` and for a
   `RESEND_API_KEY is not set` warning, which means the form will not send.

In Resend, verify the domain used in `RESEND_FROM` (Domains → Add domain, then add the SPF/DKIM DNS
records) before going live.

Notes:

- The contact rate limit (5 requests per IP per 10 minutes) is kept in memory: it resets on deploy
  and is per instance. Run a single instance, or move it to a shared store if you scale out.
- The server uses the first `X-Forwarded-For` address as the visitor IP, as set by Coolify's proxy.

## How language routing works

Supported languages: `en` and `pt` (Brazilian Portuguese). Every page lives under `/en/...` or `/pt/...`.

- A `GET` for a page without a language prefix (for example `/` or `/success-schedule?x=1`) gets a
  **302** to `/{lang}{path}`, keeping the query string (`/` → `/en`). Files (paths with an extension)
  and `/api/*` are never redirected.
- The language is the `wg_locale` cookie if set, otherwise the browser's `Accept-Language`
  (Portuguese wins when any `pt*` entry has a higher preference than English; otherwise English).
- Every `/en/...` or `/pt/...` page response sets `wg_locale` (1 year, `Path=/`, `SameSite=Lax`), so
  the last language visited is remembered. The cookie is readable by JavaScript, so the app can update
  it when the visitor switches language without a full page load.
- The legacy `GET /locale/{lang}` link still works: it sets the cookie and sends the visitor back to
  the page they came from (the `Referer`) in the new language, or to `/{lang}`.
- The server returns the same HTML shell for every `/en/*` and `/pt/*` URL with `<html lang>`, title,
  description, canonical, hreflang alternates and Open Graph/Twitter tags for that language; React
  Router renders the page. `*/success-schedule` (where Calendly sends people after booking) gets its
  own title and `noindex`.

Hashed files under `/assets/` are cached for a year (`immutable`); other static files for an hour;
HTML is `no-cache` so deploys show up immediately.

## Editing content

- **Copy (text)**: `src/i18n/en.ts` (English) and `src/i18n/pt.ts` (Portuguese). Keep the same keys
  in both files.
- **Partners**: `src/content/partners.ts`. Add, remove or hide (`hidden: true`) an entry. With
  `USE_LOGOS = true` each partner gets the same white tile with its logo scaled to fit (files in
  `public/partners/`, any format); a missing logo falls back to the name. With `false` the band shows
  the names in large type.
- **Company facts** (email, CNPJ, Calendly links, social links): `src/content/site.ts`.
- **Photographs and their credits**: `src/content/imagery.ts` (files in `public/images/photos/`).
  The founder portrait is `public/team/profile.jpg` (`profile.jpeg` on `/x-ray`).
- **Sample app screens** in the hero and "How we work": `src/components/Screens.tsx`, text in the
  `screens` block of the i18n files.
- **SEO title and description** (what search engines and link previews show): `server/seo.ts`.
- **Emails** (internal notification and visitor confirmation): `server/email.ts`. The stage, platform
  and budget labels used in emails come from `shared/contact.ts`.
