import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { ArrowUpRight, CalendarDays, Download, Expand, ImageOff, LayoutList, MapPin, Search, Shield, TriangleAlert, X } from 'lucide-react'
import type { Chapter, Subsection } from '../../data/brandChapters'
import { fairDates, fairMonth, institute, monthsLong, monthsShort, pendingLabel, sports, statusLabel, tradeFairs, vex, type TradeFair } from '../../data/sponsorships'
import { Segmented } from '../digital/DigitalShared'
import '../../styles/sponsorships.css'

const base = import.meta.env.BASE_URL
type Zoom = { src: string; width: number; height: number; title: string; caption: string }
const ZoomContext = createContext<(zoom: Zoom) => void>(() => {})

/** Shared enlarged view (native <dialog>: Escape, backdrop click, focus returns to the opener). */
function ZoomProvider({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const [zoom, setZoom] = useState<Zoom | null>(null)
  useEffect(() => {
    if (zoom && dialog.current && !dialog.current.open) {
      dialog.current.showModal()
      window.dispatchEvent(new CustomEvent('brandbook:scroll-lock', { detail: true }))
    }
  }, [zoom])
  const close = () => {
    window.dispatchEvent(new CustomEvent('brandbook:scroll-lock', { detail: false }))
    setZoom(null)
    opener.current?.focus({ preventScroll: true })
  }
  const open = (next: Zoom) => { opener.current = document.activeElement as HTMLElement; setZoom(next) }
  return <ZoomContext.Provider value={open}>
    {children}
    <dialog ref={dialog} className="sp-zoom" aria-label={zoom ? zoom.title : 'Imagem ampliada'} onClose={close} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}>
      {zoom && <figure><img src={`${base}${zoom.src}`} width={zoom.width} height={zoom.height} alt={zoom.title} /><figcaption><b>{zoom.title}</b>{zoom.caption}</figcaption></figure>}
      <button type="button" className="sp-zoom-close" onClick={() => dialog.current?.close()} aria-label="Fechar imagem ampliada"><X size={18} aria-hidden="true" /></button>
    </dialog>
  </ZoomContext.Provider>
}

function Section({ subsection, text, className = '', children }: { subsection: Subsection; text: string; className?: string; children: ReactNode }) {
  return <article id={subsection.id} className={`subsection sp-section ${className}`} data-status={subsection.status} aria-labelledby={`${subsection.id}-title`}>
    <header className="sp-head">
      <span className="subsection-number">{subsection.number}</span>
      <h3 id={`${subsection.id}-title`}>{subsection.title}</h3>
      <p>{text}</p>
    </header>
    {children}
  </article>
}

function Pending({ icon = <ImageOff size={22} aria-hidden="true" />, label = pendingLabel, detail }: { icon?: ReactNode; label?: string; detail?: string }) {
  return <span className="sp-pending">{icon}<b>{label}</b>{detail && <small>{detail}</small>}</span>
}
const External = ({ href, children, className = 'sp-link' }: { href: string; children: ReactNode; className?: string }) =>
  <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={15} aria-hidden="true" /><span className="pos-sr-only"> (abre em nova aba)</span></a>

