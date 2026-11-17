import { useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { digitalAssets, digitalLabels, social, type SocialFormat } from '../../data/digitalCommunication'
import { base, DemoLabel, Segmented } from './DigitalShared'

type FormatId = SocialFormat['id']

/**
 * Didactic post: demonstrative photo (chapter 04), the OFFICIAL Gazin logo (untouched) and the
 * social-media message proposed in chapter 03. The same pieces are recomposed for each format.
 * `data-step` marks the visual hierarchy (shown on demand).
 */
function SocialArt({ format, steps = false, thumb = false }: { format: FormatId; steps?: boolean; thumb?: boolean }) {
  const { photo, logo } = digitalAssets
  const { post } = social
  return <div className={`dg-post is-${format} ${steps ? 'show-steps' : ''} ${thumb ? 'is-thumb' : ''}`}>
    <span className="dg-post-photo" data-step="1"><img src={`${base}${photo.src}`} width={photo.width} height={photo.height} alt="" loading="lazy" decoding="async" draggable={false} /></span>
    <span className="dg-post-logo" data-step="3"><img src={`${base}${logo.src}`} width={logo.width} height={logo.height} alt="" draggable={false} /></span>
    <span className="dg-post-copy">
      <span className="dg-post-title" data-step="2">{post.title}</span>
      <span className="dg-post-text">{post.text}</span>
      <span className="dg-post-cta" data-step="4">{post.cta}</span>
    </span>
  </div>
}

const hierarchy = ['Imagem', 'Mensagem principal', 'Marca Gazin', 'Chamada para ação']

/** 06.1: format selector, phone mockup (no fake likes or metrics) and a small gallery. */
export function SocialShowcase() {
  const [format, setFormat] = useState<FormatId>('feed')
  const [steps, setSteps] = useState(false)
  const [run, setRun] = useState(0)
  const current = social.formats.find(item => item.id === format)!
  const fullScreen = format === 'story' || format === 'video'
  const describe = `${current.text} ${current.ratio}: fotografia, mensagem “${social.post.title}”, logo Gazin e chamada “${social.post.cta}”.`
  return <div className="dg-social">
    <Segmented label="Formato da publicação" value={format} onChange={setFormat} options={social.formats.map(item => ({ id: item.id, label: <>{item.label} <small>{item.ratio}</small></> }))} />
    <div className="dg-social-stage">
      <div className={`dg-phone ${fullScreen ? 'is-full' : ''}`} role="img" aria-label={`Smartphone exibindo a publicação demonstrativa no formato ${describe}`}>
        <span className="dg-phone-speaker" aria-hidden="true" />
        <div className="dg-phone-screen">
          {!fullScreen && <span className="dg-ui-bar" aria-hidden="true"><i /><i /></span>}
          <div className="dg-phone-art" style={{ aspectRatio: current.aspect }} key={format === 'video' ? `video-${run}` : format}>
            <SocialArt format={format} steps={steps} />
            {fullScreen && <>
              <span className="dg-safe is-top" aria-hidden="true">{social.safeArea}</span>
              <span className="dg-safe is-bottom" aria-hidden="true">{social.safeArea}</span>
            </>}
          </div>
          {!fullScreen && <span className="dg-ui-bar is-bottom" aria-hidden="true"><i /><i /><i /></span>}
        </div>
      </div>
      <div className="dg-social-info">
        <p className="dg-kicker">{current.text} · {current.ratio}</p>
        <p className="dg-note" aria-live="polite">{current.note}</p>
        <label className="dg-switch"><input type="checkbox" checked={steps} onChange={event => setSteps(event.target.checked)} /><span aria-hidden="true" />Mostrar hierarquia</label>
        <ol className={`dg-steps ${steps ? 'is-on' : ''}`}>{hierarchy.map((item, index) => <li key={item}><b>{index + 1}</b>{item}</li>)}</ol>
        {format === 'video' && <button type="button" className="dg-replay" onClick={() => setRun(value => value + 1)}><RotateCcw size={14} aria-hidden="true" />Reproduzir de novo</button>}
        <div className="dg-gallery" role="group" aria-label="Galeria: a mesma publicação nos quatro formatos">
          {social.formats.map(item => <button key={item.id} type="button" aria-pressed={format === item.id} aria-label={`Ver formato ${item.text} ${item.ratio}`} onClick={() => setFormat(item.id)}>
            <span className="dg-gallery-art" style={{ aspectRatio: item.aspect }}><SocialArt format={item.id} thumb /></span>
            <small>{item.label}</small>
          </button>)}
        </div>
      </div>
    </div>
    <p className="dg-muted">{social.formatsNote}</p>
    <DemoLabel>{digitalLabels.demo}: fotografia demonstrativa (Fotografia e Vídeo), mensagem proposta em Identidade Verbal (Exemplos de aplicação) e logo Gazin oficial.</DemoLabel>
  </div>
}
