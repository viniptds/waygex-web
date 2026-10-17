import { Link, useLocation } from 'react-router'
import { useI18n } from '../i18n'

export function LangSwitch({ className = 'link' }: { className?: string }) {
  const { locale, t } = useI18n()
  const { pathname, search } = useLocation()
  const other = locale === 'en' ? 'pt' : 'en'
  const to = pathname.replace(/^\/(en|pt)(?=\/|$)/, `/${other}`) + search
  return (
    <Link className={className} to={to} hrefLang={other === 'pt' ? 'pt-BR' : 'en'} lang={other === 'pt' ? 'pt-BR' : 'en'} aria-label={t.nav.otherLanguageLabel}>
      {t.nav.otherLanguage}
    </Link>
  )
}
