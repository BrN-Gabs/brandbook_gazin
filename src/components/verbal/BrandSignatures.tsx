import { BadgeCheck, BookOpen } from 'lucide-react'
import { signatures } from '../../data/verbalIdentity'

const base = import.meta.env.BASE_URL

/**
 * 03.3 · the documented slogan (with the official logo file, untouched) and, clearly
 * separated, the editorial title of this Manual da Marca, which does not replace it.
 */
export function BrandSignatures() {
  const { slogan, editorialTitle } = signatures
  return <div className="vb-signatures">
    <figure className="vb-slogan" data-vb-reveal>
      <p className="vb-status is-official"><BadgeCheck size={15} aria-hidden="true" />{slogan.status}</p>
      <blockquote className="vb-slogan-quote"><span className="vb-quote-mark" aria-hidden="true">“</span><p>{slogan.text}</p></blockquote>
      <div className="vb-slogan-grid">
        <div className="vb-slogan-meaning">
          <p className="vb-kicker">{slogan.meaningLabel}</p>
          <p>{slogan.meaning}</p>
          <p className="vb-muted">{slogan.rule}</p>
        </div>
        <div className="vb-slogan-logo"><img src={`${base}${slogan.logo.src}`} alt={slogan.logo.alt} width={2974} height={1048} loading="lazy" decoding="async" /></div>
      </div>
    </figure>
    <figure className="vb-editorial-title" data-vb-reveal>
      <p className="vb-status"><BookOpen size={15} aria-hidden="true" />{editorialTitle.status}</p>
      <blockquote><p>{editorialTitle.text}</p></blockquote>
      <figcaption className="vb-muted">{editorialTitle.note}</figcaption>
    </figure>
  </div>
}
