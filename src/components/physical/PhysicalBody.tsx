import { useState, type ReactNode } from 'react'
import { Check, Download, FileText, X } from 'lucide-react'
import type { Chapter, Subsection } from '../../data/brandChapters'
import { facades, internal, manualDownload, manualPage, pdv, photo, signage, uniforms, type Guideline } from '../../data/physicalCommunication'
import { InteractiveImageGuide, ManualPhoto } from './InteractiveImageGuide'
import '../../styles/physical.css'

const base = import.meta.env.BASE_URL

/**
 * Same anatomy as the other bento cards (number, title, text), so ids and navigation stay.
 * `side` continues the text column (guidelines); `children` fill the visual column.
 */
function Card({ subsection, text, className = '', side, children }: { subsection: Subsection; text: string; className?: string; side?: ReactNode; children: ReactNode }) {
  return <article id={subsection.id} className={`subsection cf-card ${className}`} data-status={subsection.status} aria-labelledby={`${subsection.id}-title`}>
    <header className="subsection-head">
      <span className="subsection-number">{subsection.number}</span>
      <h3 id={`${subsection.id}-title`}>{subsection.title}</h3>
    </header>
    <div className="subsection-text"><p>{text}</p></div>
    {side && <div className="cf-side">{side}</div>}
    <div className="cf-content">{children}</div>
  </article>
}

function Guidelines({ items, page }: { items: Guideline[]; page?: number }) {
  return <div className="cf-guidelines">
    <ul>{items.map(item => <li key={item.title}><b>{item.title}</b><span>{item.text}</span></li>)}</ul>
    <p className="cf-source">{page ? manualPage(page) : `Manual de Merchandising · págs. ${[...new Set(items.map(item => item.page))].sort((a, b) => a! - b!).join(', ')}`}</p>
  </div>
}

/** 07.3 · documented comparison (manual p. 14): inadequate vs adequate shop front. */
function PdvComparison() {
  const { wrong, right, page } = pdv.comparison
  const [show, setShow] = useState<'wrong' | 'right'>('right')
  const current = show === 'right' ? right : wrong
  return <figure className="cf-compare" data-mode={show}>
    <div className="cf-compare-toggle" role="radiogroup" aria-label="Aplicação">
      <button type="button" role="radio" aria-checked={show === 'wrong'} onClick={() => setShow('wrong')}><X size={14} aria-hidden="true" />Inadequado</button>
      <button type="button" role="radio" aria-checked={show === 'right'} onClick={() => setShow('right')}><Check size={14} aria-hidden="true" />Adequado</button>
    </div>
    <div className="cf-compare-stage">
      <ManualPhoto image={wrong} className={`is-wrong ${show === 'wrong' ? 'is-shown' : ''}`} />
      <ManualPhoto image={right} className={`is-right ${show === 'right' ? 'is-shown' : ''}`} />
      <span className={`cf-compare-badge is-${show}`} aria-hidden="true">{show === 'right' ? <Check size={16} /> : <X size={16} />}{current.caption}</span>
    </div>
    <figcaption aria-live="polite"><b>{current.caption}:</b> {current.text} <span className="cf-source">{manualPage(page)}</span></figcaption>
  </figure>
}

/** Download of the complete, original manual (118 pages): a plain link, no modal. */
export function MerchandisingManualDownload() {
  const { title, description, href, fileName, cover, pages, sizeMB, button } = manualDownload
  return <aside className="cf-download" aria-labelledby="cf-download-title" data-cf-reveal>
    <img className="cf-download-cover" src={`${base}${cover}`} alt="Capa do Manual de Merchandising Gazin" width={809} height={1144} loading="lazy" decoding="async" />
    <div className="cf-download-body">
      <p className="cf-kicker"><FileText size={14} aria-hidden="true" />Documento completo</p>
      <h3 id="cf-download-title">{title}</h3>
      <p>{description}</p>
      <dl className="cf-download-meta">
        <div><dt>Documento</dt><dd>PDF</dd></div>
        <div><dt>Total</dt><dd>{pages} páginas</dd></div>
        <div><dt>Tamanho</dt><dd>{sizeMB.toLocaleString('pt-BR')} MB</dd></div>
      </dl>
      <a className="cf-download-button" href={`${base}${href}`} download={fileName} type="application/pdf">
        <Download size={18} aria-hidden="true" />{button}
      </a>
    </div>
  </aside>
}

