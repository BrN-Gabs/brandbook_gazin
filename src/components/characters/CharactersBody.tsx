import { useState, type CSSProperties, type ReactNode } from 'react'
import { ArrowUpRight, Ban, BarChart3, BookOpen, Check, Download, FileArchive, MessageCircle, Search, Sparkles } from 'lucide-react'
import type { Chapter, Subsection } from '../../data/brandChapters'
import { characterFiles, charactersIntro, gia, guidelines, library, teo, type CharacterFile } from '../../data/characters'
import { Segmented } from '../digital/DigitalShared'
import '../../styles/characters.css'

const base = import.meta.env.BASE_URL
type Who = 'teo' | 'gia'
const featureIcons = { pesquisar: Search, criar: Sparkles, analisar: BarChart3, aprender: BookOpen }
const kb = (bytes: number) => bytes >= 1048576 ? `${(bytes / 1048576).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`

function Section({ subsection, children, className = '' }: { subsection: Subsection; children: ReactNode; className?: string }) {
  return <article id={subsection.id} className={`subsection ch-section ${className}`} data-status={subsection.status} aria-labelledby={`${subsection.id}-title`}>
    <header className="ch-head"><span className="subsection-number">{subsection.number}</span><h3 id={`${subsection.id}-title`}>{subsection.title}</h3></header>
    {children}
  </article>
}

const TeoImage = ({ className = '', style }: { className?: string; style?: CSSProperties }) =>
  <img className={`ch-teo-img ${className}`} style={style} src={`${base}${teo.image.path}`} width={teo.image.width} height={teo.image.height} alt={teo.image.alt} loading="lazy" decoding="async" draggable={false} />

/** GI.A (official pose) on a network of blue lines and points (CSS/SVG, light). */
function GiaMark({ small = false, full = false }: { small?: boolean; full?: boolean }) {
  const image = full ? gia.hero : gia.image
  return <div className={`ch-gia-mark ${small ? 'is-small' : ''} ${full ? 'is-full' : ''}`}>
    <svg className="ch-gia-network" viewBox="0 0 400 300" aria-hidden="true">
      {[[60, 70, 200, 150], [340, 60, 200, 150], [40, 230, 200, 150], [360, 240, 200, 150], [120, 20, 200, 150], [290, 285, 200, 150]].map(([x1, y1, x2, y2], index) =>
        <g key={index} style={{ '--i': index } as CSSProperties}><line x1={x1} y1={y1} x2={x2} y2={y2} /><circle cx={x1} cy={y1} r="4" /></g>)}
    </svg>
    <img className="ch-gia-img" src={`${base}${image.path}`} width={image.width} height={image.height} alt={image.alt} loading="lazy" decoding="async" draggable={false} />
  </div>
}

/** Official poses of a character: pick one to see it large. Black-background poses stay as supplied. */
function PoseGallery({ who }: { who: Who }) {
  const items = characterFiles[who]
  const [active, setActive] = useState(items[who === 'teo' ? 1 : 2].id)
  const current = items.find(item => item.id === active)!
  return <div className={`ch-poses is-${who}`}>
    <figure className={`ch-pose-stage is-${current.background === 'preto' ? 'black' : 'clear'}`} key={current.id}>
      <img src={`${base}${current.preview.path}`} width={current.preview.width} height={current.preview.height} alt={`${who === 'teo' ? 'Téo' : 'GI.A'}: pose ${current.name.toLowerCase()}`} decoding="async" draggable={false} />
      <figcaption>{current.name}</figcaption>
    </figure>
    <div className="ch-pose-list" role="radiogroup" aria-label={`Poses ${who === 'teo' ? 'do Téo' : 'da GI.A'}`}>
      {items.map(item => <button key={item.id} type="button" role="radio" aria-checked={item.id === active} onClick={() => setActive(item.id)} className={item.background === 'preto' ? 'is-black' : ''} title={item.name}>
        <img src={`${base}${item.preview.path}`} width={item.preview.width} height={item.preview.height} alt="" loading="lazy" decoding="async" draggable={false} />
        <span>{item.name}</span>
      </button>)}
    </div>
  </div>
}

const External = ({ href, children, className = 'ch-button' }: { href: string; children: ReactNode; className?: string }) =>
  <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={15} aria-hidden="true" /><span className="pos-sr-only"> (abre em nova aba)</span></a>

