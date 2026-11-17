import { useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight, List, RotateCcw, X } from 'lucide-react'
import { itemsOf, overviewView, treeIntro, treeItems, treeRegion, treeRegions, type TreeItem, type TreeRegionId } from '../../data/successTree'
import { GROUND, TRUNK_TOP } from './treeState'

type Hover = (id: string | null) => void

/**
 * Labels anchored to 3D points (positioned by SuccessTreeScene every frame). Mouse/touch
 * targets only: the same content is reachable by keyboard and screen readers through the
 * region bar and the info panel, so this layer is hidden from assistive technology.
 */
export function TreeLabels({ onSelect, onRegion, onHover }: { onSelect: (id: string) => void; onRegion: (id: TreeRegionId) => void; onHover: Hover }) {
  return <div className="tree-labels" aria-hidden="true">
    {treeRegions.map(region => <div key={region.id} className="tree-region-label" data-region={region.id} onClick={() => onRegion(region.id)}>
      <span>{region.label}</span>
    </div>)}
    {treeItems.map(item => <div key={item.id} className={`tree-label is-${item.region} ${item.accent ? `accent-${item.accent}` : ''}`} data-id={item.id}
      onPointerEnter={() => onHover(item.id)} onPointerLeave={() => onHover(null)} onClick={() => onSelect(item.id)}>
      <span className="tree-label-dot" />
      <span className="tree-label-text">{item.title}</span>
    </div>)}
  </div>
}

/** RAÍZES | TRONCO | GALHOS | FRUTOS + Visão geral (also restores the camera). */
export function TreeNavigation({ region, ready, onRegion, onOverview }: { region: TreeRegionId | null; ready: boolean; onRegion: (id: TreeRegionId) => void; onOverview: () => void }) {
  return <nav className="tree-nav" aria-label="Regiões da árvore" data-ready={ready}>
    <button type="button" className="tree-nav-overview" onClick={onOverview} aria-pressed={!region} disabled={!ready} aria-label="Visão geral (restaurar câmera)">
      <RotateCcw size={15} aria-hidden="true" /><span>Visão geral</span>
    </button>
    <span className="tree-nav-rule" aria-hidden="true" />
    {treeRegions.map(entry => <button key={entry.id} type="button" onClick={() => onRegion(entry.id)} aria-pressed={region === entry.id} disabled={!ready}>{entry.label}</button>)}
  </nav>
}

/** Contextual panel: the region's concept and list, or one element with its description. */
export function TreeInfoPanel({ region, selected, onSelect, onBack, onClose, onHover }: {
  region: TreeRegionId; selected: TreeItem | null
  onSelect: (id: string) => void; onBack: () => void; onClose: () => void; onHover: Hover
}) {
  const data = treeRegion(region)
  const list = itemsOf(region)
  const index = selected ? list.indexOf(selected) : -1
  const panel = useRef<HTMLElement>(null)
  // The content swaps (list ↔ element): keep keyboard users in the panel instead of on <body>.
  useEffect(() => {
    const active = document.activeElement
    if (active === document.body || (active && panel.current?.contains(active) && !active.isConnected)) panel.current?.querySelector<HTMLElement>('h3')?.focus({ preventScroll: true })
  }, [selected?.id, region])
  return <aside ref={panel} className="tree-panel" aria-label={`${data.label} da árvore`}>
    <button type="button" className="tree-panel-close" onClick={onClose} aria-label="Fechar e voltar à visão geral"><X size={18} aria-hidden="true" /></button>
    <div className="tree-panel-body" key={selected?.id ?? region} aria-live="polite">
      {selected ? <>
        <p className="tree-panel-region"><span aria-hidden="true" />{data.label}</p>
        <h3 tabIndex={-1}>{selected.title}</h3>
        <p className="tree-panel-text">{selected.description}</p>
        {region === 'frutos' && <p className="tree-panel-note">{treeIntro.sourceNote}</p>}
        <div className="tree-panel-nav">
          <button type="button" onClick={() => onSelect(list[index - 1].id)} disabled={index <= 0} aria-label="Elemento anterior"><ArrowLeft size={16} aria-hidden="true" /></button>
          <span>{index + 1} / {list.length}</span>
          <button type="button" onClick={() => onSelect(list[index + 1].id)} disabled={index >= list.length - 1} aria-label="Próximo elemento"><ArrowRight size={16} aria-hidden="true" /></button>
          <button type="button" className="tree-panel-all" onClick={onBack}><List size={15} aria-hidden="true" />Todos de {data.label}</button>
        </div>
      </> : <>
        <p className="tree-panel-region"><span aria-hidden="true" />Região</p>
        <h3 tabIndex={-1}>{data.label}</h3>
        <p className="tree-panel-text">{data.concept}</p>
        <ul className="tree-panel-list">
          {list.map(item => <li key={item.id}>
            <button type="button" onClick={() => onSelect(item.id)} onPointerEnter={() => onHover(item.id)} onPointerLeave={() => onHover(null)} onFocus={() => onHover(item.id)} onBlur={() => onHover(null)}>
              <span className={`tree-panel-dot is-${item.region} ${item.accent ? `accent-${item.accent}` : ''}`} aria-hidden="true" />{item.title}
            </button>
          </li>)}
        </ul>
        {region === 'frutos' && <p className="tree-panel-note">{treeIntro.sourceNote}</p>}
      </>}
    </div>
  </aside>
}

/** Static vector tree (same positions as the 3D scene) shown while loading or without WebGL. */
export function TreeFallback() {
  const [cx, cy] = overviewView.center, [w, h] = overviewView.size
  const point = (x: number, y: number) => `${x.toFixed(2)} ${(-y).toFixed(2)}`
  return <svg className="tree-fallback" viewBox={`${cx - w / 2 - .4} ${-(cy + h / 2) - .4} ${w + .8} ${h + .8}`} aria-hidden="true" fill="none">
    <path d={`M -7 ${-GROUND} H 7`} className="tree-fallback-ground" />
    <path d={`M -.9 ${-GROUND} C -.45 0, -.55 -1.6, -.6 ${-TRUNK_TOP} M .9 ${-GROUND} C .45 0, .55 -1.6, .6 ${-TRUNK_TOP}`} className="tree-fallback-trunk" />
    {itemsOf('raizes').map(item => { const [x, y] = item.position; return <path key={item.id} d={`M ${point(x * .08, GROUND)} Q ${point(x * .55, GROUND - .5)} ${point(x, y)}`} /> })}
    {itemsOf('galhos').map(item => { const [x, y] = item.position; return <path key={item.id} d={`M ${point(Math.sign(x) * .35, 1.6 + (y - 1.7) * .25)} Q ${point(x * .4, y + .4)} ${point(x, y)}`} /> })}
    {itemsOf('frutos').map(item => <circle key={item.id} cx={item.position[0]} cy={-item.position[1]} r=".22" className={item.accent ? `accent-${item.accent}` : ''} />)}
  </svg>
}