// ── 09.1 ───────────────────────────────────────────────────────────────────────────────
function InstitutionalSponsorship() {
  const zoom = useContext(ZoomContext)
  const [active, setActive] = useState(institute.projects[0].id)
  const project = institute.projects.find(item => item.id === active)!
  const { hero } = institute
  return <div className="sp-institute">
    <div className="sp-institute-hero" data-sp-reveal>
      <button type="button" className="sp-institute-photo" onClick={() => zoom({ src: hero.path, width: hero.width, height: hero.height, title: institute.name, caption: hero.caption })} aria-label={`Ampliar: ${hero.caption}`}>
        <img src={`${base}${hero.path}`} width={hero.width} height={hero.height} alt={hero.alt} loading="lazy" decoding="async" />
        <span className="sp-institute-logo"><img src={`${base}${institute.logo.path}`} alt="Logo do Instituto Mário Gazin" /></span>
      </button>
      <div className="sp-institute-copy">
        <p className="sp-kicker">Destaque institucional</p>
        <h4>{institute.name}</h4>
        <blockquote className="sp-quote">“{institute.quote}”</blockquote>
        <p>{institute.text}</p>
        <p className="sp-muted">{institute.launched}</p>
        <ul className="sp-areas" aria-label="Áreas de atuação">{institute.areas.map(area => <li key={area}>{area}</li>)}</ul>
        <External href={institute.url} className="sp-button">Conhecer o Instituto</External>
      </div>
    </div>
    <div className="sp-projects">
      <p className="sp-kicker">Projetos</p>
      <div className="sp-project-strip" role="radiogroup" aria-label="Projetos do Instituto" onKeyDown={event => {
        const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
        if (!step) return
        event.preventDefault()
        // Move from the focused project (it may differ from the selected one).
        const radios = [...event.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]')]
        const from = Math.max(0, radios.indexOf(document.activeElement as HTMLElement))
        const index = (from + step + institute.projects.length) % institute.projects.length
        setActive(institute.projects[index].id)
        ;(event.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]')[index])?.focus()
      }}>
        {institute.projects.map(item => <button key={item.id} type="button" role="radio" aria-checked={active === item.id} tabIndex={active === item.id ? 0 : -1} onClick={() => setActive(item.id)} className="sp-project-card">
          {item.image ? <img src={`${base}${item.image.path}`} width={item.image.width} height={item.image.height} alt="" loading="lazy" decoding="async" /> : <span className="sp-project-art" aria-hidden="true">{item.name}</span>}
          <span className="sp-project-meta"><small>{item.area}</small><b>{item.name}</b></span>
        </button>)}
      </div>
      <div className="sp-project-detail" aria-live="polite" key={project.id}>
        <div className="sp-project-visual">
          {project.image
            ? <button type="button" onClick={() => zoom({ src: project.image!.path, width: project.image!.width, height: project.image!.height, title: project.name, caption: project.image!.caption })} aria-label={`Ampliar imagem: ${project.name}`}><img src={`${base}${project.image.path}`} width={project.image.width} height={project.image.height} alt={project.image.caption} /><Expand size={16} aria-hidden="true" /></button>
            : <Pending detail="Fotografia oficial do projeto" />}
        </div>
        <div>
          <p className="sp-kicker">{project.area}</p>
          <h5>{project.name}</h5>
          <p>{project.text}</p>
          {project.image && <p className="sp-muted">{project.image.caption}</p>}
          <External href={project.url}>Página oficial do projeto</External>
        </div>
      </div>
      <p className="sp-muted">{institute.photosNote}</p>
    </div>
  </div>
}

// ── 09.2 ───────────────────────────────────────────────────────────────────────────────
function SportsSponsorshipGallery() {
  const zoom = useContext(ZoomContext)
  const [active, setActive] = useState(sports.clubs[0].id)
  const club = sports.clubs.find(item => item.id === active)!
  return <div className="sp-sports">
    <Segmented className="sp-club-tabs" label="Clube patrocinado" value={active} onChange={setActive} options={sports.clubs.map(item => ({ id: item.id, label: <><Shield size={16} aria-hidden="true" />{item.short}</> }))} />
    <div className="sp-club" key={club.id} aria-live="polite">
      <div className="sp-club-photo">{club.photo
        ? <button type="button" onClick={() => zoom({ src: club.photo!.path, width: club.photo!.width, height: club.photo!.height, title: club.name, caption: 'Equipe com a marca Gazin no uniforme · fotografia fornecida pela equipe de marketing' })} aria-label={`Ampliar fotografia: ${club.name}`}><img src={`${base}${club.photo.path}`} width={club.photo.width} height={club.photo.height} alt={`Jogadores do ${club.short} em campo, com a marca Gazin no uniforme`} decoding="async" /><Expand size={16} aria-hidden="true" /></button>
        : <Pending detail="Fotografia oficial da equipe" />}</div>
      <div className="sp-club-info">
        <div className="sp-crest">{club.crest
          ? <img src={`${base}${club.crest.path}`} width={club.crest.width} height={club.crest.height} alt={`Escudo do ${club.name}`} decoding="async" />
          : <Pending icon={<Shield size={34} aria-hidden="true" />} label="Escudo oficial" detail="a inserir, sem alterações" />}</div>
        <p className="sp-kicker">{club.state}</p>
        <h4>{club.name}</h4>
        <p>{club.text}</p>
        <ul className="sp-seasons" aria-label="Temporadas">{club.seasons.map(season => <li key={season.year} className={`is-${season.status}`}>
          <b>{season.year}</b><span className="sp-status">{statusLabel[season.status]}</span><small>{season.note}{season.source && <> · <a href={season.source.url} target="_blank" rel="noopener noreferrer">{season.source.label}</a></>}</small>
        </li>)}</ul>
        <External href={club.site}>Site oficial do clube</External>
      </div>
    </div>
    <p className="sp-muted">{sports.note}</p>
  </div>
}