// ── 01 ────────────────────────────────────────────────────────────────────────────────
function CharactersIntroduction({ sections }: { sections: Subsection[] }) {
  const [focus, setFocus] = useState<Who>('teo')
  const info = focus === 'teo' ? teo : gia
  return <div className="ch-meet">
    <p className="ch-concept">{charactersIntro.concept}</p>
    <Segmented className="ch-switch" label="Personagem" value={focus} onChange={setFocus} options={[{ id: 'teo', label: 'Téo' }, { id: 'gia', label: 'GI.A' }]} />
    <div className={`ch-duo is-${focus}`}>
      <button type="button" className="ch-duo-teo" onClick={() => setFocus('teo')} aria-pressed={focus === 'teo'} aria-label="Destacar o Téo">
        <TeoImage />
        <span className="ch-duo-name"><b>TÉO</b><small>{teo.role}</small></span>
      </button>
      <button type="button" className="ch-duo-gia" onClick={() => setFocus('gia')} aria-pressed={focus === 'gia'} aria-label="Destacar a GI.A">
        <GiaMark />
        <span className="ch-duo-name"><b>GI.A</b><small>{gia.role}</small></span>
      </button>
    </div>
    <div className="ch-meet-detail" key={focus} aria-live="polite">
      <p className="ch-lead">{info.short}</p>
      <ul className="ch-tags" aria-label="Palavras-chave">{info.keywords.map(word => <li key={word}>{word}</li>)}</ul>
      <div>
        <p className="ch-kicker">Principais aplicações</p>
        <ul className="ch-uses">{info.uses.map(use => <li key={use}><Check size={14} aria-hidden="true" />{use}</li>)}</ul>
      </div>
      <a className="ch-link" href={`#${sections[focus === 'teo' ? 1 : 2].id}`}>Conhecer {focus === 'teo' ? 'o Téo' : 'a GI.A'} em detalhes<ArrowUpRight size={14} aria-hidden="true" /></a>
    </div>
  </div>
}

// ── 02 ────────────────────────────────────────────────────────────────────────────────
function TeoShowcase() {
  const [sceneId, setSceneId] = useState(teo.scenes[0].id)
  const scene = teo.scenes.find(item => item.id === sceneId)!
  return <div className="ch-teo">
    <div className="ch-teo-hero">
      <div className="ch-teo-stage" data-ch-reveal><span className="ch-glow" aria-hidden="true" /><TeoImage /></div>
      <div className="ch-teo-copy">
        <p className="ch-kicker">Atendimento e relacionamento</p>
        <p className="ch-text">{teo.text}</p>
        <dl className="ch-traits">{teo.traits.map((trait, index) => <div key={trait.title} style={{ '--i': index } as CSSProperties}><dt>{trait.title}</dt><dd>{trait.text}</dd></div>)}</dl>
        <p className="ch-note">{teo.traitsNote}</p>
      </div>
    </div>
    <div className="ch-grid-2">
      <div>
        <p className="ch-kicker">Identidade a preservar</p>
        <ul className="ch-uses">{teo.preserve.map(item => <li key={item}><Check size={14} aria-hidden="true" />{item}</li>)}</ul>
      </div>
      <dl className="ch-apps is-compact">{teo.applications.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>)}</dl>
    </div>
    <div className="ch-pose-block">
      <p className="ch-kicker">Poses e expressões</p>
      <PoseGallery who="teo" />
      <p className="ch-note">{teo.poses.note}</p>
    </div>
    <div className="ch-action">
      <div className="ch-action-head"><h4>Téo em ação</h4><Segmented label="Contexto" value={sceneId} onChange={setSceneId} options={teo.scenes.map(item => ({ id: item.id, label: item.label }))} /></div>
      <div className={`ch-scene is-${scene.id}`} key={scene.id}>
        {(() => { const image = characterFiles.teo.find(item => item.id === scene.pose)!.preview; return <img className="ch-scene-teo" src={`${base}${image.path}`} width={image.width} height={image.height} alt={`Téo: ${scene.label.toLowerCase()}`} decoding="async" draggable={false} /> })()}
        <p className="ch-bubble"><MessageCircle size={16} aria-hidden="true" />{scene.message}</p>
        <p className="ch-scene-tip"><b>Aplicação recomendada</b>{scene.tip}</p>
      </div>
      <p className="ch-demo-label">{teo.sceneNote}</p>
    </div>
  </div>
}

