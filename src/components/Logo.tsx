import { MARK_BAR_MID, MARK_BAR_RING, MARK_RING, MARK_VIEWBOX, WORD_PATH, WORD_TRANSFORM, WORD_VIEWBOX } from './logoPaths'

/** The Waygex mark: ring in the current text colour, bars in `bars` (magenta by default). */
export function Mark({ className, bars = 'var(--magenta)' }: { className?: string; bars?: string }) {
  return (
    <svg className={className} viewBox={MARK_VIEWBOX} aria-hidden="true" focusable="false">
      <path d={MARK_RING} fill="currentColor" fillRule="evenodd" />
      <path d={MARK_BAR_MID} fill={bars} />
      <path d={MARK_BAR_RING} fill={bars} fillRule="evenodd" />
    </svg>
  )
}

export function Wordmark({ className, bars }: { className?: string; bars?: string }) {
  return (
    <span className={`wordmark ${className ?? ''}`}>
      <Mark className="wordmark-mark" bars={bars} />
      <svg className="wordmark-word" viewBox={WORD_VIEWBOX} aria-hidden="true" focusable="false">
        <path d={WORD_PATH} transform={WORD_TRANSFORM} fill="currentColor" />
      </svg>
      <span className="sr-only">Waygex</span>
    </span>
  )
}
