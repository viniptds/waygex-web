import { site } from '../content/site'
import { useI18n } from '../i18n'
import { BookCall } from './BookCall'
import { CHAPTERS, chapterAttrs } from './chapters'

export function About({ portrait }: { portrait: string }) {
  const { t } = useI18n()
  return (
    <section id="about" className="about" {...chapterAttrs(CHAPTERS.paper)}>
      <div className="about-panel">
        <h2 className="about-heading head" data-reveal>
          {t.about.heading[0]}
          <br />
          {t.about.heading[1]}
        </h2>
        <div className="about-text">
          {t.about.blocks.map((b, i) => (
            <div key={b.title} className="about-block" data-reveal style={{ '--i': i + 1 } as React.CSSProperties}>
              <h3 className="about-title">{b.title}</h3>
              <p>{b.text}</p>
            </div>
          ))}
          <div className="about-actions" data-reveal style={{ '--i': 3 } as React.CSSProperties}>
            <BookCall source="about" />
            <a className="link link-plain" href={site.founderLinkedIn} target="_blank" rel="noopener">{t.about.linkedin}</a>
          </div>
        </div>
        <figure className="about-portrait reveal-shutter" data-reveal>
          <span className="shutter-mask">
            <img src={portrait} alt={t.about.portraitAlt} width={900} height={900} loading="lazy" />
          </span>
        </figure>
      </div>
    </section>
  )
}
