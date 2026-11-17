import { lazy, Suspense, useState, type ReactNode } from 'react'
import { ArrowUpRight, Ban, Check, CreditCard, Headset, House, Landmark, ShieldCheck, ShoppingBag, Sprout, Store, Truck, type LucideIcon } from 'lucide-react'
import type { Subsection } from '../../../data/brandChapters'
import { colorNote, consistency, iconColors, iconographyIntro, iconStyle, lucide, sizeNote, sizeScale, spacing, strokeNote, strokes, usage } from '../../../data/iconography'
import { IdentitySection } from '../shared'
import '../../../styles/iconography.css'

const base = import.meta.env.BASE_URL
// The library (≈150 icons + export tools) is a separate chunk, loaded when the section renders.
const IconLibrary = lazy(() => import('./IconLibrary'))

/** Quiet composition for the opening: a few real icons on the grid, evenly spaced. */
const showcase: LucideIcon[] = [Store, ShoppingBag, House, ShieldCheck, Landmark, Truck, Headset, Sprout]

function Block({ number, title, children, wide = false, full = false }: { number: string; title: string; children: ReactNode; wide?: boolean; full?: boolean }) {
  return <article className={`ic-block ${wide ? "is-wide" : ""} ${full ? "is-full" : ""}`} data-vi-reveal>
    <p className="ic-block-number">{number}</p>
    <h4>{title}</h4>
    {children}
  </article>
}

/** Educational guidelines (style, stroke, sizes, spacing, consistency, colours). */
function IconGuidelines() {
  return <div className="ic-guidelines">
    <Block number="01" title="Estilo outline">
      <div className="ic-sample" aria-hidden="true">{[Store, Truck, ShieldCheck, CreditCard].map((Icon, index) => <Icon key={index} size={30} strokeWidth={2} />)}</div>
      <ul className="ic-list is-do">{iconStyle.traits.map(item => <li key={item}><Check size={13} aria-hidden="true" />{item}</li>)}</ul>
      <ul className="ic-list is-dont">{iconStyle.avoid.map(item => <li key={item}><Ban size={13} aria-hidden="true" />{item}</li>)}</ul>
    </Block>
    <Block number="02" title="Espessura do traço">
      <div className="ic-strokes">{strokes.map(item => <figure key={item.value}>
        <House size={48} strokeWidth={item.value} aria-hidden="true" />
        <figcaption><b>{String(item.value.toFixed(1)).replace('.', ',')}</b>{item.label}</figcaption>
      </figure>)}</div>
      <p className="ic-text">{strokeNote}</p>
    </Block>
    <Block number="03" title="Escala de tamanhos" wide>
      <div className="ic-sizes">{sizeScale.map(item => <figure key={item.px}>
        <span><Truck size={item.px} strokeWidth={2} aria-hidden="true" /></span>
        <figcaption><b>{item.px} px</b>{item.use}</figcaption>
      </figure>)}</div>
      <p className="ic-text">{sizeNote}</p>
    </Block>
    <Block number="04" title="Espaçamento">
      <div className="ic-spacing" aria-hidden="true">
        <span className="ic-spacing-icon"><Headset size={32} strokeWidth={2} /></span>
        <span className="ic-spacing-text">Central de atendimento</span>
      </div>
      <p className="ic-text">{spacing}</p>
    </Block>
    <Block number="05" title="Consistência">
      <ul className="ic-list is-do">{consistency.map(item => <li key={item}><Check size={13} aria-hidden="true" />{item}</li>)}</ul>
      <p className="ic-text">Em uma mesma peça, não misture estilos no mesmo grupo de ícones.</p>
    </Block>
    <Block number="06" title="Cores dos ícones" full>
      <ul className="ic-colors">{iconColors.map(item => <li key={item.id}>
        <span className={`ic-color-tile ${item.hex === '#FFFFFF' ? 'is-on-blue' : ''}`}><ShieldCheck size={30} strokeWidth={2} color={item.hex} aria-hidden="true" /></span>
        <b>{item.name}</b><code>{item.hex}</code><small>{item.role}</small>
      </li>)}</ul>
      <p className="ic-text">{colorNote}</p>
    </Block>
  </div>
}