// ── 09.3 ───────────────────────────────────────────────────────────────────────────────
function VexEventShowcase() {
  const zoom = useContext(ZoomContext)
  return <div className="sp-vex">
    <div className="sp-vex-hero" data-sp-reveal>
      <img src={`${base}${vex.hero.path}`} width={vex.hero.width} height={vex.hero.height} alt="Identidade do Varejo Experience Brasil 2026: “A evolução começa aqui”" loading="lazy" decoding="async" />
      <div className="sp-vex-overlay">
        <p className="sp-kicker">Evento realizado pelo Grupo Gazin</p>
        <h4 className="pos-sr-only">{vex.name}</h4>
        <External href={vex.url} className="sp-button">Conhecer o VEX</External>
      </div>
    </div>
    <p className="sp-vex-text">{vex.text}</p>
    <div className="sp-editions">
      {[vex.editions.current, vex.editions.next].map((edition, index) => <div key={edition.label} className={index ? 'is-next' : ''}>
        <p className="sp-kicker"><CalendarDays size={14} aria-hidden="true" />{edition.label}</p>
        <p>{edition.text}</p>
        <small>{edition.source}</small>
      </div>)}
    </div>
    <ul className="sp-vex-gallery is-photos" aria-label="Fotografias do VEX26">{vex.photos.map(item => <li key={item.id} className={`is-${item.kind}`}>
      <button type="button" onClick={() => zoom({ src: item.image.path, width: item.image.width, height: item.image.height, title: item.title, caption: `${item.text} · VEX26` })} aria-label={`Ampliar: ${item.title}`}>
        <img src={`${base}${item.image.path}`} width={item.image.width} height={item.image.height} alt="" loading="lazy" decoding="async" />
        <span><b>{item.title}</b><small>{item.text}</small></span>
      </button>
    </li>)}</ul>
    <p className="sp-muted">{vex.materialsNote}</p>
  </div>
}

// ── 09.4 ───────────────────────────────────────────────────────────────────────────────
const normalize = (text: string) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
function TradeFairCard({ fair }: { fair: TradeFair }) {
  return <li className={`sp-fair ${fair.warning ? 'has-warning' : ''}`}>
    <span className="sp-fair-mark" aria-hidden="true"><b>{String(Number(fair.start.slice(8))).padStart(2, '0')}</b>{monthsShort[fairMonth(fair) - 1]}</span>
    <span className="sp-fair-body">
      <b className="sp-fair-name">{fair.name}</b>
      <span className="sp-fair-meta"><CalendarDays size={13} aria-hidden="true" />{fairDates(fair)} de 2027</span>
      <span className="sp-fair-meta"><MapPin size={13} aria-hidden="true" />{fair.city} · {fair.uf}</span>
      {fair.warning && <span className="sp-fair-warning"><TriangleAlert size={13} aria-hidden="true" />{fair.warning}</span>}
      {fair.link && <a className="sp-link" href={fair.link} target="_blank" rel="noopener noreferrer">Site oficial<ArrowUpRight size={13} aria-hidden="true" /></a>}
    </span>
  </li>
}

