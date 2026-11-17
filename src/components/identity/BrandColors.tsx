import { useCallback, useRef, useState, type KeyboardEvent } from 'react'
import { Check, Copy, Monitor, Printer } from 'lucide-react'
import type { Subsection } from '../../data/brandChapters'
import { digitalBlue, interfaceColors, interfaceGradients, printColors, type ColorSpec } from '../../data/visualIdentity'
import { IdentitySection, ProvenanceTag, rovingIndex } from './shared'

/** Copies text to the clipboard (with a fallback for non-secure contexts) and announces it. */
function useCopy() {
  const [copied, setCopied] = useState<string | null>(null)
  const timer = useRef(0)
  const copy = useCallback(async (text: string, key: string) => {
    try { await navigator.clipboard.writeText(text) }
    catch {
      const area = Object.assign(document.createElement('textarea'), { value: text })
      area.setAttribute('readonly', ''); area.style.position = 'fixed'; area.style.opacity = '0'
      document.body.append(area); area.select()
      try { document.execCommand('copy') } finally { area.remove() }
    }
    setCopied(key)
    clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(null), 1800)
  }, [])
  return { copied, copy }
}

function CopyButton({ value, id, copied, onCopy, label }: { value: string; id: string; copied: string | null; onCopy: (value: string, id: string) => void; label: string }) {
  const done = copied === id
  return <button type="button" className={`vi-copy ${done ? 'is-done' : ''}`} onClick={() => onCopy(value, id)} aria-label={`Copiar ${label} ${value}`}>
    <code>{value}</code>{done ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
  </button>
}

/** Logo blue: print specification (manual) side by side with the digital colour (#080EA0). */
function PrintAndDigital({ copied, onCopy }: { copied: string | null; onCopy: (value: string, id: string) => void }) {
  const [blue, black] = printColors
  return <div className="vi-blue-pair">
    <article className="vi-blue-card" data-vi-reveal>
      <div className="vi-blue-swatch" style={{ background: `var(${blue.token})` }}>
        <span className="vi-blue-medium"><Printer size={16} aria-hidden="true" />Impressão</span>
        <span className="vi-blue-name">{blue.pantone}</span>
      </div>
      <div className="vi-blue-data">
        <h4 className="vi-h4">Azul para impressão</h4>
        <p className="vi-muted">{blue.role}</p>
        <dl className="vi-spec-list">
          <div><dt>Pantone</dt><dd>{blue.pantone}</dd></div>
          <div><dt>CMYK</dt><dd>{blue.cmyk}</dd></div>
        </dl>
        <div className="vi-manual-black">
          <span className="vi-mini-swatch" style={{ background: `var(${black.token})` }} aria-hidden="true" />
          <div><strong>{black.name}</strong><span>{black.cmyk} · {black.pantone}</span></div>
        </div>
        <p className="vi-note">A amostra na tela é apenas uma simulação: a cor de impressão é conferida pelo Pantone ou pelo CMYK.</p>
      </div>
    </article>
    <article className="vi-blue-card is-digital" data-vi-reveal>
      <div className="vi-blue-swatch" style={{ background: `var(${digitalBlue.token})` }}>
        <span className="vi-blue-medium"><Monitor size={16} aria-hidden="true" />Digital</span>
        <span className="vi-blue-name">{digitalBlue.hex}</span>
      </div>
      <div className="vi-blue-data">
        <h4 className="vi-h4">Azul para telas</h4>
        <p className="vi-muted">{digitalBlue.role}</p>
        <dl className="vi-spec-list">
          <div><dt>HEX</dt><dd><CopyButton value={digitalBlue.hex} id="digital-blue" copied={copied} onCopy={onCopy} label="HEX" /></dd></div>
          <div><dt>RGB</dt><dd>8 · 14 · 160</dd></div>
        </dl>
        <p className="vi-note">É o mesmo azul principal da paleta digital, abaixo. Use-o em todas as aplicações em tela, inclusive no slogan.</p>
      </div>
    </article>
  </div>
}

function InterfacePalette({ copied, onCopy }: { copied: string | null; onCopy: (value: string, id: string) => void }) {
  const [selected, setSelected] = useState(0)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])
  const color: ColorSpec = interfaceColors[selected]
  const move = (event: KeyboardEvent) => {
    const next = rovingIndex(event.key, selected, interfaceColors.length)
    if (next === null) return
    event.preventDefault()
    setSelected(next)
    buttons.current[next]?.focus()
  }
  return <div className="vi-palette">
    <div className="vi-palette-strip" role="radiogroup" aria-label="Cores da interface do Manual da Marca" onKeyDown={move}>
      {interfaceColors.map((item, index) => <button key={item.id} ref={element => { buttons.current[index] = element }} type="button" role="radio"
        aria-checked={index === selected} tabIndex={index === selected ? 0 : -1} onClick={() => setSelected(index)}
        className={`vi-palette-bar ${item.onDark ? 'on-dark' : 'on-light'}`} style={{ background: `var(${item.token})` }}>
        <span className="vi-palette-bar-name">{item.name}</span>
        <span className="vi-palette-bar-hex">{item.hex}</span>
      </button>)}
    </div>
    <div className="vi-palette-detail" key={color.id}>
      <div className="vi-palette-detail-head">
        <span className="vi-mini-swatch is-large" style={{ background: `var(${color.token})` }} aria-hidden="true" />
        <div>
          <h4 className="vi-h4">{color.name}</h4>
          <code className="vi-token">{color.token}</code>
        </div>
        <CopyButton value={color.hex} id={`ui-${color.id}`} copied={copied} onCopy={onCopy} label="HEX" />
      </div>
      <p className="vi-muted">{color.role}</p>
      <div className="vi-surfaces" aria-label={`${color.name} em diferentes superfícies`}>
        <div className="vi-surface is-light"><b className="vi-surface-sample" style={{ color: `var(${color.token})` }}>Aa</b><span>Sobre branco</span></div>
        <div className="vi-surface is-dark"><b className="vi-surface-sample" style={{ color: `var(${color.token})` }}>Aa</b><span>Sobre marinho</span></div>
        <div className="vi-surface is-fill" style={{ background: `var(${color.token})`, color: color.onDark ? 'var(--gazin-white)' : 'var(--gazin-blue)' }}><b className="vi-surface-sample">Aa</b><span>Superfície</span></div>
      </div>
      <ProvenanceTag kind="digital">Paleta digital</ProvenanceTag>
    </div>
  </div>
}

