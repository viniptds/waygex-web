// ─────────────────────────────────────────────────────────────────────────────
// Partners shown in the running band on the home page.
//
// To add a partner: copy one entry and change it. To remove one: delete it.
// To hide one without deleting it: set `hidden: true`.
// With USE_LOGOS off, the band shows the names set in large type.
// With USE_LOGOS on, every partner sits on the same white tile: the logo is
// scaled to fit (any format, any colour), or the name if there is no logo.
// Drop logo files in public/partners/ and reference them as '/partners/<file>'.
// Logos with little empty space around them look best (trim the margins).
// ─────────────────────────────────────────────────────────────────────────────

export interface Partner {
  /** Name as it should read in the band. */
  name: string
  /** Optional link to the partner's site (opens in a new tab). */
  url?: string
  /** Optional logo file in public/partners/ (SVG, PNG, JPG or WebP). */
  logo?: string
  /** Keep the entry but leave it off the page. */
  hidden?: boolean
}

export const partners: Partner[] = [
  { name: 'Cronos', logo: '/partners/cronos-logo.svg', url: 'https://cronosbank.com.br' },
  { name: 'HolidAI', logo: '/partners/holid-ai-logo.png', url: 'https://holid.waygex.com' },
  { name: 'OAB', logo: '/partners/oab-logo.png', url: 'https://oabce.org.br' },
  { name: 'Biio', logo: '/partners/biio-logo.png' },
  { name: 'InfinityCheck', logo: '/partners/infinitycheck-logo.png', url: 'https://infinitycheck.com.br' },

  { name: 'MM LaFleur', url: 'https://mmlafleur.com', logo: '/partners/mmlafleur-logo.svg' },
]

/** true: logos on white tiles. false: names in large type. */
export const USE_LOGOS = true

export const visiblePartners = () => partners.filter((p) => !p.hidden)
