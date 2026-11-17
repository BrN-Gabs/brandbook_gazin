import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react'
import { ClipboardCopy, Copy, Download, FileArchive, PackageOpen, Search, X } from 'lucide-react'
import { backgrounds, iconCategories, iconColors, icons, kebab, matchIcon, pngSizes, previewSizes, strokes } from '../../../data/iconography'
import { iconComponents } from './icons'
import { buildSvg, copyText, iconPackage, saveBlob, svgToPng } from './iconExport'

const COMPACT = '(max-width: 999px)'
type Background = (typeof backgrounds)[number]['id']
type Status = { kind: 'ok' | 'error'; text: string } | null
const categoryName = (id: string) => iconCategories.find(category => category.id === id)!.name

/** Radio group with arrow keys and roving tabindex (same pattern as the rest of the Manual). */
function Choice<T extends string | number>({ label, value, options, onChange, className = '' }: { label: string; value: T; options: { id: T; label: ReactNode; title?: string; style?: CSSProperties }[]; onChange: (id: T) => void; className?: string }) {
  const group = useRef<HTMLDivElement>(null)
  const index = Math.max(0, options.findIndex(option => option.id === value))
  const onKeyDown = (event: KeyboardEvent) => {
    const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0
    if (!step) return
    event.preventDefault()
    const next = (index + step + options.length) % options.length
    onChange(options[next].id)
    group.current?.querySelectorAll<HTMLElement>('[role="radio"]')[next]?.focus()
  }
  return <div ref={group} className={`ic-choice ${className}`} role="radiogroup" aria-label={label} onKeyDown={onKeyDown}>
    {options.map(option => <button key={String(option.id)} type="button" role="radio" aria-checked={option.id === value} tabIndex={option.id === value ? 0 : -1} title={option.title} style={option.style} onClick={() => onChange(option.id)}>{option.label}</button>)}
  </div>
}

/**
 * Biblioteca de Ícones: curated Lucide icons for the Gazin universe, searchable in Portuguese,
 * customisable (palette colour, size, stroke, background) and exportable as SVG, PNG and ZIP.
 * Loaded on demand (React.lazy), so the icons are not part of the initial bundle.
 */