function TradeFairsTimeline() {
  const zoom = useContext(ZoomContext)
  const { fairs } = tradeFairs
  const [view, setView] = useState<'timeline' | 'list'>('timeline')
  const [query, setQuery] = useState('')
  const [uf, setUf] = useState('')
  const [city, setCity] = useState('')
  const [month, setMonth] = useState(fairMonth(fairs[0]))
  const ufs = [...new Set(fairs.map(item => item.uf))].sort()
  const cities = [...new Set(fairs.filter(item => !uf || item.uf === uf).map(item => item.city))].sort((a, b) => a.localeCompare(b))
  const filtered = useMemo(() => fairs.filter(item => (!uf || item.uf === uf) && (!city || item.city === city) && (!query.trim() || normalize(item.name).includes(normalize(query.trim())))), [fairs, uf, city, query])
  const byMonth = (m: number) => filtered.filter(item => fairMonth(item) === m)
  const shown = view === 'timeline' ? byMonth(month) : filtered
  const reset = () => { setQuery(''); setUf(''); setCity('') }
  return <div className="sp-fairs">
    <div className="sp-fair-filters" role="search">
      <label className="sp-search"><Search size={16} aria-hidden="true" /><span className="pos-sr-only">Nome do evento</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Nome do evento" /></label>
      <label className="sp-select"><span>Estado</span><select value={uf} onChange={event => { setUf(event.target.value); setCity('') }}><option value="">Todos</option>{ufs.map(item => <option key={item}>{item}</option>)}</select></label>
      <label className="sp-select"><span>Cidade</span><select value={city} onChange={event => setCity(event.target.value)}><option value="">Todas</option>{cities.map(item => <option key={item}>{item}</option>)}</select></label>
      <label className="sp-select"><span>Mês</span><select value={view === 'timeline' ? month : ''} onChange={event => { const value = Number(event.target.value); if (value) { setMonth(value); setView('timeline') } else setView('list') }}>
        <option value="">Todos</option>{monthsLong.map((name, index) => <option key={name} value={index + 1}>{name}</option>)}
      </select></label>
      <Segmented label="Visualização" value={view} onChange={setView} options={[{ id: 'timeline', label: <><CalendarDays size={14} aria-hidden="true" />Linha do tempo</> }, { id: 'list', label: <><LayoutList size={14} aria-hidden="true" />Lista de feiras</> }]} />
    </div>
    {view === 'timeline' && <ol className="sp-timeline" aria-label="Meses de 2027">{monthsShort.map((name, index) => {
      const count = byMonth(index + 1).length
      return <li key={name}><button type="button" aria-pressed={month === index + 1} disabled={!count} onClick={() => setMonth(index + 1)} aria-label={`${monthsLong[index]}: ${count} ${count === 1 ? 'evento' : 'eventos'}`}>
        <span>{name}</span><i aria-hidden="true">{count || ''}</i>
      </button></li>
    })}</ol>}
    <p className="sp-count" aria-live="polite">{view === 'timeline' ? `${monthsLong[month - 1]} de 2027 · ` : ''}{shown.length} {shown.length === 1 ? 'evento' : 'eventos'}</p>
    {shown.length
      ? <ul className={`sp-fair-list is-${view}`} key={`${view}-${month}`}>{shown.map(item => <TradeFairCard key={item.id} fair={item} />)}</ul>
      : <div className="sp-empty"><p>Nenhum evento com esses filtros{view === 'timeline' ? ' neste mês' : ''}.</p><button type="button" className="sp-link" onClick={reset}>Limpar filtros</button></div>}
    <p className="sp-muted">Fonte: {tradeFairs.fairs[0].source}. Ordenado por data, sem alterar o conteúdo original da planilha.</p>
    <div className="sp-download" data-sp-reveal>
      <div><p className="sp-kicker">{tradeFairs.owner}</p><h4>{tradeFairs.download.title}</h4><p>{tradeFairs.download.text}</p></div>
      <a className="sp-button" href={`${base}${tradeFairs.download.path}`} download={tradeFairs.download.fileName} type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
        <Download size={17} aria-hidden="true" />Baixar calendário de feiras<small>XLSX · planilha original · {Math.max(1, Math.round(tradeFairs.download.bytes / 1024))} KB</small>
      </a>
    </div>
    <div className="sp-booths">
      <p className="sp-kicker">{tradeFairs.booths.title}</p>
      <p className="sp-muted">{tradeFairs.booths.text}</p>
      <ul className="sp-booth-gallery">{tradeFairs.booths.photos.map(photo => <li key={photo.path}>
        <button type="button" onClick={() => zoom({ src: photo.path, width: photo.width, height: photo.height, title: photo.title, caption: photo.caption })} aria-label={`Ampliar: ${photo.title}`}>
          <img src={`${base}${photo.path}`} width={photo.width} height={photo.height} alt="" loading="lazy" decoding="async" />
          <span><b>{photo.title}</b><small>{photo.caption}</small></span>
        </button>
      </li>)}</ul>
    </div>
  </div>
}

/** Chapter 09 · Patrocínios e Eventos (data and sources: src/data/sponsorships.ts). */
export function SponsorshipsBody({ chapter }: { chapter: Chapter }) {
  const [institutional, sportsSection, events, fairs] = chapter.subsections
  return <ZoomProvider>
    <div className="chapter-body layout-sponsorships">
      <Section subsection={institutional} text="A atuação social, cultural, ambiental, educacional e esportiva do Grupo Gazin ganha força por meio do Instituto Mário Gazin." className="is-institute"><InstitutionalSponsorship /></Section>
      <Section subsection={sportsSection} text={sports.text} className="is-sports"><SportsSponsorshipGallery /></Section>
      <Section subsection={events} text="O Varejo Experience Brasil é o grande encontro do varejo realizado pelo Grupo Gazin, e cada edição traz uma comunicação visual própria." className="is-vex"><VexEventShowcase /></Section>
      <Section subsection={fairs} text={tradeFairs.text} className="is-fairs"><TradeFairsTimeline /></Section>
    </div>
  </ZoomProvider>
}
