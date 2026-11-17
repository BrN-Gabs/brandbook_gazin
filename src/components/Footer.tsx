import { ArrowUp, Facebook, Instagram, Phone } from 'lucide-react'
import { brandContent as content } from '../data/brandContent'

const icons = { Instagram, Facebook }

export function Footer() {
  const { footer } = content
  return <footer className="site-footer blue-section">
    <div className="page-container footer-inner">
      <a href="#inicio" aria-label={content.accessibility.home}><img className="brand-logo" src={`${import.meta.env.BASE_URL}${content.meta.logoSrc}`} alt={content.meta.logoAlt} width="2974" height="835" loading="lazy" /></a>
      <p>{content.meta.signature}</p>
      <a className="back-top" href="#inicio" aria-label={content.accessibility.backToTop}><ArrowUp size={22} aria-hidden="true" /></a>
    </div>
    <div className="page-container footer-contact">
      {footer.social.map(group => <nav key={group.brand} className="footer-social" aria-label={`Redes sociais ${group.brand}`}>
        <span>{group.brand}</span>
        <ul>{group.links.map(link => {
          const Icon = icons[link.network as keyof typeof icons]
          return <li key={link.url}><a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={`${link.network} ${group.brand} (abre em nova aba)`} title={`${link.network} · ${link.handle}`}><Icon size={18} aria-hidden="true" /></a></li>
        })}</ul>
      </nav>)}
      <a className="footer-phone" href={footer.phone.href}><Phone size={16} aria-hidden="true" />{footer.phone.label}</a>
    </div>
    <p className="page-container footer-credit">{footer.credit}</p>
  </footer>
}
