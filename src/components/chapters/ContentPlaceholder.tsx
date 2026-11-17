import type { LucideIcon } from 'lucide-react'
import {
  AlignLeft, BadgeCheck, CaseSensitive, ChartNoAxesColumn, CircleCheck, Columns2, FileText, Grid3x3, Images, LayoutTemplate,
  Monitor, Palette, Play, Printer, Quote, Shapes, Smartphone, Tags, Workflow, ImagePlus, Hexagon,
} from 'lucide-react'
import { placeholderCopy, type ContentKind } from '../../data/brandChapters'

const icons: Record<ContentKind, LucideIcon> = {
  text: AlignLeft, keywords: Tags, infographic: ChartNoAxesColumn, quote: Quote, comparison: Columns2,
  logo: Hexagon, colors: Palette, typography: CaseSensitive, grid: Grid3x3, graphics: Shapes, 'do-dont': CircleCheck,
  gallery: Images, video: Play, mockup: LayoutTemplate, devices: Smartphone, print: Printer, document: FileText,
  flow: Workflow, brand: BadgeCheck, example: ImagePlus,
}

/** Abstract silhouette of the expected material, so editors see the slot's shape at a glance. */
function Art({ kind }: { kind: ContentKind }) {
  switch (kind) {
    case 'text': return <span className="ph-lines"><i /><i /><i /><i /></span>
    case 'keywords': return <span className="ph-chips"><i /><i /><i /><i /><i /></span>
    case 'infographic': return <span className="ph-bars"><i /><i /><i /><i /><i /></span>
    case 'quote': return <span className="ph-quote"><Quote aria-hidden="true" /><i /><i /></span>
    case 'comparison': case 'do-dont': return <span className="ph-split"><i data-tag={kind === 'do-dont' ? 'Correto' : 'A'} /><i data-tag={kind === 'do-dont' ? 'Incorreto' : 'B'} /></span>
    case 'colors': return <span className="ph-swatches"><i /><i /><i /><i /><i /><i /></span>
    case 'typography': return <span className="ph-type">Aa<i /></span>
    case 'grid': case 'graphics': return <span className={kind === 'grid' ? 'ph-grid' : 'ph-shapes'}><i /><i /><i /></span>
    case 'gallery': return <span className="ph-gallery"><i /><i /><i /></span>
    case 'video': return <span className="ph-video"><Play aria-hidden="true" /></span>
    case 'devices': return <span className="ph-devices"><Monitor aria-hidden="true" /><Smartphone aria-hidden="true" /></span>
    case 'flow': return <span className="ph-flow"><i /><i /><i /><i /></span>
    case 'document': case 'print': return <span className="ph-doc"><i /><i /></span>
    default: return <span className="ph-frame" />
  }
}

/**
 * Reserved slot for future official material. Deliberately looks unfinished
 * (dashed outline, hatch, "Espaço reservado" tag) so it is never read as a guideline.
 */
export function ContentPlaceholder({ kind, label, compact = false }: { kind: ContentKind; label?: string; compact?: boolean }) {
  const Icon = icons[kind]
  const text = label ?? placeholderCopy.kinds[kind]
  return <figure className={`content-placeholder ${compact ? 'is-compact' : ''}`} data-placeholder={kind}>
    <span className="ph-art" aria-hidden="true"><Art kind={kind} /></span>
    <figcaption><Icon size={14} aria-hidden="true" />{text}</figcaption>
  </figure>
}
