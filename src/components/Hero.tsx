import { useI18n } from '../i18n'
import { BookCall } from './BookCall'
import { LangSwitch } from './LangSwitch'
import { Wordmark } from './Logo'
import { heroImage } from '../content/imagery'
import { CHAPTERS } from './chapters'
import { AssistantPhone } from './Screens'

export function Hero() {
  const { t, locale } = useI18n()
  const swatches = [
    { id: 'services', label: t.nav.services, c: CHAPTERS.services },
    { id: 'process', label: t.nav.process, c: CHAPTERS.process },
    { id: 'partners', label: t.nav.partners, c: CHAPTERS.partners },
    { id: 'faq', label: t.nav.faq, c: CHAPTERS.faqHead },
    { id: 'contact', label: t.nav.contact, c: CHAPTERS.contact },
  ]

  return (
    <section id="top" className="hero">
      <div className="hero-panel">
        <div className="duotone hero-photo">
          <img className="hero-img" src={heroImage.src} width={heroImage.width} height={heroImage.height} alt={heroImage.alt[locale]} fetchPriority="high" />
        </div>
        <div className="hero-phone" data-rise style={{ '--i': 5 } as React.CSSProperties}>
          <AssistantPhone />
        </div>
        <div className="hero-top">
          <a href="#top" aria-label={t.nav.home} className="hero-home">
            <Wordmark bars="var(--lavender)" />
          </a>
          <LangSwitch className="link-plain hero-lang" />
        </div>
        <h1 className="hero-title display lines">
          <span className="line"><span data-line style={{ '--i': 0 } as React.CSSProperties}>{t.hero.title[0]}</span></span>
          <span className="line"><span data-line style={{ '--i': 1 } as React.CSSProperties}>{t.hero.title[1]}</span></span>
        </h1>
        <div className="hero-bottom">
          <p className="hero-lead" data-rise style={{ '--i': 3 } as React.CSSProperties}>{t.hero.lead}</p>
          <div className="hero-actions" data-rise style={{ '--i': 4 } as React.CSSProperties}>
            <BookCall source="hero" className="button button-hero" />
            <a className="link-plain hero-secondary" href="#contact">{t.hero.secondary}</a>
          </div>
        </div>
      </div>
      <nav className="swatches" aria-label="Sections">
        {swatches.map((s, i) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="swatch"
            style={{ background: s.c.ground, color: s.c.ink, '--i': i } as React.CSSProperties}
          >
            {s.label}
          </a>
        ))}
      </nav>
    </section>
  )
}
