import { useState } from 'react'
import { USE_LOGOS, visiblePartners, type Partner } from '../content/partners'
import { useI18n } from '../i18n'
import { BookCall } from './BookCall'
import { CHAPTERS, chapterAttrs } from './chapters'

/** One white tile. Shows the partner's name instead if there is no logo or the file fails to load. */
function LogoTile({ partner }: { partner: Partner }) {
  const [failed, setFailed] = useState(false)
  return (
    <li className="band-tile">
      {partner.logo && !failed ? (
        <img src={partner.logo} alt="" className="band-logo" loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <span className="band-tile-name">{partner.name}</span>
      )}
    </li>
  )
}

function Track({ items, hidden }: { items: Partner[]; hidden?: boolean }) {
  return (
    <ul className={`band-track ${USE_LOGOS ? 'band-track-logos' : ''}`} aria-hidden={hidden || undefined}>
      {items.map((p, i) =>
        USE_LOGOS ? (
          <LogoTile key={`${p.name}-${i}`} partner={p} />
        ) : (
          <li key={`${p.name}-${i}`} className="band-item">
            <span>{p.name}</span>
            <span className="band-dot" aria-hidden="true" />
          </li>
        ),
      )}
    </ul>
  )
}

export function Partners() {
  const { t } = useI18n()
  const list = visiblePartners()
  // Repeat short lists so one track is always wider than the screen.
  const items = list.length ? Array.from({ length: Math.max(1, Math.ceil(8 / list.length)) }, () => list).flat() : []
  return (
    <section id="partners" aria-label={t.partners.label} className="partners">
      <div className="band" {...chapterAttrs(CHAPTERS.partners)}>
        <ul className="sr-only">
          {list.map((p) => (
            <li key={p.name}>{p.url ? <a href={p.url}>{p.name}</a> : p.name}</li>
          ))}
        </ul>
        <div className="band-move" aria-hidden="true">
          <Track items={items} hidden />
          <Track items={items} hidden />
        </div>
      </div>
      <div className="band-caption" {...chapterAttrs(CHAPTERS.paper)}>
        <p className="band-sentence" data-reveal>{t.partners.sentence}</p>
        <div className="band-action" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
          <p className="band-ask">{t.partners.ask}</p>
          <BookCall source="partners" />
        </div>
      </div>
    </section>
  )
}
