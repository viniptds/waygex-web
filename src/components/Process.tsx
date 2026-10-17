import { STAGES, type Stage } from '../../shared/contact'
import { useI18n } from '../i18n'
import { CHAPTERS, chapterAttrs } from './chapters'
import { BuildsCard, LaunchPhone, NotesCard, ProposalCard } from './Screens'

const TILES = [
  { ground: '#f8f6fb', screen: <NotesCard /> },
  { ground: '#c5c0ff', screen: <ProposalCard /> },
  { ground: '#c02867', screen: <BuildsCard /> },
  { ground: '#231f4d', screen: <LaunchPhone /> },
]

export function Process({ stage, onStage }: { stage: Stage; onStage: (s: Stage) => void }) {
  const { t } = useI18n()
  const steps = t.process.paths[stage]
  return (
    <section id="process" className="chapter process" {...chapterAttrs(CHAPTERS.process)}>
      <div className="process-body">
      <div className="process-head">
        <h2 className="head" data-reveal>{t.process.heading}</h2>
        <fieldset className="picker" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
          <legend className="picker-legend">{t.process.picker}</legend>
          <div className="picker-options">
            {STAGES.map((s) => (
              <label key={s} className="picker-option">
                <input type="radio" name="start-stage" value={s} checked={stage === s} onChange={() => onStage(s)} />
                <span>{t.process.stages[s]}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <ol className="tiles" aria-live="polite">
        {steps.map((step, i) => (
          <li className="tile-col" key={i} data-reveal style={{ '--i': i } as React.CSSProperties}>
            <div className={`tile tile-${i + 1}`} style={{ background: TILES[i].ground }}>
              {TILES[i].screen}
            </div>
            <h3 className="tile-name" key={`${stage}-n`}>{step.name}</h3>
            <p className="tile-text" key={`${stage}-t`}>{step.text}</p>
          </li>
        ))}
      </ol>
      </div>
      <a className="link link-plain process-cta" href="#contact">
        {t.process.cta}
      </a>
    </section>
  )
}
