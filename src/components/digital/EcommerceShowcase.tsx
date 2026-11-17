import { useRef, useState } from 'react'
import { ArrowLeft, BedDouble, Refrigerator, Search, ShoppingBag, Smartphone, Sofa, Tv, WashingMachine, type LucideIcon } from 'lucide-react'
import { digitalAssets, digitalLabels, ecommerce, type DemoProduct } from '../../data/digitalCommunication'
import { base, DemoLabel, Segmented } from './DigitalShared'

type View = 'vitrine' | 'produto'
const icons: Record<DemoProduct['icon'], LucideIcon> = { tv: Tv, refrigerator: Refrigerator, washer: WashingMachine, sofa: Sofa, smartphone: Smartphone, bed: BedDouble }
const shots = ['is-front', 'is-side', 'is-detail']

/**
 * 06.4: a design guide, not a store. The showcase cards really open the product page and the
 * gallery really switches views; the buy button is an illustration (no checkout). Products,
 * values and conditions are fictitious and labelled as such.
 */
export function EcommerceShowcase() {
  const [view, setView] = useState<View>('vitrine')
  const [productId, setProductId] = useState(ecommerce.products[0].id)
  const [shot, setShot] = useState('0')
  const screen = useRef<HTMLDivElement>(null)
  const product = ecommerce.products.find(item => item.id === productId)!
  const Icon = icons[product.icon]
  const focusScreen = () => requestAnimationFrame(() => screen.current?.querySelector<HTMLElement>('h4, [data-focus]')?.focus({ preventScroll: true }))
  const open = (id: string) => { setProductId(id); setShot('0'); setView('produto'); focusScreen() }
  const back = () => { setView('vitrine'); focusScreen() }

  return <div className="dg-shop">
    <Segmented label="Experiência de compra" value={view} onChange={setView} options={[{ id: 'vitrine', label: 'Vitrine' }, { id: 'produto', label: 'Página de produto' }]} />
    <div className="dg-shop-window">
      <div className="dg-shop-chrome" aria-hidden="true"><i /><i /><i /><span>Demonstração · loja virtual</span></div>
      <div className="dg-shop-head" aria-hidden="true">
        <img src={`${base}${digitalAssets.logo.src}`} width={digitalAssets.logo.width} height={digitalAssets.logo.height} alt="" />
        <span className="dg-shop-search"><Search size={13} />Buscar produtos</span>
        <ShoppingBag size={18} />
      </div>
      <div className="dg-shop-screen" ref={screen} key={view}>
        {view === 'vitrine'
          ? <div className="dg-shop-showcase">
            <p className="dg-shop-crumb" data-focus tabIndex={-1}>Vitrine · {ecommerce.products.length} produtos demonstrativos</p>
            <ul className="dg-shop-grid">{ecommerce.products.map(item => {
              const ItemIcon = icons[item.icon]
              return <li key={item.id}><button type="button" onClick={() => open(item.id)} aria-label={`Ver produto: ${item.name} (demonstrativo)`}>
                <span className="dg-shop-photo"><ItemIcon strokeWidth={1.1} aria-hidden="true" /></span>
                <span className="dg-shop-name">{item.name}</span>
                <span className="dg-shop-price">{ecommerce.price}<small>{ecommerce.installments}</small></span>
                <span className="dg-shop-more" aria-hidden="true">Ver produto</span>
              </button></li>
            })}</ul>
          </div>
          : <div className="dg-shop-product">
            <div className="dg-shop-gallery">
              <span className={`dg-shop-main ${shots[Number(shot)]}`} role="img" aria-label={`${product.name} · ${ecommerce.views[Number(shot)].toLowerCase()} (ilustração)`}><Icon strokeWidth={1} aria-hidden="true" /></span>
              <Segmented className="dg-shop-thumbs" label="Imagens do produto" value={shot} onChange={setShot} options={ecommerce.views.map((name, index) => ({ id: String(index), title: name, label: <><span className={`dg-shop-thumb ${shots[index]}`}><Icon strokeWidth={1.3} aria-hidden="true" /></span><span className="pos-sr-only">{name}</span></> }))} />
            </div>
            <div className="dg-shop-details">
              <button type="button" className="dg-shop-back" onClick={back}><ArrowLeft size={14} aria-hidden="true" />Voltar à vitrine</button>
              <h4 tabIndex={-1}>{product.name} <small>· produto demonstrativo</small></h4>
              <p className="dg-shop-description">{ecommerce.description}</p>
              <p className="dg-shop-big-price">{ecommerce.price}<small>{ecommerce.installments} · condições demonstrativas</small></p>
              <span className="dg-shop-buy" aria-hidden="true">Comprar</span>
              <dl className="dg-shop-specs">{ecommerce.specs.map(spec => <div key={spec}><dt>{spec}</dt><dd>{ecommerce.specValue}</dd></div>)}</dl>
            </div>
          </div>}
      </div>
    </div>
    <div className="dg-shop-info">
      <p className="dg-kicker">Hierarquia · {view === 'vitrine' ? 'vitrine' : 'página de produto'}</p>
      <ol className="dg-steps is-on" aria-live="polite">{ecommerce.hierarchy[view].map((item, index) => <li key={item}><b>{index + 1}</b>{item}</li>)}</ol>
    </div>
    <DemoLabel>{digitalLabels.fictional}. As imagens são ilustrações; descrição proposta em Identidade Verbal (Exemplos de aplicação). Não é uma loja: não há compra.</DemoLabel>
  </div>
}
