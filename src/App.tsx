import { useEffect, useState } from 'react'
import { BrandbookPreloader } from './components/BrandbookPreloader'
import { useBrandMotion } from './motion/useBrandMotion'
import { useMotionPreference } from './motion/useMotionPreference'
import { MotionControl } from './components/MotionControl'
import { IntroPointer } from './components/IntroField'
import { ScrollProgress } from './components/ScrollProgress'
import { Footer } from './components/Footer'
import { Hero } from './sections/Hero'
import { Introduction } from './sections/Introduction'
import { BrandValues } from './sections/BrandValues'
import { MissionVision } from './sections/MissionVision'
import { BrandPillars } from './sections/BrandPillars'
import { brandContent } from './data/brandContent'

export default function App() {
  const motion = useMotionPreference()
  const [opening, setOpening] = useState(() => !location.hash || location.hash === '#inicio')
  useBrandMotion(motion.preference, !opening)
  useEffect(() => {
    document.title = brandContent.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', brandContent.meta.description)
  }, [])

  return <>
    {opening && <BrandbookPreloader reduced={!motion.enabled} onComplete={() => setOpening(false)} />}
    <div id="brandbook-page">
    <ScrollProgress />
    <IntroPointer />
    <a className="skip-link" href="#main-content">{brandContent.accessibility.skipToContent}</a>
    <main id="main-content" tabIndex={-1}>
      <Hero />
      <Introduction />
      <MissionVision />
      <BrandValues />
      <BrandPillars />
    </main>
    <Footer />
    <MotionControl preference={motion.preference} enabled={motion.enabled} systemReduced={motion.systemReduced} onChange={motion.choose} />
    </div>
  </>
}
