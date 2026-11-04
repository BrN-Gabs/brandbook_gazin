import { useEffect } from 'react'
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
  useBrandMotion(motion.preference)
  useEffect(() => {
    document.title = brandContent.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', brandContent.meta.description)
  }, [])

  return <>
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
  </>
}
