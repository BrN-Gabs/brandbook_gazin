import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { Download, ImageOff, X } from 'lucide-react'
import { campaigns, library, logoOf, months, pagePreviewOf, type Campaign } from '../../data/campaigns'

export const base = import.meta.env.BASE_URL
export const categoryLabel = (campaign: Campaign) => campaign.category === 'institucional' ? 'Institucional' : campaign.kind === 'recorrente' ? 'Promocional · recorrente' : 'Promocional · sazonal'
export const whenLabel = (campaign: Campaign) => campaign.month ? `${months[campaign.month - 1]} · ${campaign.period}` : campaign.period
const mb = (bytes: number) => `${(bytes / 1048576).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB`

/** Logo exactly as supplied (light preview of the original file), or the calendar page when there is no logo. */
export function CampaignArt({ campaign, className = '' }: { campaign: Campaign; className?: string }) {
  const logo = logoOf(campaign.id)
  if (logo) return <img className={`cp-logo ${className}`} src={`${base}${logo.preview}`} width={logo.previewWidth} height={logo.previewHeight} alt={`Logo da campanha ${campaign.name}`} loading="lazy" decoding="async" draggable={false} />
  const page = pagePreviewOf(campaign.id)
  if (page) return <img className={`cp-page ${className}`} src={`${base}${page.path}`} width={page.width} height={page.height} alt={`Identidade ${campaign.name} no calendário 2027`} loading="lazy" decoding="async" />
  return <span className="cp-missing"><ImageOff size={22} aria-hidden="true" />{library.unavailable}</span>
}

/** Download of the original file, or the honest "not available" state (never a fake button). */
export function LogoDownload({ campaign, compact = false }: { campaign: Campaign; compact?: boolean }) {
  const logo = logoOf(campaign.id)
  if (!logo) return <span className="cp-unavailable">{library.unavailable}</span>
  return <a className={`cp-download ${compact ? 'is-compact' : ''}`} href={`${base}${encodeURI(logo.path)}`} download={logo.file} type="image/png" aria-label={`Baixar logo ${campaign.name} (PNG, ${mb(logo.bytes)})`}>
    <Download size={15} aria-hidden="true" />Baixar logo{!compact && <small>PNG · {logo.width}×{logo.height} · {mb(logo.bytes)}</small>}
  </a>
}

type Open = (id: string) => void
const ViewerContext = createContext<Open>(() => {})
export const useCampaignViewer = () => useContext(ViewerContext)

/** One details panel for the whole chapter (native <dialog>: Escape, backdrop and focus return). */
export function CampaignViewerProvider({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const [id, setId] = useState<string | null>(null)
  const open = useCallback<Open>(next => { opener.current = document.activeElement as HTMLElement | null; setId(next) }, [])
  useEffect(() => {
    if (!id || !dialog.current || dialog.current.open) return
    dialog.current.showModal()
    window.dispatchEvent(new CustomEvent('brandbook:scroll-lock', { detail: true }))
  }, [id])
  const onClose = () => {
    window.dispatchEvent(new CustomEvent('brandbook:scroll-lock', { detail: false }))
    setId(null)
    opener.current?.focus({ preventScroll: true })
  }
  const campaign = campaigns.find(item => item.id === id)
  const logo = campaign && logoOf(campaign.id)
  const page = campaign && pagePreviewOf(`pagina-${campaign.page}`)
  return <ViewerContext.Provider value={open}>
    {children}
    <dialog ref={dialog} className="cp-viewer" aria-labelledby="cp-viewer-title" onClose={onClose} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close() }}>
      {campaign && <div className="cp-viewer-grid" data-lenis-prevent>
        <div className="cp-viewer-art"><CampaignArt campaign={campaign} /></div>
        <div className="cp-viewer-info">
          <p className="cp-kicker">{categoryLabel(campaign)}</p>
          <h3 id="cp-viewer-title">{campaign.name}</h3>
          <dl className="cp-facts">
            <div><dt>Período 2027</dt><dd>{whenLabel(campaign)}</dd></div>
            <div><dt>Conceito</dt><dd>{campaign.description}</dd></div>
            {campaign.note && <div><dt>Observação</dt><dd>{campaign.note}</dd></div>}
            <div><dt>Referência</dt><dd>Calendário 2027 · pág. {campaign.page}</dd></div>
          </dl>
          <div className="cp-viewer-downloads">
            <p className="cp-kicker">Downloads</p>
            <LogoDownload campaign={campaign} />
            {logo && <p className="cp-muted">Arquivo original, sem alterações. Formato disponível: PNG com transparência.</p>}
          </div>
          {page && <figure className="cp-viewer-page">
            <img src={`${base}${page.path}`} width={page.width} height={page.height} alt={`Página ${campaign.page} do calendário 2027, onde a campanha aparece`} loading="lazy" decoding="async" />
            <figcaption>Aplicação no calendário 2027 · pág. {campaign.page}</figcaption>
          </figure>}
        </div>
      </div>}
      <button type="button" className="cp-viewer-close" onClick={() => dialog.current?.close()} aria-label="Fechar detalhes da campanha"><X size={20} aria-hidden="true" /></button>
    </dialog>
  </ViewerContext.Provider>
}