// ── 03 ────────────────────────────────────────────────────────────────────────────────
function GiaShowcase() {
  const [featureId, setFeatureId] = useState(gia.features[0].id)
  const feature = gia.features.find(item => item.id === featureId)!
  return <div className="ch-gia">
    <div className="ch-gia-hero">
      <div className="ch-gia-brand" data-ch-reveal><GiaMark full /><p className="ch-gia-concept">{gia.concept}</p></div>
      <div className="ch-gia-copy">
        <p className="ch-kicker">Inteligência artificial Gazin</p>
        <p className="ch-text">{gia.text}</p>
        <External href={gia.url}>Acessar GI.A</External>
        <p className="ch-note">Acesso com as credenciais corporativas da Gazin, na própria plataforma.</p>
      </div>
    </div>
    <div className="ch-gia-features">
      <div className="ch-feature-list" role="radiogroup" aria-label="Funcionalidades da GI.A" onKeyDown={event => {
        const step = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 0
        if (!step) return
        event.preventDefault()
        const index = (gia.features.findIndex(item => item.id === featureId) + step + gia.features.length) % gia.features.length
        setFeatureId(gia.features[index].id)
        ;(event.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]')[index])?.focus()
      }}>
        {gia.features.map((item, index) => {
          const Icon = featureIcons[item.id as keyof typeof featureIcons]
          return <button key={item.id} type="button" role="radio" aria-checked={featureId === item.id} tabIndex={featureId === item.id ? 0 : -1} onClick={() => setFeatureId(item.id)} style={{ '--i': index } as CSSProperties}>
            <span className="ch-feature-icon"><Icon size={18} aria-hidden="true" /></span><b>{item.label}</b><small>{item.text}</small>
          </button>
        })}
      </div>
      <div className="ch-feature-demo" key={feature.id} aria-live="polite">
        <p className="ch-kicker">{feature.label} · ilustração</p>
        <p className="ch-feature-input">{feature.demo}</p>
        <p className="ch-note">{gia.featuresNote}</p>
      </div>
    </div>
    <div className="ch-pose-block">
      <p className="ch-kicker">Poses e expressões</p>
      <PoseGallery who="gia" />
      <p className="ch-note">{gia.poses.note}</p>
    </div>
    <figure className="ch-gia-screen">
      <div className="ch-browser"><span aria-hidden="true"><i /><i /><i /><em>gia.gazin.com.br</em></span><img src={`${base}${gia.interface.path}`} width={gia.interface.width} height={gia.interface.height} alt={gia.interface.alt} loading="lazy" decoding="async" /></div>
      <figcaption>Interface da plataforma: captura da tela inicial (recorte, sem dados do usuário). {gia.pending}</figcaption>
    </figure>
  </div>
}

// ── 04 ────────────────────────────────────────────────────────────────────────────────
function CharacterComparison() {
  const [who, setWho] = useState<Who>('teo')
  const [mode, setMode] = useState<'correto' | 'incorreto'>('correto')
  const wrong = mode === 'incorreto'
  const list = guidelines.compare[who][wrong ? 'wrong' : 'correct']
  return <div className="ch-guides">
    <p className="ch-lead">{guidelines.general}</p>
    <dl className="ch-apps is-rules">{guidelines.rules.map(rule => <div key={rule.title}><dt>{rule.title}</dt><dd>{rule.text}</dd></div>)}</dl>
    <div className="ch-compare">
      <div className="ch-compare-controls">
        <Segmented label="Personagem do comparador" value={who} onChange={setWho} options={[{ id: 'teo', label: 'Téo' }, { id: 'gia', label: 'GI.A' }]} />
        <Segmented label="Uso" value={mode} onChange={setMode} options={[{ id: 'correto', label: <><Check size={14} aria-hidden="true" />Correto</> }, { id: 'incorreto', label: <><Ban size={14} aria-hidden="true" />Incorreto</> }]} />
      </div>
      <div className={`ch-compare-stage is-${who} ${wrong ? 'is-wrong' : 'is-right'}`} role="img" aria-label={`${who === 'teo' ? 'Téo' : 'GI.A'}: uso ${mode}. ${list.join(', ')}.`}>
        {who === 'teo'
          ? <><TeoImage className="ch-compare-teo" />{wrong && <span className="ch-compare-context">Liquidação total! Só hoje!!!</span>}</>
          : <><img className="ch-compare-gia" src={`${base}${gia.image.path}`} width={gia.image.width} height={gia.image.height} alt="" />{wrong && <span className="ch-compare-context">Uma IA humana que garante 100% de acerto!</span>}</>}
        {wrong && <span className="vi-wrong-stamp" aria-hidden="true">Não utilizar</span>}
      </div>
      <ul className={`ch-verdict ${wrong ? 'is-dont' : 'is-do'}`} aria-live="polite">{list.map(item => <li key={item}>{wrong ? <Ban size={14} aria-hidden="true" /> : <Check size={14} aria-hidden="true" />}{item}</li>)}</ul>
      <p className="ch-demo-label">{guidelines.compare.note}</p>
    </div>
  </div>
}

