import { useCallback, useEffect, useRef, useState } from 'react'
import { MousePointerClick } from 'lucide-react'
import { treeIntro, treeItems, type TreeRegionId } from '../data/successTree'
import { treeState } from '../components/tree/treeState'
import { TreeFallback, TreeInfoPanel, TreeLabels, TreeNavigation } from '../components/tree/TreeInterface'
import type { TreeScene } from '../components/tree/SuccessTreeScene'
import '../styles/tree.css'

/**
 * Árvore da Jornada de Sucesso — closes the Essência category, right after Nossa História.
 * The 3D scene (src/components/tree/SuccessTreeScene.ts) is created when the section comes
 * near; its formation follows the scroll (src/motion/TreeAnimations.ts). Texts live in
 * src/data/successTree.ts.
 */
export function SuccessTree({ reduced }: { reduced: boolean }) {
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const scene = useRef<TreeScene | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading')
  const [region, setRegion] = useState<TreeRegionId | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [formed, setFormed] = useState(() => treeState.progress > .92)

  const select = useCallback((id: string) => {
    const item = treeItems.find(entry => entry.id === id)
    if (!item) return
    setRegion(item.region)
    setSelected(id)
  }, [])
  const chooseRegion = useCallback((id: TreeRegionId) => { setSelected(null); setRegion(id) }, [])
  const overview = useCallback(() => { setSelected(null); setRegion(null); scene.current?.resetCamera() }, [])
  const hover = useCallback((id: string | null) => scene.current?.hover(id), [])

  // Exploration opens once the tree is complete; scrolling back up returns to the overview.
  useEffect(() => {
    const update = () => setFormed(treeState.progress > .92)
    update()
    addEventListener('tree:progress', update)
    return () => removeEventListener('tree:progress', update)
  }, [])
  useEffect(() => { if (!formed) { setRegion(null); setSelected(null) } }, [formed])

  // One WebGL context, created only when the section approaches and released on unmount.
  useEffect(() => {
    const root = section.current!
    let disposed = false
    let created: TreeScene | undefined
    setStatus('loading')
    const start = () => {
      void import('../components/tree/SuccessTreeScene').then(module => {
        if (disposed) return
        try {
          created = module.createTreeScene({
            canvas: canvas.current!, root, stage: stage.current!, reduced,
            onSelect: select,
            onFailure: () => { if (!disposed) setStatus('failed') },
          })
          scene.current = created
          setStatus('ready')
        } catch { setStatus('failed') }
      }).catch(() => { if (!disposed) setStatus('failed') })
    }
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); start() } }, { rootMargin: '120% 0px' })
    observer.observe(root)
    return () => { disposed = true; observer.disconnect(); created?.dispose(); scene.current = null }
  }, [reduced, select])

  const panelOpen = !!region
  useEffect(() => { scene.current?.setView({ region, selected, panelOpen }) }, [region, selected, panelOpen, status])

  // Escape steps back (element → region → overview), wherever the focus is.
  useEffect(() => {
    if (!region) return
    const onKey = (event: KeyboardEvent) => {
      // An open modal (menu, photo viewer) handles its own Escape.
      if (event.key !== 'Escape' || event.defaultPrevented || document.querySelector('[role="dialog"][aria-modal="true"]:not([hidden])')) return
      event.preventDefault()
      if (selected) setSelected(null)
      else overview()
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [region, selected, overview])

  const item = selected ? treeItems.find(entry => entry.id === selected) ?? null : null
  return <section ref={section} id="arvore" className="success-tree blue-section" aria-labelledby="tree-title" data-status={status} data-region={region ?? 'overview'}>
    <div className="tree-pin">
      <header className="tree-head" data-overlay={region ? 'off' : 'on'}>
        <p className="tree-eyebrow"><span aria-hidden="true" />{treeIntro.eyebrow}</p>
        <h2 id="tree-title" className="tree-title">{treeIntro.title}</h2>
        <p className="tree-concept">{treeIntro.concept}</p>
        <p className="tree-text">{treeIntro.text}</p>
        <p className="tree-hint"><MousePointerClick size={16} aria-hidden="true" />{treeIntro.hint}</p>
      </header>

      <div ref={stage} className="tree-stage">
        <div className="tree-atmosphere" aria-hidden="true" />
        <TreeFallback />
        <canvas ref={canvas} className="tree-canvas" aria-hidden="true" />
        <TreeLabels onSelect={select} onRegion={chooseRegion} onHover={hover} />
      </div>

      <TreeNavigation region={region} ready={formed} onRegion={chooseRegion} onOverview={overview} />
      {region && <TreeInfoPanel region={region} selected={item} onSelect={select} onBack={() => setSelected(null)} onClose={overview} onHover={hover} />}
    </div>

    <div className="tree-closing">
      <p className="tree-eyebrow"><span aria-hidden="true" />{treeIntro.closingEyebrow}</p>
      <p className="tree-closing-title">{treeIntro.closing}</p>
      <p className="tree-closing-text">{treeIntro.closingText}</p>
    </div>
  </section>
}
