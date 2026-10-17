import { useEffect, useId, useRef, useState } from 'react'
import { site } from '../content/site'
import { useI18n } from '../i18n'
import { CHAPTERS, chapterAttrs } from './chapters'

function withMail(text: string) {
  const [before, after] = text.split('{mail}')
  if (after === undefined) return text
  return (
    <>
      {before}
      <a className="link-plain" href={`mailto:${site.email}`}>{site.email}</a>
      {after}
    </>
  )
}

const HOVER_OPEN_MS = 140
const HOVER_CLOSE_MS = 220

/**
 * Questions as an accordion. With a mouse, hovering a question opens it (after a short delay so
 * passing over the list does not make it jump) and leaving closes it. A click pins it open; a
 * second click closes it. Touch and keyboard use the click only.
 */
export function Faq() {
  const { t } = useI18n()
  const uid = useId()
  const [pinned, setPinned] = useState<Set<number>>(() => new Set())
  const [hovered, setHovered] = useState<number | null>(null)
  // After a click closes a hovered item, ignore hover on it until the pointer leaves.
  const [suppressed, setSuppressed] = useState<number | null>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const isOpen = (i: number) => pinned.has(i) || (hovered === i && suppressed !== i)

  const schedule = (fn: () => void, ms: number) => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(fn, ms)
  }

  const onEnter = (i: number) => (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    schedule(() => setHovered(i), HOVER_OPEN_MS)
  }

  const onLeave = (i: number) => (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    if (suppressed === i) setSuppressed(null)
    schedule(() => setHovered((h) => (h === i ? null : h)), HOVER_CLOSE_MS)
  }

  // First click keeps the question open (even if hover already opened it); the next click closes it.
  const toggle = (i: number) => {
    const wasPinned = pinned.has(i)
    setPinned((cur) => {
      const next = new Set(cur)
      if (wasPinned) next.delete(i)
      else next.add(i)
      return next
    })
    setSuppressed(wasPinned ? i : null)
  }

  return (
    <section id="faq" className="faq" aria-labelledby="faq-heading">
      <div className="faq-head" {...chapterAttrs(CHAPTERS.faqHead)}>
        <h2 id="faq-heading" className="head faq-title" data-reveal>{t.faq.heading}</h2>
      </div>
      <div className="faq-list">
        {t.faq.items.map((item, i) => {
          const open = isOpen(i)
          const qId = `${uid}-q${i}`
          const aId = `${uid}-a${i}`
          return (
            <div
              key={item.q}
              className={`faq-item ${open ? 'is-open' : ''}`}
              onPointerEnter={onEnter(i)}
              onPointerLeave={onLeave(i)}
              {...chapterAttrs(i % 2 ? CHAPTERS.process : CHAPTERS.paper)}
            >
              <h3 className="faq-q">
                <button id={qId} type="button" className="faq-toggle" aria-expanded={open} aria-controls={aId} onClick={() => toggle(i)}>
                  <span>{item.q}</span>
                  <span className="faq-icon" aria-hidden="true" />
                </button>
              </h3>
              <div id={aId} role="region" aria-labelledby={qId} className="faq-a-wrap">
                <div className="faq-a-inner">
                  <p className="faq-a">{withMail(item.a)}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