// ── 05 ────────────────────────────────────────────────────────────────────────────────
type Asset = Pick<CharacterFile, 'id' | 'name' | 'file' | 'path' | 'format' | 'width' | 'height' | 'bytes' | 'background'> & { preview?: { path: string; width: number; height: number } }
function AssetCard({ file, who }: { file: Asset; who: Who }) {
  const shown = file.preview ?? file
  return <li className="ch-asset">
    <span className={`ch-asset-preview is-${file.background === 'preto' ? 'black' : file.background === 'interface' ? 'ui' : 'clear'}`}><img src={`${base}${shown.path}`} width={shown.width} height={shown.height} alt="" loading="lazy" decoding="async" /></span>
    <span className="ch-asset-info"><b>{who === 'teo' ? 'Téo' : 'GI.A'} · {file.name}</b><small>{file.format} · {file.width} × {file.height} px · {kb(file.bytes)}</small><small>{file.background === 'interface' ? 'Captura da plataforma, sem dados do usuário' : `Arquivo original · fundo ${file.background}`}</small></span>
    <a className="vi-download is-compact" href={`${base}${file.path}`} download={file.file} aria-label={`Baixar ${file.name} (${file.format})`}><Download size={15} aria-hidden="true" /><span>Baixar</span></a>
  </li>
}
function CharacterAssetsLibrary() {
  const [who, setWho] = useState<Who>('teo')
  const items: Asset[] = characterFiles[who]
  const zip = characterFiles.zips[who]
  return <div className="ch-library">
    <header><h4>{library.title}</h4><p>{library.text}</p></header>
    <div className="ch-library-bar">
      <Segmented label="Materiais de" value={who} onChange={setWho} options={[{ id: 'teo', label: 'Téo' }, { id: 'gia', label: 'GI.A' }]} />
      <a className="vi-download is-primary" href={`${base}${zip.path}`} download={`materiais-${who}-gazin.zip`}><FileArchive size={16} aria-hidden="true" /><span>{who === 'teo' ? 'Baixar materiais do Téo' : 'Baixar materiais da GI.A'} · ZIP · {kb(zip.bytes)}</span></a>
    </div>
    <ul className="ch-assets" key={who}>{items.map(file => <AssetCard key={file.file} file={file} who={who} />)}</ul>
    {library.pending[who].length > 0 && <p className="ch-note">Ainda não disponíveis: {library.pending[who].join(' · ')}.</p>}
  </div>
}

/** Chapter · Personagens da Marca (data: src/data/characters.ts). */
export function CharactersBody({ chapter }: { chapter: Chapter }) {
  const [meet, teoSection, giaSection, guides, lib] = chapter.subsections
  return <div className="chapter-body layout-characters">
    <p className="ch-proposal">{charactersIntro.proposal}</p>
    <Section subsection={meet} className="is-meet"><CharactersIntroduction sections={chapter.subsections} /></Section>
    <Section subsection={teoSection} className="is-teo"><TeoShowcase /></Section>
    <Section subsection={giaSection} className="is-gia"><GiaShowcase /></Section>
    <Section subsection={guides}><CharacterComparison /></Section>
    <Section subsection={lib}><CharacterAssetsLibrary /></Section>
  </div>
}
