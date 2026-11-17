import { useEffect, useId, useRef, useState, type ReactNode, type RefObject } from 'react'
import { BookOpen, Ruler, Sparkles, Lightbulb } from 'lucide-react'
import type { Subsection } from '../../data/brandChapters'
import { formatPage, logoAsset, logoFile, provenanceLabel, type ManualPage, type Provenance, type VariantId } from '../../data/visualIdentity'
import { logoOutline } from '../dna/logoOutline'

export const logoUrl = `${import.meta.env.BASE_URL}${logoFile.src}`
export const W = logoFile.width
export const H = logoFile.height
export { logoOutline }

/** Mirrors the site-wide motion decision (html.motion-enabled), including the manual toggle. */
export function useMotionEnabled() {
  const read = () => document.documentElement.classList.contains('motion-enabled')
  const [enabled, setEnabled] = useState(read)
  useEffect(() => {
    const observer = new MutationObserver(() => setEnabled(read()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    setEnabled(read())
    return () => observer.disconnect()
  }, [])
  return enabled
}

/** True while the element is near the viewport (used to start and pause demonstrations). */
export function useInView(ref: RefObject<Element | null>, rootMargin = '0px 0px -15% 0px', once = false) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting)
      if (entry.isIntersecting && once) observer.disconnect()
    }, { rootMargin })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, rootMargin, once])
  return inView
}

/** Arrow/Home/End navigation for radio groups and tab lists. Returns null for other keys. */
export function rovingIndex(key: string, current: number, length: number) {
  if (key === 'Home') return 0
  if (key === 'End') return length - 1
  const delta = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number>)[key]
  return delta === undefined ? null : (current + delta + length) % length
}

/** Segmented control with radio semantics: one tab stop, arrows move the selection. */
export function RadioSegmented<T extends string>({ label, options, value, onChange, className = '' }: {
  label: string
  options: readonly { id: T; label: string }[]
  value: T
  onChange: (value: T) => void
  className?: string
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const index = options.findIndex(option => option.id === value)
  return <div className={`vi-segmented ${className}`} role="radiogroup" aria-label={label} onKeyDown={event => {
    const next = rovingIndex(event.key, index, options.length)
    if (next === null) return
    event.preventDefault()
    onChange(options[next].id)
    refs.current[next]?.focus()
  }}>
    {options.map((option, i) => <button key={option.id} ref={element => { refs.current[i] = element }} type="button" role="radio"
      aria-checked={option.id === value} tabIndex={option.id === value ? 0 : -1} onClick={() => onChange(option.id)}>{option.label}</button>)}
  </div>
}

/** SVG-safe unique id (React ids contain colons). */
export function useSvgId(prefix: string) {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
}

const provenanceIcon = { manual: BookOpen, medido: Ruler, digital: Sparkles, didatico: Lightbulb } as const

export function ProvenanceTag({ kind, page, children }: { kind: Provenance; page?: ManualPage; children?: ReactNode }) {
  // Content taken from the manual is shown without a tag; only other origins are flagged.
  if (kind === 'manual') return null
  const Icon = provenanceIcon[kind]
  return <span className="vi-tag" data-kind={kind}>
    <Icon size={12} aria-hidden="true" />
    <span>{children ?? provenanceLabel[kind]}</span>
    {page && <span className="vi-tag-page">{formatPage(page)}</span>}
  </span>
}

/** Subtopic shell: numbered heading, lead text and provenance, then the demonstration. */
export function IdentitySection({ subsection, lead, source, children, className = '' }: {
  subsection: Subsection
  lead: ReactNode
  source?: ReactNode
  children: ReactNode
  className?: string
}) {
  return <section id={subsection.id} className={`vi-section ${className}`} aria-labelledby={`${subsection.id}-title`} data-vi-section>
    <header className="vi-section-head">
      <span className="vi-section-number" aria-hidden="true">{subsection.number}</span>
      <div className="vi-section-titles">
        <p className="vi-kicker" data-vi-reveal><span className="vi-kicker-line" aria-hidden="true" />{subsection.number}</p>
        <h3 id={`${subsection.id}-title`} className="vi-section-title"><span className="vi-title-mask"><span className="vi-title-line">{subsection.title}</span></span></h3>
      </div>
      <div className="vi-section-lead" data-vi-reveal>
        {lead}
        {source && <div className="vi-sources">{source}</div>}
      </div>
    </header>
    {children}
  </section>
}

/** The original logo file, always intact (proportional, never recoloured). */
export function OfficialLogo({ className = '', alt = logoFile.alt, decorative = false }: { className?: string; alt?: string; decorative?: boolean }) {
  return <img className={`vi-logo ${className}`} src={logoUrl} width={W} height={H} alt={decorative ? '' : alt} aria-hidden={decorative || undefined} decoding="async" draggable={false} />
}

/**
 * The white letters of the original file, isolated with a luminance mask of the same
 * image (white letters → visible, blue field → ~3%). Geometry comes straight from the
 * file; only the paint changes. Used for didactic highlights, never as a logo.
 */
export function LogoLetters({ fill = 'var(--gazin-white)', className }: { fill?: string; className?: string }) {
  const id = useSvgId('vi-letters')
  return <g className={className}>
    <mask id={id} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
      <image href={logoUrl} width={W} height={H} />
    </mask>
    <rect width={W} height={H} fill={fill} mask={`url(#${id})`} />
  </g>
}


const versionLabels: Record<VariantId, string> = {
  'cores-originais': 'em cores originais',
  'fundo-escuro': 'para fundo escuro, com contorno branco',
  'preto-branco': 'em preto e branco, com o nome vazado',
  'uma-cor': 'em uma cor azul, com o nome vazado',
  negativo: 'em negativo, contorno e nome em branco',
}

/** Logo version generated from the original file (scripts/export-logo-versions.mjs). */
export function LogoVersion({ id, slogan = false, className = '', decorative = false }: { id: VariantId; slogan?: boolean; className?: string; decorative?: boolean }) {
  return <img className={`vi-logo ${className}`} src={`${import.meta.env.BASE_URL}${logoAsset(id, slogan)}`}
    alt={decorative ? '' : `Logomarca Gazin ${versionLabels[id]}${slogan ? ', com o slogan “Sempre fazendo o melhor pra Você!”' : ''}`}
    aria-hidden={decorative || undefined} decoding="async" draggable={false} />
}
