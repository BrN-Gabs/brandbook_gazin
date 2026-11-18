import { useEffect, useRef, useState } from 'react'
import { Ban, Check, Clock, Download, Expand, Pause, Play, X } from 'lucide-react'
import { campaigns, internalAssets, internalLabels, language, materials, notices, tv, type Item } from '../../data/internalCommunication'
import { Segmented } from '../digital/DigitalShared'

const base = import.meta.env.BASE_URL
const motionOn = () => document.documentElement.classList.contains('motion-enabled')

function Items({ title, items }: { title: string; items: Item[] }) {
  return <div className="in-items"><p className="in-kicker">{title}</p><dl>{items.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>)}</dl></div>
}
function Checks({ title, items, kind = 'do' }: { title: string; items: string[]; kind?: 'do' | 'dont' }) {
  return <div className="in-checks"><p className="in-kicker">{title}</p><ul className={`is-${kind}`}>{items.map(item => <li key={item}>{kind === 'do' ? <Check size={14} aria-hidden="true" /> : <Ban size={14} aria-hidden="true" />}{item}</li>)}</ul></div>
}
const Label = ({ children }: { children: string }) => <p className="in-demo-label">{children}</p>
const size = (bytes: number) => bytes >= 1048576 ? `${(bytes / 1048576).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`
/** One real download per format (files generated in public/assets/comunicacao-interna/modelos). */
function TemplateLinks({ item }: { item: (typeof materials.library)[number] }) {
  return <>{item.files.map(file => <a key={file.name} className="vi-download is-compact" href={`${base}${file.path}`} download={file.name} aria-label={`Baixar ${item.name} (${file.format}${file.kind ? ` em ${file.kind}` : ''}, ${size(file.bytes)})`}>
    <Download size={14} aria-hidden="true" />{file.format}<small>{size(file.bytes)}</small>
  </a>)}</>
}

// ── 08.1 TV Gazin ──────────────────────────────────────────────────────────────────────
/**
 * Animated demonstration of an internal screen (16:9). No video file exists in the project, so
 * there is no play button pretending to be one: the scenes are real HTML, switchable by type,
 * advancing on their own only with motion enabled, while visible, and pausable.
 */
export function InternalTvShowcase() {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [visible, setVisible] = useState(false)
  const stage = useRef<HTMLDivElement>(null)
  const type = tv.types[index]
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .4 })
    if (stage.current) observer.observe(stage.current)
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!playing || !visible || !motionOn()) return
    const timer = window.setTimeout(() => setIndex(value => (value + 1) % tv.types.length), 5200)
    return () => clearTimeout(timer)
  }, [index, playing, visible])
  return <div className="in-grid">
    <div className="in-demo">
      <div className="in-monitor" ref={stage}>
        <div className="in-screen" role="img" aria-label={`Tela interna demonstrativa: ${type.screen.kicker}, “${type.screen.title}”. ${type.screen.line}`}>
          <div className="in-scene" key={type.id}>
            <img className="in-scene-tv" src={`${base}${internalAssets.tvGazin.src}`} alt="" />
            <p className="in-scene-kicker">{type.screen.kicker}</p>
            <p className="in-scene-title">{type.screen.title}</p>
            <p className="in-scene-line">{type.screen.line}</p>
            <span className="in-scene-bar" />
            <img className="in-scene-gazin" src={`${base}${internalAssets.gazin.src}`} alt="" />
          </div>
          <span className="in-screen-ratio">16:9</span>
        </div>
        <span className="in-monitor-stand" aria-hidden="true" />
      </div>
      <div className="in-tv-controls">
        <Segmented label="Tipo de conteúdo" value={type.id} onChange={id => setIndex(tv.types.findIndex(item => item.id === id))} options={tv.types.map(item => ({ id: item.id, label: item.title.replace(' organizacional', '').replace(' corporativos', '').replace(' internos', '') }))} />
        <button type="button" className="in-tv-pause" onClick={() => setPlaying(value => !value)} aria-pressed={!playing}>
          {playing ? <><Pause size={14} aria-hidden="true" />Pausar sequência</> : <><Play size={14} aria-hidden="true" />Retomar sequência</>}
        </button>
      </div>
      <Label>{tv.demoNote}</Label>
    </div>
    <div className="in-copy">
      <p className="in-scope">{tv.scope}</p>
      <Items title="Tipos de conteúdo" items={tv.types} />
      <Checks title="Diretrizes audiovisuais" items={tv.guidelines} />
      <p className="in-note">{tv.formats}</p>
    </div>
  </div>
}

