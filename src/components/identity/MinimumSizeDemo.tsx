import { useState } from 'react'
import { AlertTriangle, Check, Shirt } from 'lucide-react'
import type { Subsection } from '../../data/brandChapters'
import { embroideryDiagramNote, minimumSizes } from '../../data/visualIdentity'
import { IdentitySection, OfficialLogo } from './shared'

const [print, embroidery] = minimumSizes
const MIN = 1, MAX = 7
const format = (value: number) => value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

function verdict(width: number) {
  if (width < print.width) return { level: 'low', icon: AlertTriangle, title: 'Uso indevido', text: `Abaixo do mínimo de ${print.width} × ${print.height} cm: a leitura e a identificação ficam comprometidas.` }
  if (width < embroidery.width) return { level: 'mid', icon: Check, title: 'Adequado para impressão', text: `Para bordado, o mínimo é ${embroidery.width} × ${embroidery.height} cm: neste tamanho, aplique em silkscreen.` }
  return { level: 'ok', icon: Check, title: 'Adequado, inclusive para bordado', text: 'Todos os caracteres permanecem legíveis no bordado, sempre na cor original.' }
}

export function MinimumSizeDemo({ subsection }: { subsection: Subsection }) {
  const [width, setWidth] = useState(3)
  const result = verdict(width)
  const ticks = Array.from({ length: MAX + 1 }, (_, index) => index)
  return <IdentitySection subsection={subsection} className="vi-size-section"
    lead={<>
      <p>A redução indevida da logomarca compromete sua leitura e sua identificação. O manual define dois limites: um para aplicações em geral e outro, maior, para peças bordadas.</p>
      <p>As medidas são físicas e permanecem em centímetros. Na tela, a demonstração é ilustrativa: o tamanho real depende do monitor e do zoom.</p>
    </>}>
    <div className="vi-sizes">
      {minimumSizes.map(size => <article key={size.id} className="vi-size-card" data-vi-reveal>
        <p className="vi-size-label">{size.label}</p>
        <p className="vi-size-value">{size.width}<span>×</span>{size.height}<small>cm</small></p>
        <p className="vi-muted">{size.text}</p>
      </article>)}
      <article className="vi-size-card is-alt" data-vi-reveal>
        <p className="vi-size-label"><Shirt size={14} aria-hidden="true" /> Alternativa</p>
        <p className="vi-size-value is-word">Silkscreen</p>
        <p className="vi-muted">Quando o bordado não puder ter ao menos {embroidery.width} × {embroidery.height} cm, a aplicação deve ser feita em silkscreen para garantir a visualização da marca.</p>
        <p className="vi-note">{embroideryDiagramNote}</p>
      </article>
    </div>

    <div className="vi-ruler-demo" data-level={result.level}>
      <label className="vi-field">
        <span>Largura de aplicação: <output>{format(width)} cm</output></span>
        <input type="range" min={MIN} max={MAX} step={0.1} value={width} onChange={event => setWidth(Number(event.target.value))} aria-valuetext={`${format(width)} centímetros`} />
      </label>
      <div className="vi-ruler-stage">
        <div className="vi-ruler-logo" style={{ width: `${width}cm` }}>
          <OfficialLogo alt={`Logomarca Gazin com ${format(width)} cm de largura (escala ilustrativa)`} />
        </div>
        <div className="vi-ruler" aria-hidden="true" style={{ width: `${MAX}cm` }}>
          <span className="vi-ruler-fill" style={{ width: `${width}cm` }} />
          {ticks.map(tick => <span key={tick} className="vi-ruler-tick" style={{ left: `${tick}cm` }}><i>{tick}</i></span>)}
          <span className="vi-ruler-mark" style={{ left: `${print.width}cm` }}>mín.</span>
          <span className="vi-ruler-mark" style={{ left: `${embroidery.width}cm` }}>bordado</span>
        </div>
      </div>
      <p className="vi-ruler-verdict" aria-live="polite"><result.icon size={16} aria-hidden="true" /><b>{result.title}.</b> {result.text}</p>
      <p className="vi-note">Escala de tela: 1 cm em CSS equivale a 37,8 px e não corresponde necessariamente a 1 cm físico. A largura controla a demonstração e a proporção do arquivo é sempre preservada. Os valores do manual (largura × altura) referem-se à composição completa.</p>
    </div>
  </IdentitySection>
}