/** Correct × incorrect, with real icons (the wrong version exists on screen only). */
function IconUsageComparison() {
  const [mode, setMode] = useState<'correto' | 'incorreto'>('correto')
  const wrong = mode === 'incorreto'
  return <div className="ic-compare">
    <div className="ic-compare-head">
      <h4>Uso correto e incorreto</h4>
      <div className="ic-choice" role="radiogroup" aria-label="Comparar uso dos ícones">
        {(['correto', 'incorreto'] as const).map(id => <button key={id} type="button" role="radio" aria-checked={mode === id} tabIndex={mode === id ? 0 : -1} onClick={() => setMode(id)}
          onKeyDown={event => { if (['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); const next = id === 'correto' ? 'incorreto' : 'correto'; setMode(next); (event.currentTarget.parentElement!.querySelector(`[data-mode="${next}"]`) as HTMLElement).focus() } }}
          data-mode={id}>{id === 'correto' ? <><Check size={14} aria-hidden="true" />Correto</> : <><Ban size={14} aria-hidden="true" />Incorreto</>}</button>)}
      </div>
    </div>
    <div className={`ic-compare-stage ${wrong ? 'is-wrong' : 'is-right'}`} role="img" aria-label={wrong ? `Uso incorreto: ${usage.wrong.join(', ')}.` : `Uso correto: ${usage.correct.join(', ')}.`}>
      <Store size={44} strokeWidth={wrong ? 2 : 2} className="ic-c1" aria-hidden="true" />
      <Truck size={44} strokeWidth={2} className="ic-c2" aria-hidden="true" />
      <ShieldCheck size={44} strokeWidth={wrong ? 3.6 : 2} className="ic-c3" aria-hidden="true" />
      <CreditCard size={44} strokeWidth={wrong ? 1 : 2} className="ic-c4" aria-hidden="true" />
      <House size={44} strokeWidth={2} className="ic-c5" aria-hidden="true" />
      {wrong && <span className="vi-wrong-stamp" aria-hidden="true">Não utilizar</span>}
    </div>
    <ul className={`ic-list ${wrong ? 'is-dont' : 'is-do'}`} aria-live="polite">{(wrong ? usage.wrong : usage.correct).map(item => <li key={item}>{wrong ? <Ban size={13} aria-hidden="true" /> : <Check size={13} aria-hidden="true" />}{item}</li>)}</ul>
    <p className="ic-text">{usage.note}</p>
  </div>
}

/** 02.9 · Iconografia — Padrões e Biblioteca de Ícones (data: src/data/iconography.ts). */
export function IconographySection({ subsection }: { subsection: Subsection }) {
  return <IdentitySection subsection={subsection} className="ic-section"
    lead={<>
      <p className="ic-lead-title">{iconographyIntro.subtitle}</p>
      <p className="ic-tagline">{iconographyIntro.tagline}</p>
      <p>{iconographyIntro.text}</p>
    </>}>
    <div className="ic-showcase" aria-hidden="true">{showcase.map((Icon, index) => <span key={index}><Icon size={30} strokeWidth={1.75} /></span>)}</div>
    <IconGuidelines />
    <IconUsageComparison />
    <Suspense fallback={<p className="ic-loading" role="status">Carregando a biblioteca de ícones…</p>}><IconLibrary /></Suspense>
    <p className="ic-credit">{iconographyIntro.credit} Versão {lucide.version}, licença ISC: <a href={`${base}${lucide.licenseFile}`} target="_blank" rel="noopener">ver licença<ArrowUpRight size={13} aria-hidden="true" /></a> · <a href={lucide.site} target="_blank" rel="noopener">lucide.dev<ArrowUpRight size={13} aria-hidden="true" /></a></p>
  </IdentitySection>
}
