import { useLayoutEffect, useRef, useState } from 'react'
import { Menu, Monitor, Smartphone, Tablet } from 'lucide-react'
import { brandChapters } from '../../data/brandChapters'
import { digitalAssets, web, type Device } from '../../data/digitalCommunication'
import { base, DemoLabel, Segmented } from './DigitalShared'

const icons = { desktop: Monitor, tablet: Tablet, mobile: Smartphone }
const chapters = brandChapters.slice(0, 6)

/**
 * Simplified preview of THIS Manual (real titles, real logo). It is laid out at the device's real
 * width and scaled down to fit: the reflow comes from container queries on its own width, not
 * from swapping images.
 */
function MiniSite() {
  const { preview } = web
  const { logo } = digitalAssets
  return <div className="dg-site" aria-hidden="true">
    <div className="dg-site-bar">
      <img src={`${base}${logo.src}`} width={logo.width} height={logo.height} alt="" />
      <span className="dg-site-nav">{preview.nav.map(item => <span key={item}>{item}</span>)}</span>
      <span className="dg-site-burger"><Menu size={26} /></span>
    </div>
    <div className="dg-site-hero">
      <div className="dg-site-copy">
        <span className="dg-site-eyebrow">{preview.eyebrow}</span>
        <span className="dg-site-title">{preview.title}</span>
        <span className="dg-site-subtitle">{preview.subtitle}</span>
        <span className="dg-site-actions"><span>Explorar capítulos</span><span>Nossa história</span></span>
      </div>
      <span className="dg-site-visual"><svg viewBox="0 0 200 200">
        {Array.from({ length: 9 }, (_, index) => {
          const y = 22 + index * 20, x = 100 + Math.sin(index * .8) * 54
          return <g key={index}><line x1={x} y1={y} x2={200 - x} y2={y} /><circle cx={x} cy={y} r="6" /><circle cx={200 - x} cy={y} r="6" className="is-alt" /></g>
        })}
      </svg></span>
    </div>
    <div className="dg-site-grid">{chapters.map(chapter => <span key={chapter.id} className="dg-site-card"><b>{chapter.number}</b>{chapter.title}</span>)}</div>
  </div>
}

/** 06.2: Desktop / Tablet / Mobile, with what changes in each width. */
export function ResponsiveWebsitePreview() {
  const [deviceId, setDeviceId] = useState<Device['id']>('desktop')
  const stage = useRef<HTMLDivElement>(null)
  const [available, setAvailable] = useState(560)
  useLayoutEffect(() => {
    const element = stage.current
    if (!element) return
    const observer = new ResizeObserver(() => setAvailable(element.clientWidth))
    observer.observe(element)
    setAvailable(element.clientWidth)
    return () => observer.disconnect()
  }, [])
  const device = web.devices.find(item => item.id === deviceId)!
  const MAX_H = 400
  const scale = Math.min((available - 80) / device.width, MAX_H / device.height, 1)
  return <div className="dg-web">
    <Segmented label="Dispositivo" value={deviceId} onChange={setDeviceId} options={web.devices.map(item => {
      const Icon = icons[item.id]
      return { id: item.id, label: <><Icon size={15} aria-hidden="true" />{item.label}</> }
    })} />
    <div className="dg-web-stage" ref={stage}>
      <div className={`dg-device is-${deviceId}`} role="img" aria-label={`Prévia do Manual da Marca em ${device.label.toLowerCase()} (${device.width} px de largura): ${device.changes.join(' ')}`}>
        <div className="dg-device-box" style={{ width: device.width * scale, height: device.height * scale }}>
          <div className="dg-device-screen" style={{ width: device.width, height: device.height, transform: `scale(${scale})` }}><MiniSite /></div>
        </div>
        {deviceId === 'desktop' && <span className="dg-device-stand" aria-hidden="true" />}
      </div>
    </div>
    <div className="dg-web-info">
      <p className="dg-kicker">{device.label} · {device.width} px</p>
      <ul className="dg-changes" aria-live="polite">{device.changes.map(change => <li key={change}>{change}</li>)}</ul>
    </div>
    <p className="dg-muted">{web.brandbook}</p>
    <DemoLabel>{web.previewNote}</DemoLabel>
  </div>
}
