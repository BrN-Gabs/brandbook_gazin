import { brandContent as content } from '../data/brandContent'
import { IntroField } from '../components/IntroField'

export function Hero() {
  return (
    <section id="inicio" className="hero blue-section" aria-label={content.meta.logoAlt}>
      <IntroField />
      <div className="page-container hero-content">
        <div className="hero-center">
        <div className="hero-logo-stage">
          <img className="brand-logo hero-logo" src={`${import.meta.env.BASE_URL}${content.meta.logoSrc}`} alt={content.meta.logoAlt} width="2974" height="835" fetchPriority="high" />
        </div>
        </div>
      </div>
    </section>
  )
}
