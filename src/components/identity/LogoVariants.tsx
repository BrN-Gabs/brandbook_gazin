import { useRef, useState, type KeyboardEvent } from 'react'
import { Download, PackageOpen } from 'lucide-react'
import type { Subsection } from '../../data/brandChapters'
import { logoArchive, logoAsset, variants, type Variant } from '../../data/visualIdentity'
import { IdentitySection, LogoVersion, RadioSegmented, rovingIndex } from './shared'

const base = import.meta.env.BASE_URL
const sloganOptions = [{ id: 'com', label: 'Com slogan' }, { id: 'sem', label: 'Sem slogan' }] as const
type SloganOption = typeof sloganOptions[number]['id']

function DownloadLink({ variant, slogan, compact = false }: { variant: Variant; slogan: boolean; compact?: boolean }) {
  const file = logoAsset(variant.id, slogan)
  const label = `${variant.label} ${slogan ? 'com' : 'sem'} slogan`
  return <a className={`vi-download ${compact ? 'is-compact' : ''}`} href={`${base}${file}`} download={file.split('/').pop()} aria-label={`Baixar logomarca ${label} (PNG)`}>
    <Download size={15} aria-hidden="true" />
    <span>{compact ? (slogan ? 'Com slogan' : 'Sem slogan') : `PNG ${slogan ? 'com' : 'sem'} slogan`}</span>
  </a>
}

/** All versions, with and without slogan, plus one archive. */
function LogoDownloads() {
  return <div className="vi-downloads" id="downloads-logomarca">
    <div className="vi-downloads-head" data-vi-reveal>
      <div>
        <h4 className="vi-h4">Baixar a logomarca</h4>
        <p className="vi-muted">Todas as versões corretas, em PNG com fundo transparente, com e sem slogan.</p>
      </div>
      <a className="vi-download is-primary" href={`${base}${logoArchive}`} download="gazin-logos.zip">
        <PackageOpen size={17} aria-hidden="true" /><span>Baixar todas (.zip)</span>
      </a>
    </div>
    <ul className="vi-downloads-grid">
      {variants.map(variant => <li key={variant.id} data-vi-reveal>
        <div className={`vi-downloads-thumb ${variant.backgrounds[0].dark ? 'is-dark' : 'is-light'}`} style={{ background: `var(${variant.backgrounds[0].token})` }}>
          <LogoVersion id={variant.id} slogan decorative />
        </div>
        <strong>{variant.label}</strong>
        <div className="vi-downloads-links">
          <DownloadLink variant={variant} slogan compact />
          <DownloadLink variant={variant} slogan={false} compact />
        </div>
      </li>)}
    </ul>
  </div>
}

export function LogoVariants({ subsection }: { subsection: Subsection }) {
  const [selected, setSelected] = useState(0)
  const [backgrounds, setBackgrounds] = useState<Record<string, number>>({})
  const [slogan, setSlogan] = useState<SloganOption>('com')
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const variant = variants[selected]
  const background = variant.backgrounds[backgrounds[variant.id] ?? 0]
  const withSlogan = slogan === 'com'

  const onKey = (event: KeyboardEvent) => {
    const next = rovingIndex(event.key, selected, variants.length)
    if (next === null) return
    event.preventDefault()
    setSelected(next)
    tabs.current[next]?.focus()
  }

  return <IdentitySection subsection={subsection} className="vi-variants-section"
    lead={<>
      <p>A logomarca deve ser aplicada, preferencialmente, em fundo branco e em suas cores originais. Para fundos escuros, impressão em preto e branco ou em uma cor, o manual define versões específicas.</p>
      <p>Escolha um contexto para ver a versão correta, com ou sem slogan, e baixe o arquivo pronto para uso.</p>
    </>}>
    <div className="vi-variants">
      <div className="vi-variant-tabs" role="tablist" aria-label="Versões da logomarca" aria-orientation="vertical" onKeyDown={onKey}>
        {variants.map((item, index) => <button key={item.id} ref={element => { tabs.current[index] = element }} type="button" role="tab"
          id={`vi-variant-tab-${item.id}`} aria-controls="vi-variant-panel" aria-selected={index === selected} tabIndex={index === selected ? 0 : -1}
          onClick={() => setSelected(index)} className="vi-variant-tab">
          <span className="vi-variant-swatch" data-variant={item.id} aria-hidden="true" />
          <span><b>{item.label}</b><small>{item.short}</small></span>
        </button>)}
      </div>

      <div id="vi-variant-panel" className="vi-variant-panel" role="tabpanel" aria-labelledby={`vi-variant-tab-${variant.id}`}>
        <div className={`vi-variant-stage ${background.dark ? 'is-dark' : 'is-light'}`} style={{ background: `var(${background.token})` }}>
          <RadioSegmented className="vi-variant-slogan" label="Slogan" options={sloganOptions} value={slogan} onChange={setSlogan} />
          <div className="vi-variant-art" key={`${variant.id}-${background.id}-${slogan}`}><LogoVersion id={variant.id} slogan={withSlogan} className="vi-variant-logo" /></div>
          {variant.backgrounds.length > 1 && <div className="vi-segmented vi-variant-bg" role="group" aria-label="Fundo da demonstração">
            {variant.backgrounds.map((item, index) => <button key={item.id} type="button" aria-pressed={item.id === background.id}
              onClick={() => setBackgrounds(previous => ({ ...previous, [variant.id]: index }))}>{item.label}</button>)}
          </div>}
        </div>
        <div className="vi-variant-info" key={variant.id}>
          <h4 className="vi-h4">{variant.label}</h4>
          <p>{variant.rule}</p>
          {variant.specs && <dl className="vi-spec-chips">
            {variant.specs.map(spec => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}
          </dl>}
          <div className="vi-variant-downloads">
            <DownloadLink variant={variant} slogan />
            <DownloadLink variant={variant} slogan={false} />
          </div>
        </div>
      </div>
    </div>
    <LogoDownloads />
  </IdentitySection>
}
