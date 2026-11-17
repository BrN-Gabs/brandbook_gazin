import { useState, type CSSProperties, type KeyboardEvent } from 'react'
import { ArrowLeft, ArrowRight, Ban, Check, ClipboardCheck, Download, FileText, Inbox, PenTool, Send, Stamp, type LucideIcon } from 'lucide-react'
import { documents, maintenance, misuse, responsibilities, sourceLabels, usage, workflow, type Rule } from '../../data/governance'
import { misuses } from '../../data/visualIdentity'
import { CorrectArt, WrongArt } from '../identity/IncorrectUsageGallery'

const base = import.meta.env.BASE_URL

export function SourceTag({ documented }: { documented: boolean }) {
  return <span className={`gv-tag ${documented ? 'is-documented' : 'is-proposed'}`}>{documented ? sourceLabels.documented : sourceLabels.proposed}</span>
}
function Rules({ items }: { items: Rule[] }) {
  return <dl className="gv-rules">{items.map(rule => <div key={rule.title}>
    <dt>{rule.title}</dt><dd>{rule.text}{rule.source && <span className="gv-source">{rule.source}</span>}</dd>
  </div>)}</dl>
}
/** Arrow keys inside a group of buttons (roving selection). */
const arrows = (count: number, index: number, set: (next: number) => void) => (event: KeyboardEvent) => {
  const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0
  if (!step) return
  event.preventDefault()
  // Move from the focused item (it may differ from the selected one), as in standard groups.
  const focused = Number((event.target as HTMLElement).closest<HTMLElement>('[data-index]')?.dataset.index ?? index)
  const next = (focused + step + count) % count
  set(next)
  ;(event.currentTarget.querySelectorAll<HTMLElement>('[data-index]')[next])?.focus()
}

// ── 10.1 ───────────────────────────────────────────────────────────────────────────────
/** Five groups around a central concept (not an org chart): select one to see its duties. */
export function GovernanceResponsibilities() {
  const { roles } = responsibilities
  const [active, setActive] = useState(0)
  const role = roles[active]
  return <div className="gv-roles">
    <div className="gv-hub" role="radiogroup" aria-label="Grupos de responsabilidade" onKeyDown={arrows(roles.length, active, setActive)}>
      <svg className="gv-hub-lines" viewBox="0 0 100 100" aria-hidden="true">
        {roles.map((item, index) => {
          const angle = -90 + index * 72, x = 50 + Math.cos(angle * Math.PI / 180) * 38, y = 50 + Math.sin(angle * Math.PI / 180) * 38
          return <line key={item.id} x1="50" y1="50" x2={x} y2={y} className={active === index ? 'is-lit' : ''} />
        })}
      </svg>
      <span className="gv-hub-center">{responsibilities.center}</span>
      {roles.map((item, index) => {
        const angle = -90 + index * 72
        return <button key={item.id} type="button" role="radio" data-index={index} aria-checked={active === index} tabIndex={active === index ? 0 : -1}
          className="gv-hub-node" style={{ '--x': `${50 + Math.cos(angle * Math.PI / 180) * 38}%`, '--y': `${50 + Math.sin(angle * Math.PI / 180) * 38}%` } as CSSProperties}
          onClick={() => setActive(index)}>
          <b>{item.number}</b><span>{item.name}</span>
        </button>
      })}
    </div>
    <div className="gv-roles-detail" aria-live="polite">
      <p className="gv-kicker">{role.number} · Responsabilidades de referência</p>
      <p className="gv-detail-title" key={role.id}>{role.name}</p>
      <ul className="gv-list">{role.duties.map(duty => <li key={duty}>{duty}</li>)}</ul>
      <p className="gv-note"><SourceTag documented={false} />{responsibilities.note}</p>
    </div>
  </div>
}

