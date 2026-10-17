import { useId, useRef, useState, type FormEvent } from 'react'
import { BUDGETS, PLATFORMS, STAGES, type Budget, type ContactField, type ContactRequest, type ContactResponse, type FieldError, type Platform, type Stage } from '../../shared/contact'
import { stripImages } from '../content/imagery'
import { site } from '../content/site'
import { fill, useI18n } from '../i18n'
import { track } from '../lib/calendly'
import { BookCall } from './BookCall'
import { CHAPTERS, chapterAttrs } from './chapters'

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent'; name: string; email: string } | { kind: 'failed'; message: string }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(v: ContactRequest): Partial<Record<ContactField, FieldError>> {
  const e: Partial<Record<ContactField, FieldError>> = {}
  const name = v.name.trim()
  if (!name) e.name = 'required'
  else if (name.length < 2) e.name = 'too_short'
  else if (name.length > 120) e.name = 'too_long'
  const email = v.email.trim()
  if (!email) e.email = 'required'
  else if (!EMAIL.test(email) || email.length > 254) e.email = 'invalid'
  if ((v.company ?? '').trim().length > 120) e.company = 'too_long'
  const project = v.project.trim()
  if (!project) e.project = 'required'
  else if (project.length < 10) e.project = 'too_short'
  else if (project.length > 4000) e.project = 'too_long'
  if (!v.platforms.length) e.platforms = 'required'
  return e
}

function Strip() {
  const { locale } = useI18n()
  if (!stripImages.length) return null
  const frames = [...stripImages, ...stripImages]
  return (
    <div className="strip" aria-hidden="true">
      <div className="strip-move">
        {frames.map((img, i) => (
          <span key={i} className={`strip-frame duotone ratio-${i % 3}`}>
            <img src={img.src} alt={i < stripImages.length ? img.alt[locale] : ''} width={img.width} height={img.height} loading="lazy" />
          </span>
        ))}
      </div>
    </div>
  )
}

