import { useState } from 'react'
import { Ban, Check, Tv } from 'lucide-react'
import { campaigns, logoOf } from '../../data/campaigns'
import { banners, digitalAssets, digitalLabels, type BannerFormat } from '../../data/digitalCommunication'
import { base, DemoLabel, Segmented } from './DigitalShared'

type Mode = 'adequado' | 'inadequado'
const campaign = campaigns.find(item => item.id === digitalAssets.bannerCampaign)!

/**
 * Didactic banner with the OFFICIAL campaign logo and the OFFICIAL Gazin logo (files untouched;
 * the "inadequate" version distorts them on screen only). Product, message and values are
 * placeholders, never a real offer.
 */
function Banner({ format, mode, steps }: { format: BannerFormat['id']; mode: Mode; steps: boolean }) {
  const logo = logoOf(campaign.id)!
  const { piece } = banners
  return <div className={`dg-banner is-${format} is-${mode} ${steps ? 'show-steps' : ''}`}>
    <span className="dg-banner-id" data-step="1">
      <img className="dg-banner-campaign" src={`${base}${logo.preview}`} width={logo.previewWidth} height={logo.previewHeight} alt="" draggable={false} />
      <img className="dg-banner-gazin" src={`${base}${digitalAssets.logo.src}`} width={digitalAssets.logo.width} height={digitalAssets.logo.height} alt="" draggable={false} />
    </span>
    <span className="dg-banner-title" data-step="2">{piece.title}</span>
    <span className="dg-banner-product" data-step="3"><Tv strokeWidth={1.1} /><small>{piece.product}</small></span>
    <span className="dg-banner-price" data-step="4"><small>à vista</small>{piece.price}<small>{piece.terms}</small></span>
    <span className="dg-banner-cta" data-step="5">{piece.cta}</span>
    {mode === 'inadequado' && <span className="dg-banner-noise">{['Oferta!', 'Imperdível', 'Só hoje', 'Novo', 'Corra!'].map(word => <i key={word}>{word}</i>)}</span>}
  </div>
}

/** 06.3: formats + adequate × inadequate composition, with the hierarchy markers. */
export function DigitalBannerComparison() {
  const [format, setFormat] = useState<BannerFormat['id']>('horizontal')
  const [mode, setMode] = useState<Mode>('adequado')
  const [steps, setSteps] = useState(true)
  const label = banners.formats.find(item => item.id === format)!.label
  const good = mode === 'adequado'
  return <div className="dg-banners">
    <Segmented label="Formato do banner" value={format} onChange={setFormat} options={banners.formats.map(item => ({ id: item.id, label: item.label }))} />
    <div className={`dg-banner-stage is-${format}`} role="img" aria-label={`Banner demonstrativo ${label.toLowerCase()}, composição ${mode}, com a logo da campanha ${campaign.name} e a logo Gazin.`}>
      <Banner format={format} mode={mode} steps={steps} />
      {!good && <span className="vi-wrong-stamp" aria-hidden="true">Não utilizar</span>}
    </div>
    <div className="dg-banner-controls">
      <Segmented className="is-compare" label="Composição" value={mode} onChange={setMode} options={[
        { id: 'adequado', label: <><Check size={14} aria-hidden="true" />Adequado</> },
        { id: 'inadequado', label: <><Ban size={14} aria-hidden="true" />Inadequado</> },
      ]} />
      <label className="dg-switch"><input type="checkbox" checked={steps} onChange={event => setSteps(event.target.checked)} /><span aria-hidden="true" />Mostrar hierarquia</label>
    </div>
    <div className="dg-banner-info">
      <ol className={`dg-steps ${steps ? 'is-on' : ''}`}>{banners.hierarchy.map((item, index) => <li key={item}><b>{index + 1}</b>{item}</li>)}</ol>
      <ul className={`dg-criteria ${good ? 'is-good' : 'is-bad'}`} aria-live="polite">{banners.criteria.map(item => <li key={item.good}>
        {good ? <Check size={14} aria-hidden="true" /> : <Ban size={14} aria-hidden="true" />}{good ? item.good : item.bad}
      </li>)}</ul>
    </div>
    <p className="dg-muted">{banners.hierarchyNote} {banners.formatsNote}</p>
    <DemoLabel>{digitalLabels.demo}: logo oficial da campanha {campaign.name} (capítulo Campanhas) e logo Gazin. Mensagem, produto e valores são ilustrativos. A versão inadequada existe só na tela.</DemoLabel>
  </div>
}
