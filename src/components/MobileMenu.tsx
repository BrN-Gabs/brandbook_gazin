import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'
import { brandContent as content } from '../data/brandContent'
import type { SectionId } from '../data/brandContent'

type Props = { active: SectionId; onClose: () => void; onNavigate: () => void }

export function MobileMenu({ active, onClose, onNavigate }: Props) {
  const menu = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    menu.current?.querySelector<HTMLAnchorElement>('a')?.focus()
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab') return
      const links = Array.from(menu.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [])
      const toggle = document.getElementById('menu-toggle')
      const elements = [toggle, ...links].filter((el): el is HTMLElement => !!el)
      const first = elements[0]
      const last = elements[elements.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener('keydown', handleKey)
      previousFocus?.focus({ preventScroll: true })
    }
  }, [onClose])

  return (
    <motion.div className="mobile-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.18 }} onClick={onClose}>
      <motion.nav id="mobile-navigation" aria-label={content.accessibility.mobileNavigation} ref={menu}
        className="mobile-navigation" onClick={event => event.stopPropagation()}
        initial={{ y: reduced ? 0 : -12 }} animate={{ y: 0 }} exit={{ y: reduced ? 0 : -12 }}>
        <span className="eyebrow">{content.meta.guide}</span>
        {content.navigation.map((item, index) => (
          <a key={item.id} href={`#${item.id}`} onClick={onNavigate}
            aria-current={active === item.id ? 'location' : undefined}>
            <span className="mobile-number">0{index + 1}</span>
            {item.label}<ArrowUpRight size={20} aria-hidden="true" />
          </a>
        ))}
      </motion.nav>
    </motion.div>
  )
}
