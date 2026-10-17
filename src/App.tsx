import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router'
import { I18nProvider, detectLocale, isLocale, rememberLocale, useI18n } from './i18n'
import Home from './pages/Home'
import SuccessSchedule from './pages/SuccessSchedule'

/** Anything without a /en or /pt prefix gets one (the server does the same before the app loads). */
function AddLocale() {
  const { pathname, search, hash } = useLocation()
  const rest = pathname === '/' ? '' : pathname
  return <Navigate replace to={`/${detectLocale()}${rest}${search}${hash}`} />
}

function LocaleLayout({ page }: { page: 'home' | 'xray' | 'success' }) {
  const { lang } = useParams()
  if (!isLocale(lang)) return <AddLocale />
  return (
    <I18nProvider locale={lang}>
      <DocumentLocale />
      {page === 'success' ? <SuccessSchedule /> : <Home portrait={page === 'xray' ? '/team/profile.jpeg' : '/team/profile.jpg'} />}
    </I18nProvider>
  )
}

function DocumentLocale() {
  const { locale, t } = useI18n()
  const { pathname } = useLocation()
  useEffect(() => {
    rememberLocale(locale)
    document.documentElement.lang = locale === 'pt' ? 'pt-BR' : 'en'
    document.title = pathname.endsWith('/success-schedule') ? t.meta.successTitle : t.meta.title
  }, [locale, pathname, t])
  return null
}

export default function App() {
  return (
    <Routes>
      <Route path="/:lang" element={<LocaleLayout page="home" />} />
      <Route path="/:lang/x-ray" element={<LocaleLayout page="xray" />} />
      <Route path="/:lang/success-schedule" element={<LocaleLayout page="success" />} />
      <Route path="*" element={<AddLocale />} />
    </Routes>
  )
}
