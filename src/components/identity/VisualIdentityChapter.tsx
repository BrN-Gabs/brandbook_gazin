import { useEffect, useRef, useState } from 'react'
import type { Chapter } from '../../data/brandChapters'
import { LogoSection } from './LogoSection'
import { BrandColors } from './BrandColors'
import { TypographyShowcase } from './TypographyShowcase'
import { LogoVariants } from './LogoVariants'
import { ClearSpaceDemo } from './ClearSpaceDemo'
import { MinimumSizeDemo } from './MinimumSizeDemo'
import { IncorrectUsageGallery } from './IncorrectUsageGallery'
import { GraphicLanguage } from './GraphicLanguage'
import { BrandArchitecture } from './BrandArchitecture'
import { IconographySection } from './iconography/IconographySection'
import '../../styles/identity.css'

/** Subtopic at the reading line (40% of the viewport), like the global navigation. */
function useActiveSubsection(ids: string[]) {
  const [active, setActive] = useState('')
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const line = innerHeight * .4
      let current = ''
      for (const id of ids) {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= line) current = id
      }
      // Past the end of the chapter body nothing is active.
      const last = document.getElementById(ids[ids.length - 1])
      if (last && last.getBoundingClientRect().bottom < line) current = ''
      setActive(previous => previous === current ? previous : current)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    addEventListener('scroll', schedule, { passive: true })
    addEventListener('resize', schedule)
    return () => { cancelAnimationFrame(frame); removeEventListener('scroll', schedule); removeEventListener('resize', schedule) }
  }, [ids])
  return active
}

/**
 * Contextual index of the chapter: sticks while the reader is inside it and marks the
 * current subtopic. Links are ordinary anchors, so the global smooth-scroll handles them.
 */
function IdentitySubnav({ chapter }: { chapter: Chapter }) {
  const ids = useRef(chapter.subsections.map(subsection => subsection.id)).current
  const active = useActiveSubsection(ids)
  const list = useRef<HTMLOListElement>(null)

  // Keep the active item visible in the horizontally scrolling list (mobile) without moving the page.
  useEffect(() => {
    const scroller = list.current
    const item = scroller?.querySelector<HTMLElement>('[aria-current="true"]')
    if (!scroller || !item || scroller.scrollWidth <= scroller.clientWidth) return
    const left = item.offsetLeft - scroller.clientWidth / 2 + item.offsetWidth / 2
    scroller.scrollTo({ left, behavior: document.documentElement.classList.contains('motion-enabled') ? 'smooth' : 'auto' })
  }, [active])

  return <nav className={`vi-subnav ${active ? 'is-active' : ''}`} aria-label={`${chapter.title}: navegação entre os subtópicos`}>
    <span className="vi-subnav-label" aria-hidden="true">{chapter.number}</span>
    <ol ref={list}>
      {chapter.subsections.map(subsection => <li key={subsection.id}>
        <a href={`#${subsection.id}`} aria-current={active === subsection.id ? 'true' : undefined}>
          <b>{subsection.number}</b><span>{subsection.title}</span>
        </a>
      </li>)}
    </ol>
  </nav>
}

/** Chapter 02 body: ten interactive subtopics built from src/data/visualIdentity.ts. */
export function VisualIdentityBody({ chapter }: { chapter: Chapter }) {
  const [logo, colors, type, versions, clearSpace, sizes, misuse, graphics, iconography, group] = chapter.subsections
  return <div className="chapter-body layout-identity">
    <IdentitySubnav chapter={chapter} />
    <LogoSection subsection={logo} />
    <BrandColors subsection={colors} />
    <TypographyShowcase subsection={type} />
    <LogoVariants subsection={versions} />
    <ClearSpaceDemo subsection={clearSpace} />
    <MinimumSizeDemo subsection={sizes} />
    <IncorrectUsageGallery subsection={misuse} />
    <GraphicLanguage subsection={graphics} />
    <IconographySection subsection={iconography} />
    <BrandArchitecture subsection={group} />
  </div>
}
