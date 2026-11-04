import { ArrowUp } from 'lucide-react'
import { brandContent as content } from '../data/brandContent'

export function Footer() {
  return <footer className="site-footer blue-section">
    <div className="page-container footer-inner">
      <a href="#inicio" aria-label={content.accessibility.home}><img className="brand-logo" src={`${import.meta.env.BASE_URL}${content.meta.logoSrc}`} alt={content.meta.logoAlt} width="2974" height="835" loading="lazy" /></a>
      <p>{content.meta.signature}</p>
      <a className="back-top" href="#inicio" aria-label={content.accessibility.backToTop}><ArrowUp size={22} aria-hidden="true" /></a>
    </div>
  </footer>
}
