import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { brandContent as content } from '../data/brandContent'
import type { SectionId } from '../data/brandContent'
import { MobileMenu } from './MobileMenu'

export function Header() {
  const [active, setActive] = useState<SectionId>('inicio')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const reduced = useReducedMotion()

  useEffect(() => {
    let frame = 0
    const update = () => {
      setScrolled(window.scrollY > 32)
      let current: SectionId = 'inicio'
      for (const item of content.navigation) {
        const section = document.getElementById(item.id)
        if (section && section.getBoundingClientRect().top <= window.innerHeight * 0.35) current = item.id
      }
      setActive(current)
      frame = 0
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    const onResize = () => { if (window.innerWidth >= 1024) close(); onScroll() }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize) }
  }, [close])

  return <>
    <motion.header className={`site-header ${scrolled || open ? 'is-solid' : ''}`}
      initial={{ opacity: reduced ? 1 : 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <div className="page-container header-inner">
        <a href="#inicio" className="logo-link" aria-label={content.accessibility.home} onClick={close}>
          <img className="brand-logo" src={`${import.meta.env.BASE_URL}${content.meta.logoSrc}`} alt={content.meta.logoAlt} width="2974" height="835" fetchPriority="high" />
        </a>
        <span className="header-divider" aria-hidden="true" />
        <span className="header-label">{content.meta.guide}</span>
        <nav className="desktop-navigation" aria-label={content.accessibility.mainNavigation}>
          {content.navigation.map(item => <a href={`#${item.id}`} key={item.id} aria-current={active === item.id ? 'location' : undefined}>{item.label}</a>)}
        </nav>
        <button id="menu-toggle" className="menu-toggle" type="button" aria-expanded={open}
          aria-controls={open ? 'mobile-navigation' : undefined}
          aria-label={open ? content.accessibility.closeMenu : content.accessibility.openMenu} onClick={() => setOpen(!open)}>
          {open ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>
    </motion.header>
    <AnimatePresence>{open && <MobileMenu active={active} onClose={close} onNavigate={close} />}</AnimatePresence>
  </>
}