// ── 08.2 Comunicados ───────────────────────────────────────────────────────────────────
function NoticePaper({ good, steps }: { good: boolean; steps: boolean }) {
  const { example, bad } = notices
  if (!good) return <article className="in-paper is-bad" aria-label="Comunicado inadequado (fictício)">
    <p className="in-paper-bad-title">{bad.title}</p>
    <p className="in-paper-bad-body">{bad.body}</p>
  </article>
  return <article className={`in-paper ${steps ? 'in-steps-on' : ''}`} aria-label="Comunicado recomendado (fictício)">
    <div data-step="01" className="in-paper-logo"><img src={`${base}${internalAssets.gazinLight.src}`} alt="Gazin" /></div>
    <h5 data-step="02">{example.title}</h5>
    <p data-step="03">{example.context}</p>
    <ol data-step="04">{example.steps.map(item => <li key={item}>{item}</li>)}</ol>
    <p data-step="05" className="in-paper-meta"><Clock size={13} aria-hidden="true" />{example.date}</p>
    <p data-step="06" className="in-paper-area">{example.area}</p>
  </article>
}

export function CorporateNoticeComparison() {
  const [mode, setMode] = useState<'inadequado' | 'recomendado'>('recomendado')
  const [steps, setSteps] = useState(true)
  const good = mode === 'recomendado'
  return <div className="in-grid">
    <div className="in-demo">
      <div className="in-compare-controls">
        <Segmented label="Versão do comunicado" value={mode} onChange={setMode} options={[
          { id: 'inadequado', label: <><Ban size={14} aria-hidden="true" />Inadequado</> },
          { id: 'recomendado', label: <><Check size={14} aria-hidden="true" />Recomendado</> },
        ]} />
        {good && <label className="dg-switch"><input type="checkbox" checked={steps} onChange={event => setSteps(event.target.checked)} /><span aria-hidden="true" />Mostrar estrutura</label>}
      </div>
      <div className={`in-desk ${good ? 'is-good' : 'is-bad'}`} key={mode}><NoticePaper good={good} steps={steps} /></div>
      <ul className={`in-verdict ${good ? 'is-do' : 'is-dont'}`} aria-live="polite">{(good ? notices.compare.good : notices.compare.bad).map(item => <li key={item}>{good ? <Check size={14} aria-hidden="true" /> : <Ban size={14} aria-hidden="true" />}{item}</li>)}</ul>
      <Label>{internalLabels.demo}</Label>
    </div>
    <div className="in-copy">
      <div className="in-items"><p className="in-kicker">Estrutura recomendada</p><ol className="in-structure">{notices.structure.map((item, index) => <li key={item.title}><b>{String(index + 1).padStart(2, '0')}</b><span><strong>{item.title}</strong>{item.text}</span></li>)}</ol></div>
      <Items title="Tipos de comunicado" items={notices.types} />
      <Checks title="Diretrizes de linguagem" items={notices.language} />
      <div className="in-templates">
        <p className="in-kicker">Modelo de comunicado</p>
        <p className="in-note">{notices.templatesNote}</p>
        <span className="in-library-files"><TemplateLinks item={materials.library.find(item => item.id === 'comunicado')!} /></span>
      </div>
    </div>
  </div>
}

// ── 08.3 Campanhas ─────────────────────────────────────────────────────────────────────
type Piece = (typeof campaigns.gallery)[number]
function CampaignArt({ piece }: { piece: Piece }) {
  return <span className="in-campaign-art">
    <img src={`${base}${piece.photo.src}`} width={piece.photo.width} height={piece.photo.height} alt="" loading="lazy" decoding="async" />
    <span className="in-campaign-copy"><small>{piece.category}</small><b>{piece.headline}</b></span>
    <img className="in-campaign-logo" src={`${base}${internalAssets.gazin.src}`} alt="" />
  </span>
}

export function EmployeeCampaignGallery() {
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const [open, setOpen] = useState<Piece | null>(null)
  useEffect(() => {
    if (open && dialog.current && !dialog.current.open) {
      dialog.current.showModal()
      window.dispatchEvent(new CustomEvent('brandbook:scroll-lock', { detail: true }))
    }
  }, [open])
  const close = () => {
    window.dispatchEvent(new CustomEvent('brandbook:scroll-lock', { detail: false }))
    setOpen(null)
    opener.current?.focus({ preventScroll: true })
  }
  return <div className="in-grid">
    <div className="in-demo">
      <ul className="in-gallery">{campaigns.gallery.map(piece => <li key={piece.id}>
        <button type="button" onClick={event => { opener.current = event.currentTarget; setOpen(piece) }} aria-label={`Ampliar: ${piece.title} (${piece.category})`}>
          <CampaignArt piece={piece} />
          <span className="in-gallery-info"><small>{piece.category}</small><b>{piece.title}</b><span>{piece.text}</span><em><Expand size={13} aria-hidden="true" />Ver ampliado</em></span>
        </button>
      </li>)}</ul>
      <Label>{campaigns.galleryNote}</Label>
      <dialog ref={dialog} className="in-viewer" aria-label={open ? `${open.title} ampliada` : 'Peça ampliada'} onClose={close} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}>
        {open && <div className="in-viewer-body">
          <CampaignArt piece={open} />
          <div><small>{open.category}</small><h5>{open.title}</h5><p>{open.text}</p><p className="in-demo-label">{internalLabels.demo}</p></div>
        </div>}
        <button type="button" className="in-viewer-close" onClick={() => dialog.current?.close()} aria-label="Fechar peça ampliada"><X size={18} aria-hidden="true" /></button>
      </dialog>
    </div>
    <div className="in-copy">
      <Items title="Categorias de campanhas" items={campaigns.categories} />
      <Checks title="Diretrizes criativas" items={campaigns.guidelines} />
    </div>
  </div>
}

