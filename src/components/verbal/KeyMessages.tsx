import { useState, type CSSProperties, type PointerEvent } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { keyMessages, verbalLabels } from '../../data/verbalIdentity'

/**
 * 03.4 · six concept words on one fine connected line. Selecting a word reveals its
 * message axis and the suggested editorial phrase; arrows step through the concepts.
 */
export function KeyMessages() {
  const { messages } = keyMessages
  const [active, setActive] = useState(0)
  const current = messages[active]
  const preview = (index: number) => (event: PointerEvent) => { if (event.pointerType === 'mouse') setActive(index) }

  return <div className="vb-messages" style={{ '--progress': active / (messages.length - 1) } as CSSProperties}>
    <div className="vb-messages-line" data-vb-reveal>
      <span className="vb-messages-track" aria-hidden="true"><span /></span>
      <div className="vb-messages-words" role="group" aria-label="Conceitos das mensagens-chave">
        {messages.map((message, index) => <button key={message.id} type="button" className="vb-message-word" aria-pressed={active === index} aria-controls="vb-message-detail"
          onClick={() => setActive(index)} onPointerEnter={preview(index)} onFocus={() => setActive(index)}>
          <span className="vb-message-node" aria-hidden="true" />
          <span className="vb-message-label">{message.word}</span>
        </button>)}
      </div>
    </div>
    <div id="vb-message-detail" className="vb-message-detail" aria-live="polite">
      <div className="vb-message-axis" key={`axis-${current.id}`}>
        <p className="vb-kicker">Eixo {current.number}</p>
        <p className="vb-message-title">{current.axis}</p>
        <p>{current.description}</p>
      </div>
      <figure className="vb-message-phrase" key={`phrase-${current.id}`}>
        <blockquote><p>“{current.phrase}”</p></blockquote>
        <figcaption>{verbalLabels.editorialMessage}</figcaption>
      </figure>
      <div className="vb-message-nav">
        <button type="button" onClick={() => setActive((active - 1 + messages.length) % messages.length)} aria-label="Conceito anterior"><ArrowLeft size={16} aria-hidden="true" /></button>
        <span>{current.number} / {String(messages.length).padStart(2, '0')}</span>
        <button type="button" onClick={() => setActive((active + 1) % messages.length)} aria-label="Próximo conceito"><ArrowRight size={16} aria-hidden="true" /></button>
      </div>
    </div>
  </div>
}
