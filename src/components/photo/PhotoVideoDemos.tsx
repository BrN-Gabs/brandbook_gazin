import { useState, type CSSProperties, type ReactNode } from 'react'
import { Check, Clapperboard, Pause, Play, X } from 'lucide-react'
import { audiovisual, framing, lighting, motionEditing, pvLabels, style, type Topic } from '../../data/photoVideo'
import { photoSrc, ZoomablePhoto } from './PhotographyLightbox'

const base = import.meta.env.BASE_URL

export function Topics({ items }: { items: Topic[] }) {
  return <dl className="pv-topics">{items.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.text}</dd></div>)}</dl>
}
export function Checklist({ title, items, kind }: { title: string; items: string[]; kind: 'do' | 'avoid' }) {
  return <section className={`pv-checklist is-${kind}`} aria-label={title}>
    <p className="pv-kicker">{kind === 'do' ? <Check size={14} aria-hidden="true" /> : <X size={14} aria-hidden="true" />}{title}</p>
    <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>
  </section>
}
/** Two-option switch (radiogroup): the label, not only the colour, says which is active. */
function Segmented<T extends string>({ label, options, value, onChange }: { label: string; options: { id: T; label: ReactNode }[]; value: T; onChange: (value: T) => void }) {
  return <div className="pv-segmented" role="radiogroup" aria-label={label}>
    {options.map(option => <button key={option.id} type="button" role="radio" aria-checked={value === option.id} onClick={() => onChange(option.id)}>{option.label}</button>)}
  </div>
}

// ── 04.1 ───────────────────────────────────────────────────────────────────────────────
/** Main photo in highlight, interactive traits, thumbnails that swap the photo. */
export function PhotographyStyle() {
  const [trait, setTrait] = useState(0)
  const [photoIndex, setPhotoIndex] = useState(0)
  const photo = style.gallery[photoIndex]
  return <div className="pv-style">
    <div className="pv-style-media">
      <ZoomablePhoto photo={photo} caption="Estilo fotográfico" className="pv-feature" />
      <div className="pv-thumbs" role="group" aria-label="Outras fotografias de referência">
        {style.gallery.map((item, index) => <button key={item.src} type="button" aria-pressed={photoIndex === index} onClick={() => setPhotoIndex(index)} aria-label={`Mostrar: ${item.alt}`}>
          <img src={photoSrc(item)} alt="" width={item.width} height={item.height} loading="lazy" decoding="async" />
        </button>)}
      </div>
      <p className="pv-credit">{photo.credit}</p>
    </div>
    <div className="pv-style-info">
      <div className="pv-chips" role="group" aria-label="Características do estilo fotográfico">
        {style.traits.map((item, index) => <button key={item.title} type="button" aria-pressed={trait === index} aria-controls="pv-trait-detail" onClick={() => setTrait(index)}>{item.title}</button>)}
      </div>
      <p id="pv-trait-detail" className="pv-trait" aria-live="polite" key={trait}><b>{style.traits[trait].title}</b>{style.traits[trait].text}</p>
      <div className="pv-columns">
        <Checklist title="Fotografias recomendadas" items={style.recommended} kind="do" />
        <Checklist title="Evitar" items={style.avoid} kind="avoid" />
      </div>
    </div>
  </div>
}

// ── 04.2 ───────────────────────────────────────────────────────────────────────────────
/** PLANO ABERTO | PLANO MÉDIO | CLOSE-UP viewer + adequate / inadequate composition. */
export function FramingShowcase() {
  const [shotId, setShotId] = useState(framing.shots[1].id)
  const shot = framing.shots.find(item => item.id === shotId)!
  const [mode, setMode] = useState<'good' | 'bad'>('good')
  const { composition } = framing
  const current = composition[mode]
  return <div className="pv-framing">
    <div className="pv-viewer">
      <Segmented label="Tipo de enquadramento" value={shotId} onChange={setShotId} options={framing.shots.map(item => ({ id: item.id, label: item.label }))} />
      <div className="pv-viewer-stage" key={shot.id}>
        <ZoomablePhoto photo={shot.photo} caption={shot.label} className="pv-viewer-photo" />
      </div>
      <div className="pv-viewer-info" aria-live="polite">
        <p><b>{shot.label}.</b> {shot.text}</p>
        <p className="pv-uses">{shot.uses.map(use => <span key={use}>{use}</span>)}</p>
        <p className="pv-credit">{shot.photo.credit}{shot.note ? ` · ${shot.note}` : ''}</p>
      </div>
    </div>
    <div className="pv-composition">
      <Segmented label="Exemplo de composição" value={mode} onChange={setMode} options={[
        { id: 'good', label: <><Check size={14} aria-hidden="true" />Adequada</> },
        { id: 'bad', label: <><X size={14} aria-hidden="true" />Inadequada</> },
      ]} />
      <figure className={`pv-composition-frame is-${mode}`}>
        <img src={photoSrc(composition.photo)} width={composition.photo.width} height={composition.photo.height}
          alt={mode === 'good' ? composition.photo.alt : 'A mesma fotografia mal enquadrada: cabeça cortada, pessoa na borda e braços fora do quadro'} loading="lazy" decoding="async" />
        {mode === 'good' && <span className="pv-thirds" aria-hidden="true" />}
        <span className={`pv-badge is-${mode}`} aria-hidden="true">{mode === 'good' ? <Check size={14} /> : <X size={14} />}{current.label}</span>
      </figure>
      <div aria-live="polite">
        <ul className={`pv-points is-${mode}`}>{current.points.map(point => <li key={point}>{point}</li>)}</ul>
        <p className="pv-credit">{pvLabels.didactic}: {composition.note}</p>
      </div>
    </div>
    <Checklist title="Recomendações de composição" items={framing.rules} kind="do" />
  </div>
}