// ── 08.4 Materiais ─────────────────────────────────────────────────────────────────────
function MaterialMockup({ id }: { id: string }) {
  const logo = <img src={`${base}${internalAssets.gazinLight.src}`} alt="" />
  if (id === 'apresentacao') return <div className="in-mock is-slide" aria-hidden="true">
    <span className="in-mock-band"><img src={`${base}${internalAssets.gazin.src}`} alt="" /></span>
    <span className="in-mock-heading">Título da apresentação</span>
    <span className="in-mock-sub">Subtítulo · área · data</span>
    <span className="in-mock-cols"><i /><i /><i /></span>
  </div>
  if (id === 'documento') return <div className="in-mock is-doc" aria-hidden="true">
    <span className="in-mock-head">{logo}<small>Documento institucional</small></span>
    <span className="in-mock-heading">Título do documento</span>
    <span className="in-mock-lines"><i /><i /><i /><i /><i /></span>
    <span className="in-mock-sign">Área responsável</span>
  </div>
  return <div className="in-mock is-report" aria-hidden="true">
    <span className="in-mock-head">{logo}<small>Relatório</small></span>
    <span className="in-mock-heading">Indicadores do período</span>
    <span className="in-mock-kpis"><i><b>00</b>indicador</i><i><b>00</b>indicador</i><i><b>00</b>indicador</i></span>
    <span className="in-mock-chart">{[42, 64, 52, 78, 70, 88].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</span>
  </div>
}

export function InternalMaterialsLibrary() {
  const [mockup, setMockup] = useState(materials.mockups[0].id)
  return <div className="in-grid">
    <div className="in-demo">
      <Segmented label="Tipo de material" value={mockup} onChange={setMockup} options={materials.mockups.map(item => ({ id: item.id, label: item.label }))} />
      <div className="in-mock-stage" role="img" aria-label={`Mockup de estrutura: ${materials.mockups.find(item => item.id === mockup)!.label.toLowerCase()} com a identidade Gazin`} key={mockup}><MaterialMockup id={mockup} /></div>
      <Label>{materials.mockupNote}</Label>
      <div className="in-library">
        <p className="in-kicker">Biblioteca de materiais</p>
        <ul>{materials.library.map(item => <li key={item.id}>
          <span className="in-library-info"><b>{item.name}</b><small>{item.category} · {item.files.map(file => file.format).join(' · ')}</small><span>{item.description}</span></span>
          {item.files.length
            ? <span className="in-library-files"><TemplateLinks item={item} /></span>
            : <span className="in-pending">{internalLabels.pending}</span>}
        </li>)}</ul>
        <p className="in-note">{materials.libraryNote}</p>
      </div>
    </div>
    <div className="in-copy">
      <Items title="Tipos de materiais" items={materials.types} />
      <Items title="Diretrizes principais" items={materials.guidelines} />
    </div>
  </div>
}

// ── 08.5 Linguagem ─────────────────────────────────────────────────────────────────────
export function InternalLanguageGuide() {
  const [exampleId, setExampleId] = useState(language.examples[0].id)
  const [version, setVersion] = useState<'evitar' | 'preferir'>('evitar')
  const example = language.examples.find(item => item.id === exampleId)!
  const better = version === 'preferir'
  return <div className="in-grid">
    <div className="in-demo">
      <Segmented className="in-lang-segmented" label="Exemplo" value={exampleId} onChange={id => { setExampleId(id); setVersion('evitar') }} options={language.examples.map(item => ({ id: item.id, label: <><small>{item.number}</small>{item.title}</> }))} />
      <div className={`in-message ${better ? 'is-better' : 'is-worse'}`}>
        <Segmented label="Versão da mensagem" value={version} onChange={setVersion} options={[
          { id: 'evitar', label: <><Ban size={14} aria-hidden="true" />Evitar</> },
          { id: 'preferir', label: <><Check size={14} aria-hidden="true" />Preferir</> },
        ]} />
        <blockquote key={`${example.id}-${version}`} aria-live="polite">
          <p className="in-message-tag">{better ? <><Check size={14} aria-hidden="true" />Preferir</> : <><Ban size={14} aria-hidden="true" />Evitar</>}</p>
          <p>“{better ? example.prefer : example.avoid}”</p>
          {better && <footer>{example.why}</footer>}
        </blockquote>
      </div>
      <Label>{language.examplesNote}</Label>
    </div>
    <div className="in-copy">
      <Items title="Atributos" items={language.attributes} />
      <div className="in-two">
        <Checks title="Preferir" items={language.prefer} />
        <Checks title="Evitar" items={language.avoid} kind="dont" />
      </div>
    </div>
  </div>
}
