import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Ban, Check } from 'lucide-react'
import type { Subsection } from '../../data/brandChapters'
import { misuses, slogan, type Misuse, type MisuseId } from '../../data/visualIdentity'
import { H, IdentitySection, LogoLetters, LogoVersion, OfficialLogo, ProvenanceTag, W, logoUrl, rovingIndex } from './shared'

/** Correct reference for each rule (always the original file, used as documented). */
export function CorrectArt({ id }: { id: MisuseId }) {
  switch (id) {
    case 'slogan': return <div className="vi-art-slogan"><OfficialLogo decorative /><span className="vi-art-slot">Slogan oficial · arquivo da marca</span></div>
    case 'reducao': return <div className="vi-art-small" style={{ width: '3cm' }}><OfficialLogo decorative /><span>3 cm</span></div>
    case 'invasao': return <div className="vi-art-space"><OfficialLogo decorative /><p className="vi-art-text is-away">Texto afastado da marca, fora da área de segurança.</p></div>
    case 'contorno': return <div className="vi-art-dark"><LogoVersion id="fundo-escuro" decorative /></div>
    default: return <OfficialLogo decorative />
  }
}

/**
 * Incorrect demonstration: the same original file, distorted on screen to show the
 * error. Always rendered behind a "não utilizar" mark, never offered for download.
 */
export function WrongArt({ id }: { id: MisuseId }) {
  switch (id) {
    case 'cor': return <svg className="vi-logo-svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <image href={logoUrl} width={W} height={H} />
      <LogoLetters fill="var(--gazin-orange)" />
    </svg>
    case 'slogan': return <div className="vi-art-slogan is-wrong"><OfficialLogo decorative /><span className="vi-art-wrong-slogan">{slogan}</span></div>
    case 'reducao': return <div className="vi-art-small" style={{ width: '1.4cm' }}><OfficialLogo decorative /><span>1,4 cm</span></div>
    case 'invasao': return <div className="vi-art-space"><OfficialLogo decorative /><p className="vi-art-text is-close">Texto encostado na marca, dentro da área de segurança.</p></div>
    case 'moldura': return <div className="vi-art-frame"><OfficialLogo decorative /></div>
    case 'contorno': return <div className="vi-art-dark"><OfficialLogo decorative /></div>
    default: return <div className={`vi-art-transform is-${id}`}><OfficialLogo decorative /></div>
  }
}

export function IncorrectUsageGallery({ subsection }: { subsection: Subsection }) {
  const [selected, setSelected] = useState(0)
  const [applied, setApplied] = useState(true)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const item: Misuse = misuses[selected]

  // Each new rule starts from the correct state and morphs into the error.
  useEffect(() => {
    setApplied(false)
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setApplied(true)))
    return () => cancelAnimationFrame(frame)
  }, [selected])

  const onKey = (event: KeyboardEvent) => {
    const next = rovingIndex(event.key, selected, misuses.length)
    if (next === null) return
    event.preventDefault()
    setSelected(next)
    tabs.current[next]?.focus()
  }

  return <IdentitySection subsection={subsection} className="vi-misuse-section"
    lead={<>
      <p>Para manter a integridade visual da logomarca, algumas formas de apresentação não devem ser utilizadas de maneira alguma. É vedada qualquer forma de utilização diferente das apresentadas no manual.</p>
      <p>Selecione um caso para comparar a aplicação correta com o erro. Os exemplos incorretos são demonstrações na tela e nunca devem ser reproduzidos.</p>
    </>}>
    <div className="vi-misuse">
      <div className="vi-misuse-list" role="tablist" aria-label="Usos incorretos da logomarca" aria-orientation="vertical" onKeyDown={onKey}>
        {misuses.map((misuse, index) => <button key={misuse.id} ref={element => { tabs.current[index] = element }} type="button" role="tab"
          id={`vi-misuse-tab-${misuse.id}`} aria-controls="vi-misuse-panel" aria-selected={index === selected} tabIndex={index === selected ? 0 : -1}
          onClick={() => setSelected(index)}>
          <span className="vi-misuse-index">{String(index + 1).padStart(2, '0')}</span>
          <span>{misuse.title}</span>
        </button>)}
      </div>

      <div id="vi-misuse-panel" className="vi-misuse-panel" role="tabpanel" aria-labelledby={`vi-misuse-tab-${item.id}`}>
        <div className="vi-compare">
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
        <div className="vi-tags">
          <ProvenanceTag kind={item.provenance} page={item.page}>{item.provenance === 'manual' ? 'Regra ou exemplo do manual' : 'Interpretação didática de regra do manual'}</ProvenanceTag>
        </div>
      </div>
    </div>
  </IdentitySection>
}
