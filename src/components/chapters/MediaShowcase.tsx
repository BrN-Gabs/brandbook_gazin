import type { ContentKind, MediaItem } from '../../data/brandChapters'
import { ContentPlaceholder } from './ContentPlaceholder'

const textual: ContentKind[] = ['text']

/**
 * Visual area of a subsection. Shows the real images/videos once they exist in the
 * data (brandChapters.ts → content.media); until then, one placeholder per expected kind.
 */
export function MediaShowcase({ media, kinds }: { media?: MediaItem[]; kinds: ContentKind[] }) {
  if (media?.length) {
    const base = import.meta.env.BASE_URL
    const resolve = (src: string) => /^(https?:)?\/\//.test(src) ? src : `${base}${src.replace(/^\//, '')}`
    return <div className={`media-showcase media-count-${Math.min(media.length, 4)}`}>
      {media.map(item => <figure key={item.src} className="media-item">
        {item.type === 'video'
          ? <video src={resolve(item.src)} poster={item.poster && resolve(item.poster)} controls preload="metadata" aria-label={item.alt} />
          : <img src={resolve(item.src)} alt={item.alt} loading="lazy" decoding="async" />}
        {item.caption && <figcaption>{item.caption}</figcaption>}
      </figure>)}
    </div>
  }
  const visual = kinds.filter(kind => !textual.includes(kind))
  if (!visual.length) return null
  return <div className={`media-showcase media-count-${visual.length}`}>
    {visual.map(kind => <ContentPlaceholder key={kind} kind={kind} />)}
  </div>
}
