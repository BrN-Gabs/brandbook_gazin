import { useEffect } from 'react'
import { DNAExperience } from './components/dna/DNAExperience'
import { useBrandMotion } from './motion/useBrandMotion'
import { useMotionPreference } from './motion/useMotionPreference'
import { MotionControl } from './components/MotionControl'
import { ScrollProgress } from './components/ScrollProgress'
import { Footer } from './components/Footer'
import { BrandValues } from './sections/BrandValues'
import { MissionVision } from './sections/MissionVision'
import { BrandPillars } from './sections/BrandPillars'
import { OurHistory } from './sections/OurHistory'
import { SuccessTree } from './sections/SuccessTree'
import { brandContent } from './data/brandContent'
import { brandChapters } from './data/brandChapters'
import { BrandbookChapter } from './components/chapters/BrandbookChapter'
import { BrandbookNav } from './components/BrandbookNav'
import './styles/chapters.css'

export default function App() {
  const motion = useMotionPreference()
  useBrandMotion(motion.preference)
  useEffect(() => {
    document.title = brandContent.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', brandContent.meta.description)
  }, [])

  return <>
    <div id="brandbook-page">
    <ScrollProgress />
    <a className="skip-link" href="#main-content">{brandContent.accessibility.skipToContent}</a>
    {/* After the skip link: it must stay the first Tab stop. */}
    <BrandbookNav />
    <main id="main-content" tabIndex={-1}>
      <DNAExperience reduced={!motion.enabled} />
      <MissionVision />
      <BrandValues />
      <BrandPillars />
      <OurHistory />
      <SuccessTree reduced={!motion.enabled} />
      {/* Chapters 01–11: structure only, content comes from src/data/brandChapters.ts. */}
      {brandChapters.map(chapter => <BrandbookChapter key={chapter.id} chapter={chapter} />)}
    </main>
    <Footer />
    <MotionControl preference={motion.preference} enabled={motion.enabled} systemReduced={motion.systemReduced} onChange={motion.choose} />
    </div>
  </>
}
