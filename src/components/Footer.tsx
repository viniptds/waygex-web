import { credits } from '../content/imagery'
import { site } from '../content/site'
import { useI18n } from '../i18n'
import { LangSwitch } from './LangSwitch'
import { Wordmark } from './Logo'
import { CHAPTERS, chapterAttrs } from './chapters'

export function Footer() {
  const { t } = useI18n()
  const [user, domain] = site.email.split('@')
  return (
    <footer className="footer" {...chapterAttrs(CHAPTERS.footer)}>
      <div className="footer-top">
        <div className="footer-notes">
          <Wordmark bars="var(--navy)" className="footer-mark" />
          <p>{t.footer.what}</p>
          <p>
            {t.footer.place}
            <br />
            {site.cnpj}
          </p>
        </div>
        <a className="link link-plain footer-up" href="#top">{t.footer.top}</a>
      </div>

      <a className="footer-mail" href={`mailto:${site.email}`}>
        <span>{user}</span>
        <span>@{domain}</span>
      </a>

      <div className="footer-meta small">
        <ul className="footer-links">
          {site.social.map((s) => (
            <li key={s.label}><a className="link" href={s.url} target="_blank" rel="noopener">{s.label}</a></li>
          ))}
          <li><a className="link" href={site.careers} target="_blank" rel="noopener">{t.footer.careers}</a></li>
          <li><LangSwitch /></li>
        </ul>
        {credits.length > 0 && (
          <p className="footer-credits">
            {t.footer.credits}: Unsplash ({credits.join(', ')})
          </p>
        )}
        <p className="footer-legal">
          © {new Date().getFullYear()} {site.legalName}. {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}
