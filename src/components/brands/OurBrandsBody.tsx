import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react'
import { ArrowLeft, ArrowRight, FileDown } from 'lucide-react'
import type { Chapter } from '../../data/brandChapters'
import { ourBrands, ourBrandsIntro, type OurBrand } from '../../data/ourBrands'
import '../../styles/our-brands.css'

const base = import.meta.env.BASE_URL
const motionOn = () => document.documentElement.classList.contains('motion-enabled')
const pad = (n: number) => String(n).padStart(2, '0')

/** Logo exactly as extracted (white surface: several logos have black elements). */
const Logo = ({ brand, eager = false }: { brand: OurBrand; eager?: boolean }) =>
  <img className="ob-logo" src={`${base}${brand.logo.path}`} width={brand.logo.width} height={brand.logo.height}
    alt={`Logomarca ${brand.name}`} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable={false}
    style={{ '--ratio': brand.logo.width / brand.logo.height, '--nw': brand.logo.width } as CSSProperties} />

/**
 * Nossas Marcas: gallery of the ten logos (optical sizing by aspect ratio) and a viewer with the
 * selected brand, counter and previous/next. Selecting in the gallery updates the viewer.
 */
export function OurBrandsBody({ chapter }: { chapter: Chapter }) {
  const [gallery, viewer] = chapter.subsections
  const [index, setIndex] = useState(0)
  const viewerRef = useRef<HTMLElement>(null)
  const current = ourBrands[index]
  const go = (next: number) => setIndex((next + ourBrands.length) % ourBrands.length)
  const pick = (next: number) => {
    setIndex(next)
    requestAnimationFrame(() => viewerRef.current?.scrollIntoView({ block: 'start', behavior: motionOn() ? 'smooth' : 'auto' }))
  }
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); go(index + 1) }
    if (event.key === 'ArrowLeft') { event.preventDefault(); go(index - 1) }
  }
  return <div className="chapter-body layout-our-brands">
    <p className="ob-concept">{ourBrandsIntro.concept}</p>

    <article id={gallery.id} className="subsection ob-section" aria-labelledby={`${gallery.id}-title`}>
      <header className="ob-head"><span className="subsection-number">{gallery.number}</span><h3 id={`${gallery.id}-title`}>{gallery.title}</h3></header>
      <ul className="ob-gallery">{ourBrands.map((brand, i) => <li key={brand.id} style={{ "--i": i } as CSSProperties}>
        <button type="button" aria-pressed={i === index} onClick={() => pick(i)} aria-label={`${brand.name} · ${brand.segment}: ver apresentação`}>
          <span className="ob-plate"><Logo brand={brand} /></span>
          <span className="ob-caption"><b>{brand.name}</b><small>{brand.segment}</small></span>
        </button>
      </li>)}</ul>
      <div className="ob-portfolio">
        <div><strong>{ourBrandsIntro.portfolio.note}</strong><p className="ob-note">{ourBrandsIntro.source}</p></div>
        <a className="ob-download" href={`${base}${ourBrandsIntro.portfolio.path}`} download={ourBrandsIntro.portfolio.file}><FileDown size={18} aria-hidden="true" /><span>{ourBrandsIntro.portfolio.label}<small>{ourBrandsIntro.portfolio.meta}</small></span></a>
      </div>
    </article>

    <article id={viewer.id} ref={viewerRef} className="subsection ob-section ob-viewer-section" aria-labelledby={`${viewer.id}-title`}>
      <header className="ob-head"><span className="subsection-number">{viewer.number}</span><h3 id={`${viewer.id}-title`}>{viewer.title}</h3></header>
      <div className="ob-viewer" role="group" aria-roledescription="visualizador de marcas" aria-label={`${current.name}, ${index + 1} de ${ourBrands.length}`} tabIndex={0} onKeyDown={onKeyDown}>
        <div className="ob-stage" key={current.id}><Logo brand={current} eager /></div>
        <div className="ob-info" key={`${current.id}-info`} aria-live="polite">
          <p className="ob-counter"><b>{pad(index + 1)}</b> / {pad(ourBrands.length)}</p>
          <p className="ob-segment">{current.segment}</p>
          <h4>{current.name}</h4>
          <p className="ob-description">{current.description}</p>
          <div className="ob-nav">
            <button type="button" onClick={() => go(index - 1)} aria-label={`Marca anterior: ${ourBrands[(index - 1 + ourBrands.length) % ourBrands.length].name}`}><ArrowLeft size={18} aria-hidden="true" /></button>
            <button type="button" onClick={() => go(index + 1)} aria-label={`Próxima marca: ${ourBrands[(index + 1) % ourBrands.length].name}`}><ArrowRight size={18} aria-hidden="true" /></button>
          </div>
        </div>
      </div>
      <ol className="ob-dots" aria-label="Marcas">{ourBrands.map((brand, i) => <li key={brand.id}>
        <button type="button" aria-current={i === index ? 'true' : undefined} onClick={() => setIndex(i)} aria-label={brand.name}><span /></button>
      </li>)}</ol>
    </article>
  </div>
}
