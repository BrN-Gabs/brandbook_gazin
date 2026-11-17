import { useState, type KeyboardEvent } from 'react'
import { Check, X } from 'lucide-react'
import { language } from '../../data/verbalIdentity'

type Mode = 'avoid' | 'prefer'
const modes: { id: Mode; label: string }[] = [{ id: 'avoid', label: 'Evitar' }, { id: 'prefer', label: 'Preferir' }]

/** Label + icon + colour: the recommendation never depends on colour alone. */
function ModeMark({ mode }: { mode: Mode }) {
  return <span className={`vb-mark is-${mode}`}>{mode === 'prefer' ? <Check size={14} strokeWidth={2.4} aria-hidden="true" /> : <X size={14} strokeWidth={2.4} aria-hidden="true" />}{mode === 'prefer' ? 'Preferir' : 'Evitar'}</span>
}

/**
 * 03.2 · "Preferimos / Evitamos" guidelines and a before/after comparator: pick a situation,
 * then switch between EVITAR and PREFERIR (keyboard: arrows inside each group).
 */
export function LanguageComparison() {
  const [example, setExample] = useState(language.examples[0].id)
  const [mode, setMode] = useState<Mode>('avoid')
  const current = language.examples.find(item => item.id === example)!
  const roving = (list: string[], value: string, set: (next: string) => void) => (event: KeyboardEvent) => {
    const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0
    if (!step) return
    event.preventDefault()
    const next = list[(list.indexOf(value) + step + list.length) % list.length]
    set(next)
    ;(event.currentTarget.querySelector(`[data-value="${next}"]`) as HTMLElement | null)?.focus()
  }

  return <div className="vb-language">
    <div className="vb-rules" data-vb-reveal>
      <section className="vb-rule is-prefer" aria-labelledby="vb-prefer-title">
        <h4 id="vb-prefer-title"><ModeMark mode="prefer" /><span>Preferimos</span></h4>
        <ul>{language.prefer.map(item => <li key={item}><Check size={15} aria-hidden="true" />{item}</li>)}</ul>
      </section>
      <section className="vb-rule is-avoid" aria-labelledby="vb-avoid-title">
        <h4 id="vb-avoid-title"><ModeMark mode="avoid" /><span>Evitamos</span></h4>
        <ul>{language.avoid.map(item => <li key={item}><X size={15} aria-hidden="true" />{item}</li>)}</ul>
      </section>
    </div>

    <div className="vb-compare" data-vb-reveal>
      <div className="vb-compare-tabs" role="radiogroup" aria-label="Situação de comunicação" onKeyDown={roving(language.examples.map(item => item.id), example, setExample)}>
        {language.examples.map((item, index) => <button key={item.id} type="button" role="radio" data-value={item.id} aria-checked={example === item.id} tabIndex={example === item.id ? 0 : -1} onClick={() => setExample(item.id)}>
          <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{item.label}
        </button>)}
      </div>
      <div className="vb-compare-stage">
        <div className="vb-toggle" role="radiogroup" aria-label="Versão da mensagem" data-mode={mode} onKeyDown={roving(modes.map(item => item.id), mode, value => setMode(value as Mode))}>
          <span className="vb-toggle-thumb" aria-hidden="true" />
          {modes.map(item => <button key={item.id} type="button" role="radio" data-value={item.id} aria-checked={mode === item.id} tabIndex={mode === item.id ? 0 : -1} onClick={() => setMode(item.id)}>
            {item.id === 'prefer' ? <Check size={14} strokeWidth={2.4} aria-hidden="true" /> : <X size={14} strokeWidth={2.4} aria-hidden="true" />}{item.label}
          </button>)}
        </div>
        <figure className={`vb-compare-card is-${mode}`} aria-live="polite" key={`${example}-${mode}`}>
          <figcaption><ModeMark mode={mode} /><span>{current.label}</span></figcaption>
          <blockquote><p>“{mode === 'prefer' ? current.prefer : current.avoid}”</p></blockquote>
        </figure>
      </div>
    </div>
  </div>
}