export function Contact({ stage, onStage }: { stage: Stage; onStage: (s: Stage) => void }) {
  const { t, locale } = useI18n()
  const c = t.contact
  const uid = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const [values, setValues] = useState({ name: '', email: '', company: '', project: '', budget: '' as Budget | '', website: '' })
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [errors, setErrors] = useState<Partial<Record<ContactField, FieldError>>>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const set = (k: keyof typeof values) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [k]: e.target.value }))
    if (errors[k as ContactField]) setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const togglePlatform = (p: Platform) => {
    setPlatforms((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]))
    if (errors.platforms) setErrors((er) => ({ ...er, platforms: undefined }))
  }

  const message = (field: ContactField) => {
    const code = errors[field]
    if (!code) return null
    if (field === 'platforms') return c.errors.platforms
    if (field === 'email' && code === 'invalid') return c.errors.email
    return c.errors[code]
  }

  async function submit(e: FormEvent) {
    e.preventDefault()
    const body: ContactRequest = {
      name: values.name.trim(),
      email: values.email.trim(),
      company: values.company.trim() || undefined,
      project: values.project.trim(),
      stage,
      platforms,
      budget: values.budget || undefined,
      locale,
      website: values.website,
    }
    const found = validate(body)
    setErrors(found)
    if (Object.keys(found).length) {
      setStatus({ kind: 'idle' })
      const first = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
      first?.focus()
      return
    }
    setStatus({ kind: 'sending' })
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
      const data = (await res.json().catch(() => ({ ok: false, error: 'send_failed' }))) as ContactResponse
      if (data.ok) {
        track('brief_sent', { stage, platforms: platforms.join(',') })
        setStatus({ kind: 'sent', name: body.name.split(' ')[0], email: body.email })
        return
      }
      if (data.error === 'validation') {
        setErrors(data.fields)
        setStatus({ kind: 'idle' })
        return
      }
      setStatus({ kind: 'failed', message: fill(c.errors[data.error], { mail: site.email }) })
    } catch {
      setStatus({ kind: 'failed', message: c.errors.network })
    }
  }

  const reset = () => {
    setValues({ name: '', email: '', company: '', project: '', budget: '', website: '' })
    setPlatforms([])
    setStatus({ kind: 'idle' })
  }

  const field = (k: 'name' | 'email' | 'company', type: string, autoComplete: string, label: string, optional = false) => (
    <div className={`cell ${errors[k] ? 'has-error' : ''}`}>
      <label htmlFor={`${uid}-${k}`} className="cell-label">
        {label}
        {optional && <span className="cell-optional"> ({c.fields.optional})</span>}
      </label>
      <input
        id={`${uid}-${k}`}
        name={k}
        type={type}
        autoComplete={autoComplete}
        className="cell-input"
        value={values[k]}
        onChange={set(k)}
        aria-invalid={errors[k] ? true : undefined}
        aria-describedby={errors[k] ? `${uid}-${k}-err` : undefined}
        required={!optional}
        maxLength={k === 'email' ? 254 : 120}
      />
      {errors[k] && <p id={`${uid}-${k}-err`} className="cell-error">{message(k)}</p>}
    </div>
  )

  return (
    <section id="contact" className="chapter contact" {...chapterAttrs(CHAPTERS.contact)}>
      <Strip />
      <div className="contact-head">
        <h2 className="head contact-title" data-reveal>{c.heading}</h2>
        <p className="contact-lead" data-reveal style={{ '--i': 1 } as React.CSSProperties}>
          {c.lead} {c.talk} <BookCall source="contact" className="link link-plain">{c.book}</BookCall>
        </p>
      </div>

      {status.kind === 'sent' ? (
        <div className="contact-done" role="status">
          <h3 className="lead">{c.success.heading}</h3>
          <p>{fill(c.success.text, { name: status.name, email: status.email })}</p>
          <button type="button" className="link link-plain" onClick={reset}>{c.success.again}</button>
        </div>
      ) : (
        <form ref={formRef} className="brief" onSubmit={submit} noValidate aria-busy={status.kind === 'sending'}>
          <div className="brief-row brief-row-3">
            {field('name', 'text', 'name', c.fields.name)}
            {field('email', 'email', 'email', c.fields.email)}
            {field('company', 'text', 'organization', c.fields.company, true)}
          </div>

          <div className={`cell cell-tall ${errors.project ? 'has-error' : ''}`}>
            <label htmlFor={`${uid}-project`} className="cell-label">{c.fields.project}</label>
            <textarea
              id={`${uid}-project`}
              name="project"
              className="cell-input"
              rows={4}
              value={values.project}
              onChange={set('project')}
              aria-invalid={errors.project ? true : undefined}
              aria-describedby={`${uid}-project-help${errors.project ? ` ${uid}-project-err` : ''}`}
              maxLength={4000}
              required
            />
            <p id={`${uid}-project-help`} className="cell-help">{c.fields.projectHelp}</p>
            {errors.project && <p id={`${uid}-project-err`} className="cell-error">{message('project')}</p>}
          </div>

          <div className="brief-row brief-row-3">
            <fieldset className="cell">
              <legend className="cell-label">{c.fields.stage}</legend>
              <div className="chips">
                {STAGES.map((s) => (
                  <label key={s} className="chip">
                    <input type="radio" name="stage" value={s} checked={stage === s} onChange={() => onStage(s)} />
                    <span>{t.process.stages[s]}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className={`cell ${errors.platforms ? 'has-error' : ''}`} aria-describedby={errors.platforms ? `${uid}-platforms-err` : undefined}>
              <legend className="cell-label">{c.fields.platforms}</legend>
              <div className="chips">
                {PLATFORMS.map((p, i) => (
                  <label key={p} className="chip">
                    <input type="checkbox" name="platforms" value={p} checked={platforms.includes(p)} onChange={() => togglePlatform(p)} aria-invalid={i === 0 && errors.platforms ? true : undefined} />
                    <span>{c.platforms[p]}</span>
                  </label>
                ))}
              </div>
              {errors.platforms && <p id={`${uid}-platforms-err`} className="cell-error">{message('platforms')}</p>}
            </fieldset>
            <div className="cell">
              <label htmlFor={`${uid}-budget`} className="cell-label">
                {c.fields.budget}
                <span className="cell-optional"> ({c.fields.optional})</span>
              </label>
              <select id={`${uid}-budget`} name="budget" className="cell-input cell-select" value={values.budget} onChange={set('budget')}>
                <option value="">{c.fields.budgetNone}</option>
                {BUDGETS.map((b) => (
                  <option key={b} value={b}>{c.budgets[b]}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="brief-honeypot" aria-hidden="true">
            <label>
              Website
              <input tabIndex={-1} autoComplete="off" name="website" value={values.website} onChange={set('website')} />
            </label>
          </div>

          <div className="brief-row brief-row-3 brief-foot">
            <p className="small brief-privacy">{c.privacy}</p>
            <div className="brief-status" aria-live="polite">
              {status.kind === 'failed' && <p className="cell-error">{status.message}</p>}
              {Object.values(errors).some(Boolean) && status.kind !== 'failed' && <p className="cell-error">{c.errors.summary}</p>}
            </div>
            <button type="submit" className="brief-submit" disabled={status.kind === 'sending'}>
              {status.kind === 'sending' ? c.sending : c.submit}
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