export default function IconLibrary() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('todas')
  const [selected, setSelected] = useState('Store')
  const [color, setColor] = useState(iconColors[0].hex)
  const [stroke, setStroke] = useState(2)
  const [size, setSize] = useState(64)
  const [background, setBackground] = useState<Background>('transparente')
  const [pngSize, setPngSize] = useState(512)
  const [status, setStatus] = useState<Status>(null)
  const [packageStatus, setPackageStatus] = useState<Status>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const panelTitle = useRef<HTMLHeadingElement>(null)
  const sheet = useRef<HTMLDialogElement>(null)
  // Smaller screens: the customiser is a modal sheet (native <dialog>, top layer, Escape closes).
  const [compact, setCompact] = useState(() => matchMedia(COMPACT).matches)
  useEffect(() => {
    const query = matchMedia(COMPACT)
    const update = () => {
      setCompact(query.matches)
      // Leaving the compact layout with the sheet open must release the page scroll.
      if (!query.matches) window.dispatchEvent(new CustomEvent('brandbook:scroll-lock', { detail: false }))
    }
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    const dialog = sheet.current
    if (!compact || !dialog) return
    if (panelOpen && !dialog.open) {
      dialog.showModal()
      window.dispatchEvent(new CustomEvent('brandbook:scroll-lock', { detail: true }))
      panelTitle.current?.focus({ preventScroll: true })
    }
    if (!panelOpen && dialog.open) dialog.close()
  }, [compact, panelOpen])

  const results = useMemo(() => icons.filter(item => (category === 'todas' || item.categories.includes(category)) && matchIcon(item, query)), [category, query])
  const current = icons.find(item => item.name === selected)!
  const Preview = iconComponents[current.name]
  const settings = { color, stroke, size }
  const bg = backgrounds.find(item => item.id === background)!

  const fileBase = `${kebab(current.name)}-${color.slice(1).toLowerCase()}`

  const run = async (task: () => Promise<string> | string) => {
    try { setStatus({ kind: 'ok', text: await task() }) }
    catch (error) { setStatus({ kind: 'error', text: `Não foi possível concluir: ${(error as Error).message}` }) }
  }
  const select = (name: string) => {
    setSelected(name)
    setStatus(null)
    setPanelOpen(true)
  }
  const closeSheet = () => {
    setPanelOpen(false)
    window.dispatchEvent(new CustomEvent('brandbook:scroll-lock', { detail: false }))
  }
  const downloadSvg = () => run(() => { saveBlob(new Blob([buildSvg(current.name, settings)], { type: 'image/svg+xml' }), `${fileBase}.svg`); return `SVG baixado: ${fileBase}.svg` })
  const downloadPng = () => run(async () => { const blob = await svgToPng(buildSvg(current.name, settings), pngSize, bg.hex); saveBlob(blob, `${fileBase}-${pngSize}.png`); return `PNG ${pngSize} × ${pngSize} baixado${bg.hex ? '' : ' (fundo transparente)'}.` })
  const copySvg = () => run(async () => { await copyText(buildSvg(current.name, settings)); return 'Código SVG copiado.' })
  const copyName = () => run(async () => { await copyText(current.name); return `Nome copiado: ${current.name}` })
  const downloadPackage = (categoryId?: string) => {
    try { const zip = iconPackage({ color, stroke, size: 24 }, categoryId); saveBlob(zip.blob, zip.name); setPackageStatus({ kind: 'ok', text: `${zip.name} baixado (${zip.count} ícones + LICENSE.txt).` }) }
    catch (error) { setPackageStatus({ kind: 'error', text: `Não foi possível gerar o pacote: ${(error as Error).message}` }) }
  }

  const panel = <>
        <div className="ic-panel-head">
          <div>
            <h4 id="ic-panel-title" ref={panelTitle} tabIndex={-1}>{current.pt}</h4>
            <p><code>{current.name}</code> · {current.categories.map(categoryName).join(' · ')}</p>
          </div>
          <button type="button" className="ic-panel-close" onClick={closeSheet} aria-label="Fechar personalização"><X size={18} aria-hidden="true" /></button>
        </div>
        <div className={`ic-preview is-${background} ${color === "#FFFFFF" ? "has-light-icon" : ""}`} style={{ '--bg': bg.hex ?? 'transparent' } as CSSProperties}>
          <Preview size={size} strokeWidth={stroke} color={color} role="img" aria-label={`Prévia: ${current.pt}, ${size} px, traço ${String(stroke).replace('.', ',')}`} />
        </div>
        <div className="ic-controls">
          <p className="ic-control-label">Cor</p>
          <Choice label="Cor" value={color} onChange={setColor} className="ic-swatches" options={iconColors.map(item => ({ id: item.hex, title: `${item.name} ${item.hex}`, style: { '--swatch': item.hex } as CSSProperties, label: <span className="vi-sr-only">{item.name}</span> }))} />
          <p className="ic-control-label">Tamanho</p>
          <Choice label="Tamanho" value={size} onChange={setSize} options={previewSizes.map(px => ({ id: px, label: `${px}` }))} />
          <p className="ic-control-label">Espessura</p>
          <Choice label="Espessura" value={stroke} onChange={setStroke} options={strokes.map(item => ({ id: item.value, label: `${String(item.value.toFixed(1)).replace('.', ',')} · ${item.label}` }))} />
          <p className="ic-control-label">Fundo</p>
          <Choice label="Fundo" value={background} onChange={setBackground} options={backgrounds.map(item => ({ id: item.id, label: item.name }))} />
        </div>
        <div className="ic-downloads">
          <button type="button" className="vi-download is-primary" onClick={downloadSvg}><Download size={16} aria-hidden="true" /><span>Baixar ícone · SVG</span></button>
          <div className="ic-png">
            <label><span className="vi-sr-only">Resolução do PNG</span>
              <select value={pngSize} onChange={event => setPngSize(Number(event.target.value))} aria-label="Resolução do PNG">
                {pngSizes.map(px => <option key={px} value={px}>{px} × {px}</option>)}
              </select>
            </label>
            <button type="button" className="vi-download" onClick={downloadPng}><Download size={16} aria-hidden="true" /><span>Baixar PNG</span></button>
          </div>
          <div className="ic-copy">
            <button type="button" className="vi-download is-compact" onClick={copySvg}><ClipboardCopy size={15} aria-hidden="true" /><span>Copiar SVG</span></button>
            <button type="button" className="vi-download is-compact" onClick={copyName}><Copy size={15} aria-hidden="true" /><span>Copiar nome</span></button>
          </div>
          <p className={`ic-status ${status?.kind ?? ''}`} role="status">{status?.text}</p>
          <p className="ic-note">O SVG mantém a geometria original (viewBox 24 × 24) com a cor, a espessura e o tamanho escolhidos; o fundo vale para o PNG. Os pacotes .zip usam a cor e a espessura escolhidas.</p>
        </div>
  </>

  return <div className="ic-library">
    <header className="ic-library-head">
      <div>
        <h4 id="ic-library-title">Biblioteca de Ícones</h4>
        <p>{icons.length} ícones da biblioteca Lucide selecionados para o universo Gazin, organizados em {iconCategories.length} categorias. Escolha um ícone para personalizar e baixar.</p>
      </div>
      <button type="button" className="vi-download is-primary" onClick={() => downloadPackage()}><PackageOpen size={17} aria-hidden="true" /><span>Baixar biblioteca completa (.zip)</span></button>
    </header>

    <div className="ic-filters">
      <label className="vi-group-search">
        <Search size={16} aria-hidden="true" />
        <span className="vi-sr-only">Pesquisar ícone</span>
        <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Pesquisar: casa, seguro, caminhão…" />
      </label>
      <Choice label="Categoria" value={category} onChange={setCategory} className="ic-categories" options={[
        { id: 'todas', label: 'Todas' },
        ...iconCategories.map(item => ({ id: item.id, label: item.name.replace(/ e .*/, ''), title: item.name })),
      ]} />
      <div className="ic-filter-row">
        <p className="ic-count" aria-live="polite">{results.length} {results.length === 1 ? 'ícone' : 'ícones'}{category !== 'todas' && ` · ${categoryName(category)}`}</p>
        {category !== 'todas' && <button type="button" className="vi-download is-compact" onClick={() => downloadPackage(category)}><FileArchive size={15} aria-hidden="true" /><span>Baixar categoria {categoryName(category)}</span></button>}
      </div>
      <p className={`ic-status ${packageStatus?.kind ?? ''}`} role="status">{packageStatus?.text}</p>
    </div>

    <div className="ic-workspace">
      {results.length
        ? <ul className="ic-grid" aria-labelledby="ic-library-title">
          {results.map(item => {
            const Icon = iconComponents[item.name]
            return <li key={item.name}><button type="button" aria-pressed={selected === item.name} onClick={() => select(item.name)} aria-label={`${item.pt} (${item.name}) · ${categoryName(item.categories[0])}`}>
              <Icon size={28} strokeWidth={2} aria-hidden="true" />
              <span className="ic-grid-name">{item.pt}</span>
              <span className="ic-grid-meta">{categoryName(item.categories[0]).replace(/ e .*/, '')}</span>
            </button></li>
          })}
        </ul>
        : <div className="ic-empty"><p>Nenhum ícone encontrado para “{query}”.</p><button type="button" className="vi-download is-compact" onClick={() => { setQuery(''); setCategory('todas') }}>Limpar busca</button></div>}

      {compact
        ? <dialog ref={sheet} className="ic-panel is-sheet" aria-labelledby="ic-panel-title" onClose={closeSheet} onClick={event => { if (event.target === event.currentTarget) closeSheet() }}>{panel}</dialog>
        : <aside className="ic-panel" aria-labelledby="ic-panel-title">{panel}</aside>}
    </div>
  </div>
}
