import { useState, type CSSProperties, type PointerEvent } from 'react'
import { ArrowUpRight, Check, RotateCcw } from 'lucide-react'
import { digitalAssets, motion } from '../../data/digitalCommunication'
import { base, Segmented } from './DigitalShared'

type DemoId = 'texto' | 'elementos' | 'interacao'

/** 01: the official slogan revealed word by word (CSS only, plays once, ends still). */
function TextReveal() {
  return <p className="dg-mo-text" aria-label={motion.revealText}>
    {motion.revealText.split(' ').map((word, index) => <span key={index} aria-hidden="true" style={{ '--i': index } as CSSProperties}>{word} </span>)}
  </p>
}

/** 02: blue lines and shapes assemble into a composition that ends on the official logo. */
function Composition() {
  return <div className="dg-mo-compose" aria-hidden="true">
    <svg viewBox="0 0 320 180">
      {Array.from({ length: 6 }, (_, index) => <line key={index} className="dg-mo-line" x1={20} y1={30 + index * 24} x2={300} y2={30 + index * 24} style={{ '--i': index } as CSSProperties} />)}
      <circle className="dg-mo-shape is-a" cx="70" cy="90" r="34" />
      <rect className="dg-mo-shape is-b" x="210" y="56" width="68" height="68" rx="14" />
      <path className="dg-mo-shape is-c" d="M140 140 L170 40 L200 140 Z" />
    </svg>
    <img className="dg-mo-logo" src={`${base}${digitalAssets.logo.src}`} width={digitalAssets.logo.width} height={digitalAssets.logo.height} alt="" />
  </div>
}

const cards = ['Identidade', 'Clareza', 'Movimento']
/** 03: cards that answer to pointer (light follows), keyboard (focus) and touch/click (select). */
function Interaction() {
  const [selected, setSelected] = useState<string[]>(['Identidade'])
  const toggle = (card: string) => setSelected(list => list.includes(card) ? list.filter(item => item !== card) : [...list, card])
  const follow = (event: PointerEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--x', `${((event.clientX - rect.left) / rect.width) * 100}%`)
    event.currentTarget.style.setProperty('--y', `${((event.clientY - rect.top) / rect.height) * 100}%`)
  }
  return <div className="dg-mo-cards" role="group" aria-label="Cards interativos">
    {cards.map(card => <button key={card} type="button" aria-pressed={selected.includes(card)} onPointerMove={follow} onClick={() => toggle(card)}>
      <span className="dg-mo-check" aria-hidden="true"><Check size={14} /></span>
      <b>{card}</b><small>{selected.includes(card) ? 'Selecionado' : 'Toque ou clique'}</small>
    </button>)}
  </div>
}

/** 06.5: three light demonstrations in the former video slot (no empty player). */
export function MotionDesignExamples() {
  const [demo, setDemo] = useState<DemoId>('texto')
  const [run, setRun] = useState(0)
  const current = motion.demos.find(item => item.id === demo)!
  return <div className="dg-motion">
    <Segmented label="Demonstração de movimento" value={demo} onChange={id => { setDemo(id); setRun(value => value + 1) }} options={motion.demos.map(item => ({ id: item.id as DemoId, label: <><small>{item.number}</small>{item.label}</> }))} />
    <div className={`dg-motion-stage is-${demo}`} key={`${demo}-${run}`}>
      {demo === 'texto' && <TextReveal />}
      {demo === 'elementos' && <Composition />}
      {demo === 'interacao' && <Interaction />}
    </div>
    <div className="dg-motion-bar">
      <p className="dg-note" aria-live="polite">{current.note}</p>
      {demo !== 'interacao' && <button type="button" className="dg-replay" onClick={() => setRun(value => value + 1)}><RotateCcw size={14} aria-hidden="true" />Reproduzir de novo</button>}
    </div>
    <p className="dg-reduced">{motion.reduced}</p>
    <dl className="dg-applications">{motion.applications.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>)}</dl>
    <p className="dg-dna"><span>{motion.dna.text}</span><a href={motion.dna.href}>{motion.dna.label}<ArrowUpRight size={14} aria-hidden="true" /></a></p>
  </div>
}
