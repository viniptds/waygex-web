// The colour of every chapter. Each section is one flat field; the fixed bar copies these.
// Brand colours from the original site: navy #231f4d, magenta #c02867, lavender #c5c0ff, gold #bf9228.

export interface ChapterColours {
  ground: string
  ink: string
  accent: string
}

const navy = '#231f4d'
const paper = '#f8f6fb'
const white = '#ffffff'
const magenta = '#c02867'

export const CHAPTERS = {
  services: { ground: '#c5c0ff', ink: navy, accent: magenta },
  process: { ground: '#ece7f5', ink: navy, accent: magenta },
  partners: { ground: magenta, ink: white, accent: navy },
  paper: { ground: paper, ink: navy, accent: magenta },
  faqHead: { ground: '#bf9228', ink: navy, accent: magenta },
  contact: { ground: navy, ink: paper, accent: magenta },
  footer: { ground: magenta, ink: white, accent: navy },
} satisfies Record<string, ChapterColours>

/** Spread onto a <section> so the fixed bar can read the chapter colours. */
export const chapterAttrs = (c: ChapterColours) => ({
  'data-ground': c.ground,
  'data-ink': c.ink,
  'data-accent': c.accent,
  style: { background: c.ground, color: c.ink, '--accent': c.accent } as React.CSSProperties,
})
