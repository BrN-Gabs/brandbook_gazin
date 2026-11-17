import { useState, type KeyboardEvent } from 'react'
import { Bookmark, Building2, CalendarHeart, Headset, Heart, ImageIcon, Info, MessageCircle, Send, ShoppingCart, Store, UsersRound } from 'lucide-react'
import { applications, verbalLabels, type ApplicationExample } from '../../data/verbalIdentity'

/**
 * Simple, neutral mockups of each format. No third-party logos or platform interfaces:
 * generic shapes in the Gazin blues, the name "Gazin" as text, never the logo redrawn.
 */
function Mockup({ example }: { example: ApplicationExample }) {
  const { message, format } = example
  switch (format) {
    case 'social': return <div className="vb-mock vb-mock-social">
      <div className="vb-mock-head"><span className="vb-mock-avatar"><Store size={16} aria-hidden="true" /></span><b>Gazin</b><small>Publicação</small></div>
      <div className="vb-mock-media"><ImageIcon size={28} aria-hidden="true" /><span>Imagem da campanha</span></div>
      <div className="vb-mock-actions" aria-hidden="true"><Heart size={18} /><MessageCircle size={18} /><Send size={18} /><Bookmark size={18} /></div>
      <p><b>Gazin</b> {message}</p>
    </div>
    case 'institutional': return <div className="vb-mock vb-mock-letter">
      <div className="vb-mock-letterhead"><Building2 size={16} aria-hidden="true" /><span>Comunicado institucional</span></div>
      <p className="vb-mock-letter-title">Nossa trajetória</p>
      <p>{message}</p>
      <p className="vb-mock-sign">Gazin</p>
    </div>
    case 'internal': return <div className="vb-mock vb-mock-internal">
      <div className="vb-mock-head"><span className="vb-mock-avatar"><UsersRound size={16} aria-hidden="true" /></span><b>Comunicação interna</b><small>Para todos os colaboradores</small></div>
      <p className="vb-mock-internal-title">Obrigado por fazer parte</p>
      <p>{message}</p>
    </div>
    case 'support': return <div className="vb-mock vb-mock-chat">
      <div className="vb-mock-head"><span className="vb-mock-avatar"><Headset size={16} aria-hidden="true" /></span><b>Atendimento Gazin</b><small>Conversa demonstrativa</small></div>
      <p className="vb-bubble is-client">Oi, preciso de ajuda.</p>
      <p className="vb-bubble is-brand">{message}</p>
    </div>
    case 'ecommerce': return <div className="vb-mock vb-mock-product">
      <div className="vb-mock-media"><ImageIcon size={28} aria-hidden="true" /><span>Foto do produto</span></div>
      <div className="vb-mock-product-info">
        <p className="vb-mock-product-title">Nome do produto</p>
        <p>{message}</p>
        <ul aria-label="Especificações (exemplo)"><li><Info size={13} aria-hidden="true" />Especificações técnicas</li><li><Info size={13} aria-hidden="true" />Condições de pagamento</li></ul>
        <span className="vb-mock-button"><ShoppingCart size={14} aria-hidden="true" />Ver detalhes</span>
      </div>
    </div>
    case 'relationship': return <div className="vb-mock vb-mock-banner">
      <CalendarHeart size={26} aria-hidden="true" />
      <p className="vb-mock-banner-title">Dia do Cliente</p>
      <p>{message}</p>
    </div>
  }
}

/** 03.5 · gallery of applied examples: channel tabs, context, message, guideline and mockup. */
export function ApplicationExamples() {
  const { examples } = applications
  const [active, setActive] = useState(examples[0].id)
  const index = examples.findIndex(example => example.id === active)
  const current = examples[index]
  const onKeyDown = (event: KeyboardEvent) => {
    const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0
    if (!step) return
    event.preventDefault()
    // Move from the focused tab (not the selected one), as in standard tab lists.
    const focused = examples.findIndex(example => `vb-app-tab-${example.id}` === (event.target as HTMLElement).id)
    const from = focused >= 0 ? focused : index
    const next = examples[(from + step + examples.length) % examples.length]
    setActive(next.id)
    document.getElementById(`vb-app-tab-${next.id}`)?.focus()
  }

  return <div className="vb-apps" data-vb-reveal>
    <div className="vb-apps-tabs" role="tablist" aria-label="Exemplos de aplicação por canal" onKeyDown={onKeyDown}>
      {examples.map(example => <button key={example.id} id={`vb-app-tab-${example.id}`} type="button" role="tab" aria-selected={active === example.id} aria-controls="vb-app-panel" tabIndex={active === example.id ? 0 : -1} onClick={() => setActive(example.id)}>
        <span aria-hidden="true">{example.number}</span>{example.channel}
      </button>)}
    </div>
    <div id="vb-app-panel" className="vb-apps-panel" role="tabpanel" aria-labelledby={`vb-app-tab-${current.id}`} key={current.id}>
      <div className="vb-apps-copy">
        <p className="vb-kicker">Exemplo {current.number} · {current.channel}</p>
        <dl>
          <div><dt>Contexto</dt><dd>{current.context}</dd></div>
          <div><dt>Mensagem</dt><dd className="vb-apps-message">“{current.message}”</dd></div>
          <div><dt>Diretriz do tom de voz</dt><dd>{current.guideline}</dd></div>
        </dl>
        <p className="vb-demo-note">{verbalLabels.demonstration}</p>
      </div>
      <div className="vb-apps-mock" aria-hidden="true"><Mockup example={current} /></div>
    </div>
  </div>
}