// ── 04.3 ───────────────────────────────────────────────────────────────────────────────
/** Before / After with a draggable divider (a range input: mouse, touch and keyboard). */
export function ImageTreatmentComparison() {
  const [split, setSplit] = useState(50)
  const { comparison } = lighting
  return <figure className="pv-compare" style={{ '--split': `${split}%` } as CSSProperties}>
    <div className="pv-compare-stage">
      <img src={photoSrc(comparison.after)} width={comparison.after.width} height={comparison.after.height} alt={comparison.after.alt} loading="lazy" decoding="async" />
      <img className="pv-compare-before" src={photoSrc(comparison.before)} width={comparison.before.width} height={comparison.before.height} alt={comparison.before.alt} loading="lazy" decoding="async" />
      <span className="pv-compare-divider" aria-hidden="true"><span /></span>
      <span className="pv-compare-tag is-before" aria-hidden="true">Original</span>
      <span className="pv-compare-tag is-after" aria-hidden="true">Tratada</span>
      <input type="range" min={0} max={100} value={split} onChange={event => setSplit(Number(event.target.value))}
        aria-label="Divisor entre a imagem original (esquerda) e a tratada (direita)" aria-valuetext={`${split}% original`} />
    </div>
    <figcaption className="pv-compare-legend">
      <p><b>{comparison.beforeLabel}</b>{comparison.beforeText}</p>
      <p><b>{comparison.afterLabel}</b>{comparison.afterText}</p>
      <p className="pv-credit">{pvLabels.demo} · as duas versões partem do mesmo arquivo.</p>
    </figcaption>
  </figure>
}

// ── 04.4 ───────────────────────────────────────────────────────────────────────────────
/** Storyboard of demonstration frames; the player only appears when a real video exists. */
export function AudiovisualDirection() {
  const { video, storyboard } = audiovisual
  return <div className="pv-audiovisual">
    {video.src
      ? <video className="pv-video" controls preload="none" poster={video.poster ? `${base}${video.poster}` : undefined} aria-label={video.title}>
        <source src={`${base}${video.src}`} type="video/mp4" />
        {video.captions && <track kind="captions" src={`${base}${video.captions}`} srcLang="pt-BR" label="Português" default />}
      </video>
      : <p className="pv-placeholder-note"><Clapperboard size={16} aria-hidden="true" />Espaço para o vídeo institucional de referência. Enquanto não houver vídeo oficial, o storyboard abaixo demonstra a narrativa.</p>}
    <ol className="pv-storyboard">
      {storyboard.map((frame, index) => <li key={frame.id}>
        <ZoomablePhoto photo={frame.photo} caption={frame.title} className="pv-frame" />
        <p className="pv-frame-act">{String(index + 1).padStart(2, '0')} · {frame.act}</p>
        <p className="pv-frame-title">{frame.title}</p>
        <p className="pv-frame-text">{frame.text}</p>
      </li>)}
    </ol>
    <p className="pv-credit">Storyboard com fotografias demonstrativas e fotografias de loja do Manual de Merchandising.</p>
    <Topics items={audiovisual.guidelines} />
  </div>
}

// ── 04.5 ───────────────────────────────────────────────────────────────────────────────
/** Camera-movement simulations on still photos, clearly labelled; play/pause control. */
export function VideoMotionExamples() {
  const [playing, setPlaying] = useState(true)
  return <div className="pv-motion">
    <div className="pv-simulations" data-playing={playing}>
      {motionEditing.simulations.map(simulation => <figure key={simulation.id} className={`pv-simulation is-${simulation.id}`}>
        <div className="pv-simulation-frame">
          <img src={photoSrc(simulation.photo)} width={simulation.photo.width} height={simulation.photo.height} alt={simulation.photo.alt} loading="lazy" decoding="async" />
          <span className="pv-rec" aria-hidden="true">Simulação</span>
        </div>
        <figcaption><b>{simulation.label}</b>{simulation.text}</figcaption>
      </figure>)}
    </div>
    <div className="pv-motion-bar">
      <button type="button" className="pv-play" onClick={() => setPlaying(value => !value)} aria-pressed={!playing}>
        {playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}{playing ? 'Pausar simulações' : 'Retomar simulações'}
      </button>
      <p className="pv-credit">{pvLabels.simulation}. Com animações reduzidas, as fotografias ficam paradas.</p>
    </div>
    <Topics items={motionEditing.movements} />
    <div className="pv-columns">
      <Checklist title="Na edição, priorizar" items={motionEditing.editing} kind="do" />
      <Checklist title="Evitar" items={motionEditing.avoid} kind="avoid" />
    </div>
  </div>
}

/** 04.3 complete demo: comparator + lighting topics + treatment and avoid lists. */
export function LightingDemo() {
  return <div className="pv-lighting">
    <ImageTreatmentComparison />
    <div className="pv-lighting-info">
      <Topics items={lighting.light} />
      <div className="pv-columns">
        <Checklist title="Tratamento, com moderação" items={lighting.treatment} kind="do" />
        <Checklist title="Evitar" items={lighting.avoid} kind="avoid" />
      </div>
    </div>
  </div>
}