export function BrandColors({ subsection }: { subsection: Subsection }) {
  const { copied, copy } = useCopy()
  return <IdentitySection subsection={subsection} className="vi-colors-section"
    lead={<>
      <p>As cores são fundamentais para identificar e reconhecer a logomarca de imediato. O retângulo e o slogan usam um único azul, com duas referências: uma para <strong>impressão</strong> e outra para <strong>telas</strong>.</p>
      <p>Na impressão vale o azul do manual, <strong>Pantone Blue 072 C</strong> (C100 M100 Y0 K0). No digital, vale o azul da paleta, <strong>#080EA0</strong>.</p>
    </>}>
    <div className="vi-colors-group">
      <p className="vi-group-label"><span>A</span>Azul da marca: impressão e digital</p>
      <PrintAndDigital copied={copied} onCopy={copy} />
    </div>

    <div className="vi-colors-group">
      <p className="vi-group-label"><span>B</span>Paleta digital</p>
      <InterfacePalette copied={copied} onCopy={copy} />
      <div className="vi-rule-card" data-vi-reveal>
        <div>
          <h4 className="vi-h4">O azul é protagonista</h4>
          <p className="vi-muted">Em tela, o #080EA0 conduz a comunicação. Verde e laranja são cores complementares: não substituem o azul da logomarca nem recolorem os arquivos oficiais.</p>
        </div>
        <div className="vi-proportion" role="img" aria-label="Proporção de uso na interface: cerca de 75% azuis, 15% branco e cinza azulado, 10% verde e laranja">
          <span style={{ flexGrow: 75 }}><b>75%</b> azuis</span>
          <span style={{ flexGrow: 15 }}><b>15%</b></span>
          <span style={{ flexGrow: 10 }}><b>10%</b></span>
        </div>
      </div>
    </div>

    <div className="vi-colors-group">
      <p className="vi-group-label"><span>C</span>Degradês digitais</p>
      <ul className="vi-gradients">
        {interfaceGradients.map(gradient => <li key={gradient.id} data-vi-reveal>
          <span className="vi-gradient-swatch" style={{ background: `var(${gradient.token})` }} aria-hidden="true" />
          <strong>{gradient.name}</strong>
          <code className="vi-token">{gradient.token}</code>
          <span className="vi-muted">{gradient.from} → {gradient.to}</span>
        </li>)}
      </ul>
      <ProvenanceTag kind="digital">Recurso digital · não se aplica à logomarca</ProvenanceTag>
    </div>

    <p className="vi-sr-only" aria-live="polite">{copied ? 'Código copiado' : ''}</p>
  </IdentitySection>
}
