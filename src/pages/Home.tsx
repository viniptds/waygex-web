import { useState } from 'react'
import type { Stage } from '../../shared/contact'
import { About } from '../components/About'
import { ChapterHeader } from '../components/ChapterHeader'
import { Contact } from '../components/Contact'
import { Faq } from '../components/Faq'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { Partners } from '../components/Partners'
import { Process } from '../components/Process'
import { Services } from '../components/Services'
import { useI18n } from '../i18n'
import { useReveal } from '../lib/useReveal'

export default function Home({ portrait }: { portrait: string }) {
  const { t, locale } = useI18n()
  // Where the visitor is starting from: picked in "How we work", carried into the brief form.
  const [stage, setStage] = useState<Stage>('idea')
  useReveal([locale])

  return (
    <>
      <a className="skip" href="#main">{t.nav.skip}</a>
      <ChapterHeader />
      <Hero />
      <main id="main">
        <Services />
        <Process stage={stage} onStage={setStage} />
        <Partners />
        <About portrait={portrait} />
        <Faq />
        <Contact stage={stage} onStage={setStage} />
      </main>
      <Footer />
    </>
  )
}
