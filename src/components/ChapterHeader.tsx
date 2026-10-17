import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import { BookCall } from './BookCall'
import { LangSwitch } from './LangSwitch'
import { Wordmark } from './Logo'

interface Chapter {
  ground: string
  ink: string
  accent: string
}

/**
 * The fixed bar that appears once the hero has scrolled away. It takes the ground and ink of the
 * chapter underneath it (every section declares data-ground / data-ink / data-accent), switching
 * with a short colour transition as each section edge passes.
 */
export function ChapterHeader() {
  const { t } = useI18n()
  const [visible, setVisible] = useState(false)
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const hero = document.getElementById('top')
    const sections = document.querySelectorAll<HTMLElement>('[data-ground]')
    const heroIo = new IntersectionObserver(([e]) => setVisible(!e.isIntersecting), { rootMargin: '-64px 0px 0px 0px' })
    if (hero) heroIo.observe(hero)
    // A thin band where the bar sits: whichever section crosses it is the current chapter.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const d = (e.target as HTMLElement).dataset
          setChapter({ ground: d.ground!, ink: d.ink!, accent: d.accent ?? 'var(--magenta)' })
        }
      },
      { rootMargin: '-28px 0px -96% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => {
      heroIo.disconnect()
      io.disconnect()
    }
  }, [])

  const style = chapter
    ? ({ '--bar-ground': chapter.ground, '--bar-ink': chapter.ink, '--bar-accent': chapter.accent } as React.CSSProperties)
    : undefined

  return (
    <header ref={ref} className={`chapter-bar ${visible ? 'is-visible' : ''}`} style={style} aria-hidden={!visible} inert={!visible}>
      <a href="#top" className="chapter-bar-home" aria-label={t.nav.home}>
        <Wordmark />
      </a>
      <nav className="chapter-bar-links" aria-label="Primary">
        <a className="link" href="#services">{t.nav.services}</a>
        <a className="link" href="#process">{t.nav.process}</a>
        <a className="link" href="#faq">{t.nav.faq}</a>
        <LangSwitch />
      </nav>
      <BookCall source="header" className="button button-bar" />
    </header>
  )
}