// ── 10.2 ───────────────────────────────────────────────────────────────────────────────
const stepIcons: Record<string, LucideIcon> = { inbox: Inbox, pen: PenTool, checklist: ClipboardCheck, stamp: Stamp, send: Send }
/** Educational flow: select a step, go back and forth; validation branches (yes/no). */
export function ApprovalWorkflow() {
  const { steps, decision } = workflow
  const [active, setActive] = useState(0)
  const step = steps[active]
  return <div className="gv-flow" style={{ '--progress': active / (steps.length - 1) } as CSSProperties}>
    <div className="gv-flow-rail">
    <span className="gv-flow-track" aria-hidden="true"><span /></span>
    <ol className="gv-flow-steps" aria-label="Etapas do fluxo de referência" onKeyDown={arrows(steps.length, active, setActive)}>
      {steps.map((item, index) => {
        const Icon = stepIcons[item.icon]
        return <li key={item.id} className={`${index === active ? 'is-active' : ''} ${index < active ? 'is-done' : ''}`}>
          <button type="button" data-index={index} aria-current={index === active ? 'step' : undefined} tabIndex={index === active ? 0 : -1} onClick={() => setActive(index)}>
            <span className="gv-flow-icon" aria-hidden="true"><Icon size={18} /></span>
            <span className="gv-flow-number">{item.number}</span>
            <span className="gv-flow-name">{item.name}</span>
          </button>
          {item.id === 'validacao' && <span className="gv-flow-branch" aria-hidden="true">{decision.question}</span>}
        </li>
      })}
    </ol>
    </div>
    <div className="gv-flow-detail" aria-live="polite">
      <div key={step.id} className="gv-flow-body">
        <p className="gv-kicker">Etapa {step.number} de {String(steps.length).padStart(2, '0')}</p>
        <p className="gv-detail-title">{step.name}</p>
        <p>{step.text}</p>
        {step.items && <ul className="gv-pills">{step.items.map(item => <li key={item}>{item}</li>)}</ul>}
        {step.id === 'validacao' && <div className="gv-decision">
          <p className="gv-decision-question">{decision.question}</p>
          <p className="is-yes"><Check size={15} aria-hidden="true" />{decision.yes}</p>
          <p className="is-no"><ArrowLeft size={15} aria-hidden="true" />{decision.no}</p>
        </div>}
      </div>
      <div className="gv-flow-nav">
        <button type="button" onClick={() => setActive(active - 1)} disabled={active === 0}><ArrowLeft size={15} aria-hidden="true" />Etapa anterior</button>
        <button type="button" onClick={() => setActive(active + 1)} disabled={active === steps.length - 1}>Próxima etapa<ArrowRight size={15} aria-hidden="true" /></button>
      </div>
      <p className="gv-note"><SourceTag documented={false} />{workflow.note}</p>
    </div>
  </div>
}

// ── 10.3 ───────────────────────────────────────────────────────────────────────────────
/** Three orientation groups with the essential rules and links to the full chapters. */
export function BrandUsageGuidelines() {
  return <div className="gv-usage">
    {usage.groups.map(group => <section key={group.id} className="gv-usage-group" aria-labelledby={`gv-usage-${group.id}`}>
      <p id={`gv-usage-${group.id}`} className="gv-detail-title">{group.title}</p>
      <p className="gv-lead">{group.lead}</p>
      <Rules items={group.rules} />
      <p className="gv-links">{group.links.map(link => <a key={link.href} href={link.href}>Consultar {link.label}<ArrowRight size={14} aria-hidden="true" /></a>)}</p>
    </section>)}
  </div>
}

