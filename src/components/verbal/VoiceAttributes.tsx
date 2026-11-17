import { useState, type PointerEvent } from 'react'
import { MessageSquareQuote } from 'lucide-react'
import { verbalLabels, voice } from '../../data/verbalIdentity'

/**
 * 03.1 · the five voice attributes as an editorial word line. Selecting one (click, tap,
 * keyboard; hover previews with a mouse) highlights it and shows its meaning, the practice
 * and an example message; the other words stay discreet.
 */
export function VoiceAttributes() {
  const { attributes } = voice
  const [active, setActive] = useState(attributes[0].id)
  const current = attributes.find(attribute => attribute.id === active)!
  const preview = (id: string) => (event: PointerEvent) => { if (event.pointerType === 'mouse') setActive(id) }

  return <div className="vb-voice" data-vb-reveal>
    <div className="vb-voice-words" role="group" aria-label="Atributos do tom de voz">
      {attributes.map(attribute => <button key={attribute.id} type="button" className="vb-voice-word" aria-pressed={active === attribute.id} aria-controls="vb-voice-detail"
        onClick={() => setActive(attribute.id)} onPointerEnter={preview(attribute.id)} onFocus={() => setActive(attribute.id)}>
        <span className="vb-voice-number" aria-hidden="true">{attribute.number}</span>
        <span className="vb-voice-name">{attribute.name}</span>
      </button>)}
    </div>
    <div id="vb-voice-detail" className="vb-voice-detail" aria-live="polite">
      <div className="vb-voice-body" key={current.id}>
        <p className="vb-kicker">{voice.hint} · {current.number}/05</p>
        <p className="vb-voice-description">{current.description}</p>
        <p className="vb-voice-practice"><b>Na prática</b>{current.practice}</p>
        <figure className="vb-voice-example">
          <figcaption><MessageSquareQuote size={15} aria-hidden="true" />{verbalLabels.example}</figcaption>
          <blockquote><p>{current.example}</p></blockquote>
        </figure>
      </div>
    </div>
  </div>
}