/** Chapter 07 · Comunicação Física: content from src/data/physicalCommunication.ts. */
export function PhysicalBody({ chapter }: { chapter: Chapter }) {
  const [facadeSection, internalSection, pdvSection, uniformSection, signageSection] = chapter.subsections
  const layout = photo('layout-loja')
  return <div className="chapter-body layout-bento layout-physical">
    <Card subsection={facadeSection} text={facades.text} className="is-facade is-split" side={<Guidelines items={facades.guidelines} />}>
      <InteractiveImageGuide image={facades.image} hotspots={facades.hotspots} />
    </Card>

    <Card subsection={internalSection} text={internal.text} className="is-internal is-split" side={<Guidelines items={internal.guidelines} />}>
      <div className="cf-pair">
        <figure className="cf-layout">
          <div className="cf-layout-frame"><img src={`${base}${layout.src}`} width={layout.width} height={layout.height} alt={internal.layout.image.alt} loading="lazy" decoding="async" /></div>
          <figcaption>
            <b>{internal.layout.image.caption}</b>
            <ol className="cf-zones">{internal.layout.zones.map(zone => <li key={zone}>{zone}</li>)}</ol>
            <span className="cf-source">{manualPage(layout.source)}</span>
          </figcaption>
        </figure>
        <InteractiveImageGuide image={internal.example.image} hotspots={internal.example.hotspots} />
      </div>
    </Card>

    <Card subsection={pdvSection} text={pdv.text} className="is-pdv is-split" side={<>
      <Guidelines items={pdv.guidelines} />
      <div className="cf-roles">
        <p className="cf-kicker">Responsabilidades</p>
        <ul>{pdv.responsibilities.map(role => <li key={role.title}><b>{role.title}</b>{role.text}</li>)}</ul>
        <p className="cf-source">{manualPage(pdv.responsibilitiesPage)}</p>
      </div>
    </>}>
      <div className="cf-gallery">
        {pdv.gallery.map(image => <figure key={image.id}>
          <div className="cf-gallery-frame"><ManualPhoto image={image} fit="contain" /></div>
          <figcaption>{image.caption}<span className="cf-source">{manualPage(photo(image.id).source)}</span></figcaption>
        </figure>)}
      </div>
      <PdvComparison />
    </Card>

    <Card subsection={uniformSection} text={uniforms.text} className="is-uniform">
      <figure className="cf-uniform">
        <div className="cf-uniform-frame"><ManualPhoto image={uniforms.image} fit="contain" /></div>
        <figcaption>{uniforms.image.caption}<span className="cf-source">{manualPage(uniforms.page)}</span></figcaption>
      </figure>
      <Guidelines items={uniforms.guidelines} page={uniforms.page} />
    </Card>

    <Card subsection={signageSection} text={signage.text} className="is-signage is-split"
      side={<InteractiveImageGuide image={signage.ambience.image} hotspots={signage.ambience.hotspots} />}>
      <figure className="cf-plates">
        <div className="cf-plates-frame"><ManualPhoto image={signage.plates} fit="contain" /></div>
        <figcaption>{signage.plates.caption}<span className="cf-source">{manualPage(photo(signage.plates.id).source)}</span></figcaption>
      </figure>
      <Guidelines items={signage.guidelines} />
      <p className="cf-technical"><b>{signage.technical.title}</b>{signage.technical.text}<span className="cf-source">{manualPage(signage.technical.page)}</span></p>
    </Card>

    <MerchandisingManualDownload />
  </div>
}