// ── 10.4 ───────────────────────────────────────────────────────────────────────────────
/** Correct / incorrect comparator reusing the documented demos of chapter 02 (same file). */
export function BrandUsageComparison() {
  const [active, setActive] = useState(0)
  const [applied, setApplied] = useState(true)
  const item = misuses.find(entry => entry.id === misuse.comparisons[active].id)!
  const choose = (index: number) => {
    setActive(index)
    // Each case starts correct and morphs into the error.
    setApplied(false)
    requestAnimationFrame(() => requestAnimationFrame(() => setApplied(true)))
  }
  return <div className="gv-misuse">
    <div className="gv-segmented" role="radiogroup" aria-label="Tipo de aplicação" onKeyDown={arrows(misuse.comparisons.length, active, choose)}>
      {misuse.comparisons.map((entry, index) => <button key={entry.id} type="button" role="radio" data-index={index} aria-checked={active === index} tabIndex={active === index ? 0 : -1} onClick={() => choose(index)}>{entry.label}</button>)}
    </div>
    <div className="vi-compare gv-compare" aria-live="polite">
      <figure className="vi-compare-item is-right">
        <div className="vi-compare-art"><CorrectArt id={item.id} /></div>
        <figcaption><Check size={15} aria-hidden="true" /><b>Correto</b><span>{item.correct}</span></figcaption>
      </figure>
      <figure className={`vi-compare-item is-wrong ${applied ? 'is-applied' : ''}`}>
        <div className="vi-compare-art" role="img" aria-label={`Exemplo incorreto, não utilizar: ${item.error}`}>
          <WrongArt id={item.id} />
          <svg className="vi-wrong-mark" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><line x1="4" y1="96" x2="96" y2="4" /></svg>
          <span className="vi-wrong-stamp" aria-hidden="true">Não utilizar</span>
        </div>
        <figcaption><Ban size={15} aria-hidden="true" /><b>Incorreto</b><span>{item.error}</span></figcaption>
      </figure>
    </div>
    <p className="gv-note"><SourceTag documented />{misuse.note}</p>
    <Rules items={misuse.rules} />
  </div>
}

// ── 10.5 ───────────────────────────────────────────────────────────────────────────────
/** Principles, document control (only documented data) and an empty, ready history. */
export function BrandManualMaintenance() {
  return <div className="gv-maintenance">
    <Rules items={maintenance.principles} />
    <div className="gv-records">
      <p className="gv-kicker">Controle documental</p>
      <div className="gv-table-wrap"><table>
        <thead><tr><th scope="col">Documento</th><th scope="col">Referência</th><th scope="col">Status</th></tr></thead>
        <tbody>{maintenance.records.map(record => <tr key={record.document}><th scope="row">{record.document}</th><td>{record.reference}</td><td>{record.status}</td></tr>)}</tbody>
      </table></div>
      <p className="gv-kicker">Histórico de atualizações</p>
      {maintenance.history.length
        ? <div className="gv-table-wrap"><table>
          <thead><tr>{maintenance.historyColumns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead>
          <tbody>{maintenance.history.map(entry => <tr key={`${entry.date}-${entry.document}`}><td>{entry.date}</td><td>{entry.document}</td><td>{entry.version}</td><td>{entry.description}</td><td>{entry.owner}</td><td>{entry.status}</td></tr>)}</tbody>
        </table></div>
        : <div className="gv-empty">
          <p>{maintenance.emptyHistory}</p>
          <p className="gv-empty-columns" aria-label="Campos previstos">{maintenance.historyColumns.map(column => <span key={column}>{column}</span>)}</p>
        </div>}
      <p className="gv-note"><SourceTag documented={false} />Princípios de manutenção propostos para validação.</p>
    </div>
  </div>
}

/** Documents library: real files only, plain download links. */
export function BrandDocumentsLibrary() {
  return <section className="gv-docs" aria-labelledby="gv-docs-title" data-gv-reveal>
    <header>
      <p className="gv-kicker"><FileText size={14} aria-hidden="true" />Centro de documentos</p>
      <h3 id="gv-docs-title">{documents.title}</h3>
      <p>{documents.description}</p>
    </header>
    <ul className="gv-docs-list">
      {documents.items.map(doc => <li key={doc.id}>
        <span className="gv-doc-icon" aria-hidden="true"><FileText size={26} strokeWidth={1.4} /><b>PDF</b></span>
        <div className="gv-doc-body">
          <p className="gv-doc-name">{doc.name}</p>
          <p className="gv-doc-description">{doc.description}</p>
          <p className="gv-doc-topics">{doc.topics.map(topic => <span key={topic}>{topic}</span>)}</p>
          <p className="gv-doc-meta">PDF · {doc.pages} páginas · {doc.sizeMB.toLocaleString('pt-BR')} MB{doc.edition ? ` · Edição ${doc.edition}` : ''}</p>
        </div>
        <a className="gv-doc-download" href={`${base}${doc.href}`} download={doc.fileName} type="application/pdf" aria-label={`Baixar ${doc.name} (PDF)`}>
          <Download size={17} aria-hidden="true" />Baixar
        </a>
      </li>)}
    </ul>
  </section>
}
