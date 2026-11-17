import { useState, type CSSProperties, type ReactNode } from 'react'
import { ArrowDown, Ban, Check, Eye, Handshake, Tv } from 'lucide-react'
import type { Chapter, Subsection } from '../../data/brandChapters'
import { campaigns, creative, gazinLogo, hierarchy, institutional, logoOf, months, pagePreviewOf, promotional, standardization, supplierCampaign } from '../../data/campaigns'
import { base, CampaignArt, CampaignViewerProvider, LogoDownload, useCampaignViewer } from './CampaignViewer'
import { CalendarDownload, CampaignLibrary } from './CampaignLibrary'
import '../../styles/campaigns.css'

/** Mosaic card with the same anatomy as the other chapters (ids and navigation preserved). */
function Card({ subsection, text, className = '', children }: { subsection: Subsection; text: string; className?: string; children: ReactNode }) {
  return <article id={subsection.id} className={`subsection cp-section ${className}`} data-status={subsection.status} aria-labelledby={`${subsection.id}-title`}>
    <header className="subsection-head">
      <span className="subsection-number">{subsection.number}</span>
      <h3 id={`${subsection.id}-title`}>{subsection.title}</h3>
    </header>
    <div className="subsection-text"><p>{text}</p></div>
    <div className="cp-content">{children}</div>
  </article>
}
const toLibrary = () => document.getElementById('cp-library-title')?.scrollIntoView({ block: 'start', behavior: document.documentElement.classList.contains('motion-enabled') ? 'smooth' : 'auto' })

// ── 05.1 ───────────────────────────────────────────────────────────────────────────────
function InstitutionalFeature() {
  const open = useCampaignViewer()
  const { feature } = institutional
  const logo = logoOf(feature.id)!
  const campaign = campaigns.find(item => item.id === feature.id)!
  return <div className="cp-feature">
    <div className="cp-feature-art">
      <button type="button" className="cp-feature-logo" onClick={() => open(feature.id)} aria-label={`Ver detalhes: ${feature.name}`}>
        <img src={`${base}${logo.preview}`} width={logo.previewWidth} height={logo.previewHeight} alt="Logo 61 anos Gazin" loading="lazy" decoding="async" draggable={false} />
      </button>
      <blockquote className="cp-feature-quote"><p>{feature.quote}</p><footer>Calendário 2027 · pág. 2</footer></blockquote>
    </div>
    <div className="cp-feature-info">
      <p className="cp-kicker">Campanha de referência · 2027</p>
      <p className="cp-feature-name">{feature.name}</p>
      <p className="cp-feature-concept">“{feature.concept}”</p>
      <p>{feature.text}</p>
      <div className="cp-row">
        <button type="button" className="cp-view" onClick={() => open(feature.id)}><Eye size={15} aria-hidden="true" />Ver detalhes</button>
        <LogoDownload campaign={campaign} compact />
      </div>
    </div>
  </div>
}

// ── 05.2 ───────────────────────────────────────────────────────────────────────────────
/** Recurring identities + a 12-month strip with each month's campaigns (opens the details panel). */
function PromotionalOverview() {
  const open = useCampaignViewer()
  const recurring = campaigns.filter(campaign => campaign.kind === 'recorrente')
  return <div className="cp-promo">
    <div>
      <p className="cp-kicker">Recorrentes</p>
      <ul className="cp-recurring">{recurring.map(campaign => <li key={campaign.id}>
        <button type="button" onClick={() => open(campaign.id)} aria-label={`Ver detalhes: ${campaign.name}`}><CampaignArt campaign={campaign} /><span>{campaign.name}</span></button>
      </li>)}</ul>
    </div>
    <div>
      <p className="cp-kicker">Sazonais · mês a mês</p>
      <ol className="cp-months">{months.map((name, index) => {
        const items = campaigns.filter(campaign => campaign.month === index + 1)
        return <li key={name}>
          <span className="cp-month-name">{name.slice(0, 3)}</span>
          <span className="cp-month-items">{items.map(campaign => <button key={campaign.id} type="button" onClick={() => open(campaign.id)} title={campaign.name} aria-label={`${campaign.name} · ${name} · ${campaign.period}`}>
            {logoOf(campaign.id) ? <img src={`${base}${logoOf(campaign.id)!.preview}`} alt="" width={logoOf(campaign.id)!.previewWidth} height={logoOf(campaign.id)!.previewHeight} loading="lazy" decoding="async" /> : <span>{campaign.name}</span>}
          </button>)}</span>
        </li>
      })}</ol>
    </div>
    <button type="button" className="cp-view" onClick={toLibrary}>Abrir a biblioteca completa<ArrowDown size={15} aria-hidden="true" /></button>
  </div>
}

