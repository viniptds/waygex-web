import { Mark } from './Logo'
import { useI18n } from '../i18n'

// Sample app screens built in HTML. They show the kind of software Waygex makes (an app with an AI
// assistant, the documents of a project, a booking app at launch). Marked data-ui: they keep their
// own interface conventions (borders, small labels) inside the page's house style.

export function AssistantPhone({ className = '' }: { className?: string }) {
  const s = useI18n().t.screens.assistant
  return (
    <div className={`ui ui-phone ${className}`} data-ui aria-hidden="true">
      <div className="ui-phone-bar">
        <span className="ui-phone-time">9:41</span>
        <span className="ui-phone-island" />
        <span className="ui-phone-icons" />
      </div>
      <div className="ui-app-head">
        <Mark className="ui-app-mark" bars="var(--magenta)" />
        <span>{s.app}</span>
      </div>
      <div className="ui-chat">
        <p className="ui-bubble ui-bubble-me">{s.question}</p>
        <div className="ui-bubble ui-bubble-ai">
          <p>{s.answer}</p>
          <ul className="ui-rows">
            {s.rows.map((r) => (
              <li key={r.label}>
                <span>{r.label}</span>
                <b>{r.value}</b>
              </li>
            ))}
          </ul>
          <span className="ui-pill">{s.action}</span>
        </div>
      </div>
      <div className="ui-input">
        <span>{s.input}</span>
        <span className="ui-send" />
      </div>
    </div>
  )
}

export function NotesCard() {
  const s = useI18n().t.screens.notes
  return (
    <div className="ui ui-card" data-ui aria-hidden="true">
      <p className="ui-card-title">{s.title}</p>
      <ul className="ui-list">
        {s.items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  )
}

export function ProposalCard() {
  const s = useI18n().t.screens.proposal
  return (
    <div className="ui ui-card" data-ui aria-hidden="true">
      <p className="ui-card-title">{s.title}</p>
      <ul className="ui-rows ui-rows-lined">
        {s.rows.map((r) => (
          <li key={r.label}>
            <span>{r.label}</span>
            <b>{r.value}</b>
          </li>
        ))}
      </ul>
      <p className="ui-foot">{s.foot}</p>
    </div>
  )
}

export function BuildsCard() {
  const s = useI18n().t.screens.builds
  return (
    <div className="ui ui-card ui-card-dark" data-ui aria-hidden="true">
      <p className="ui-card-title">{s.title}</p>
      <ul className="ui-rows ui-rows-lined">
        {s.rows.map((r, i) => (
          <li key={r.label}>
            <span>{r.label}</span>
            <span className={`ui-status ${i === 0 ? 'is-new' : ''}`}>{r.status}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function LaunchPhone() {
  const s = useI18n().t.screens.launch
  return (
    <div className="ui ui-phone ui-phone-light" data-ui aria-hidden="true">
      <div className="ui-phone-bar">
        <span className="ui-phone-time">9:41</span>
        <span className="ui-phone-island" />
        <span className="ui-phone-icons" />
      </div>
      <p className="ui-screen-title">{s.title}</p>
      <p className="ui-muted">{s.day}</p>
      <div className="ui-times">
        {s.times.map((t) => (
          <span key={t} className={t === s.selected ? 'is-on' : ''}>{t}</span>
        ))}
      </div>
      <p className="ui-hint">{s.hint}</p>
      <span className="ui-cta">{s.cta}</span>
    </div>
  )
}
