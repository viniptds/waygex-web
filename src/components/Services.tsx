import { useI18n } from '../i18n'
import { CHAPTERS, chapterAttrs } from './chapters'

export function Services() {
  const { t } = useI18n()
  return (
    <section id="services" className="chapter services" {...chapterAttrs(CHAPTERS.services)}>
      <p className="services-lead-phone">{t.hero.lead}</p>
      <div className="services-list" role="list">
        <h2 className="services-row services-heading" data-reveal>
          <span className="services-name">{t.services.heading}</span>
        </h2>
        {t.services.items.map((item, i) => (
          <div className="services-row" role="listitem" key={item.name} data-reveal style={{ '--i': i } as React.CSSProperties}>
            <h3 className="services-name">{item.name}</h3>
            <p className="services-text">{item.text}</p>
          </div>
        ))}
      </div>
      <p className="statement services-statement" data-reveal>{t.services.statement}</p>
    </section>
  )
}