// ── Hoje é Dia D · exclusiva para fornecedores ────────────────────────────────────────
/** Supplier-only campaign: kept out of the consumer library and downloads. */
function SupplierCampaign() {
  // Only the campaign logo, cropped from the calendar art (the text box is already beside it).
  const logo = pagePreviewOf(`${supplierCampaign.id}-logo`)!
  return <aside className="cp-supplier" aria-labelledby="cp-supplier-title" data-cp-reveal>
    <img className="cp-supplier-art" src={`${base}${logo.path}`} width={logo.width} height={logo.height} alt={`Logo “${supplierCampaign.name}” · ${supplierCampaign.signature}`} loading="lazy" decoding="async" />
    <div className="cp-supplier-body">
      <p className="cp-kicker"><Handshake size={14} aria-hidden="true" />{supplierCampaign.audience}</p>
      <h3 id="cp-supplier-title">{supplierCampaign.name}</h3>
      <p className="cp-supplier-signature">{supplierCampaign.signature}</p>
      <p className="cp-supplier-headline">{supplierCampaign.headline}</p>
      <p>{supplierCampaign.text}</p>
      <dl className="cp-supplier-facts">{supplierCampaign.facts.map(fact => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl>
      <p className="cp-muted">{supplierCampaign.note}</p>
    </div>
  </aside>
}

// ── Demonstration piece (05.3, 05.4, 05.5) ─────────────────────────────────────────────
type Region = 'identificacao' | 'mensagem' | 'produto' | 'comercial' | 'complementar' | 'marca'
type Fault = 'distorcida' | 'cores' | 'sobreposicao' | 'sem-gazin' | 'legibilidade' | null
const demoCampaign = campaigns.find(campaign => campaign.id === 'semana-da-tv-e-informatica')!
/**
 * Didactic piece built with the OFFICIAL campaign logo and the OFFICIAL Gazin logo (untouched
 * files). The Gazin logo is mandatory: it sits on the lower edge of the campaign logo without
 * covering its name. Texts, product and values are illustrative placeholders, never a real
 * offer. `fault` distorts it on screen only.
 */
function DemoPiece({ highlight, fault = null, ratio, compact = false }: { highlight?: Region | null; fault?: Fault; ratio?: string; compact?: boolean }) {
  const logo = logoOf(demoCampaign.id)!
  const lit = (region: Region) => highlight === region ? 'is-lit' : highlight ? 'is-dim' : ''
  return <div className={`cp-piece ${compact ? 'is-compact' : ''} ${fault ? `has-${fault}` : ''}`} style={{ '--ratio': ratio } as CSSProperties} aria-hidden="true">
    <span className={`cp-piece-lockup ${lit('identificacao')}`}>
      <img className="cp-piece-logo" src={`${base}${logo.preview}`} alt="" width={logo.previewWidth} height={logo.previewHeight} />
      <img className="cp-piece-gazin" src={`${base}${gazinLogo.src}`} alt="" width={gazinLogo.width} height={gazinLogo.height} />
    </span>
    <p className={`cp-piece-title ${lit('mensagem')}`}>Tecnologia em destaque na Gazin</p>
    <span className={`cp-piece-product ${lit('produto')}`}><Tv size={compact ? 26 : 54} strokeWidth={1.2} /><small>Imagem do produto</small></span>
    <p className={`cp-piece-price ${lit('comercial')}`}><small>à vista</small>R$ 0.000,00<small>ou 10x de R$ 000,00</small></p>
    <p className={`cp-piece-terms ${lit('complementar')}`}>Valores ilustrativos. Período e condições conforme a campanha.</p>
    <p className={`cp-piece-cta ${lit('marca')}`}>Compre nas lojas, site e app</p>
  </div>
}

function CreativeDemo() {
  const elements: { id: Region; label: string }[] = [
    { id: 'identificacao', label: 'Logos (campanha + Gazin)' }, { id: 'mensagem', label: 'Título' }, { id: 'produto', label: 'Produto' },
    { id: 'comercial', label: 'Informação comercial' }, { id: 'complementar', label: 'Elementos de apoio' }, { id: 'marca', label: 'Chamada para ação' },
  ]
  const [active, setActive] = useState<Region>('identificacao')
  return <div className="cp-creative">
    <div className="cp-creative-stage"><DemoPiece highlight={active} /></div>
    <div className="cp-creative-info">
      <div className="cp-chips" role="radiogroup" aria-label="Elementos da peça">
        {elements.map(item => <button key={item.id} type="button" role="radio" aria-checked={active === item.id} onClick={() => setActive(item.id)}>{item.label}</button>)}
      </div>
      <div className="cp-brand-rule">
        <img src={`${base}${gazinLogo.src}`} alt="Logo Gazin" width={gazinLogo.width} height={gazinLogo.height} loading="lazy" decoding="async" />
        <p><b>{creative.brandRule.title}</b>{creative.brandRule.text}</p>
      </div>
      <dl className="cp-principles">{creative.principles.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>)}</dl>
      <p className="cp-muted">{hierarchy.demoNote}</p>
    </div>
  </div>
}

function HierarchyDemo() {
  const [active, setActive] = useState(0)
  const level = hierarchy.levels[active]
  return <div className="cp-hierarchy">
    <div className="cp-hierarchy-stage"><DemoPiece highlight={level.id as Region} /></div>
    <div className="cp-hierarchy-info">
      <ol className="cp-levels">{hierarchy.levels.map((item, index) => <li key={item.id}>
        <button type="button" aria-pressed={active === index} aria-controls="cp-level-detail" onClick={() => setActive(index)}><b>{item.number}</b>{item.title}</button>
      </li>)}</ol>
      <p id="cp-level-detail" className="cp-level-detail" aria-live="polite" key={level.id}><b>{level.title}</b>{level.text}</p>
      <p className="cp-muted">{hierarchy.flexible}</p>
      <div className="cp-transparency"><p className="cp-kicker">Transparência comercial · evitar</p><ul>{hierarchy.transparency.map(item => <li key={item}>{item}</li>)}</ul></div>
    </div>
  </div>
}

/**
 * The piece is laid out at a fixed base size (like the real artwork) and scaled as a whole to
 * fit the stage, so every format keeps its proportions and nothing piles up. Landscape formats
 * use a side-by-side layout.
 */
function FormatPreview({ ratio }: { ratio: string }) {
  const [w, h] = ratio.split('/').map(Number)
  const BASE = 360, MAX_H = 380, MAX_W = 460
  const width = w >= h ? BASE * 1.6 : BASE, height = width * h / w
  const scale = Math.min(MAX_H / height, MAX_W / width, 1)
  return <div className="cp-format-box" style={{ width: width * scale, height: height * scale }}>
    <div className={`cp-format-piece ${w > h ? 'is-landscape' : ''}`} style={{ width, height, transform: `scale(${scale})` }}><DemoPiece ratio={ratio} /></div>
  </div>
}

function StandardizationDemo() {
  const [format, setFormat] = useState(standardization.formats[0].id)
  const [fault, setFault] = useState<Fault>('distorcida')
  const current = standardization.formats.find(item => item.id === format)!
  const error = standardization.errors.find(item => item.id === fault)!
  return <div className="cp-standard">
    <div className="cp-standard-formats">
      <p className="cp-kicker">Adaptação de formatos</p>
      <div className="cp-chips" role="radiogroup" aria-label="Formato">
        {standardization.formats.map(item => <button key={item.id} type="button" role="radio" aria-checked={format === item.id} onClick={() => setFormat(item.id)}>{item.label} <small>{item.text}</small></button>)}
      </div>
      <div className="cp-format-stage"><FormatPreview ratio={current.ratio} /></div>
      <p className="cp-muted">{standardization.formatsNote}</p>
    </div>
    <div className="cp-standard-errors">
      <p className="cp-kicker">Padronizada × incorreta</p>
      <div className="cp-chips" role="radiogroup" aria-label="Problema de aplicação">
        {standardization.errors.map(item => <button key={item.id} type="button" role="radio" aria-checked={fault === item.id} onClick={() => setFault(item.id as Fault)}>{item.label}</button>)}
      </div>
      <div className="cp-compare">
        <figure><div className="cp-compare-art"><DemoPiece ratio="4 / 5" compact /></div><figcaption><Check size={15} aria-hidden="true" /><b>Padronizada</b></figcaption></figure>
        <figure className="is-wrong"><div className="cp-compare-art"><DemoPiece ratio="4 / 5" compact fault={fault} /><span className="vi-wrong-stamp" aria-hidden="true">Não utilizar</span></div><figcaption><Ban size={15} aria-hidden="true" /><b>Incorreta</b><span aria-live="polite">{error.text}</span></figcaption></figure>
      </div>
    </div>
    <dl className="cp-principles cp-standard-rules">{standardization.rules.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>)}</dl>
  </div>
}

/** Chapter 05 · Campanhas: content from src/data/campaigns.ts. */
export function CampaignsBody({ chapter }: { chapter: Chapter }) {
  const [inst, promo, creativeSection, hierarchySection, standardSection] = chapter.subsections
  return <CampaignViewerProvider>
    <div className="chapter-body layout-mosaic layout-campaigns">
      <Card subsection={inst} text={institutional.text} className="is-institutional"><InstitutionalFeature /></Card>
      <Card subsection={promo} text={promotional.text} className="is-promotional"><PromotionalOverview /></Card>
      <SupplierCampaign />
      <Card subsection={creativeSection} text={creative.text} className="is-creative"><CreativeDemo /></Card>
      <Card subsection={hierarchySection} text={hierarchy.text} className="is-hierarchy"><HierarchyDemo /></Card>
      <Card subsection={standardSection} text={standardization.text} className="is-standard"><StandardizationDemo /></Card>
      <CalendarDownload />
      <CampaignLibrary />
    </div>
  </CampaignViewerProvider>
}
