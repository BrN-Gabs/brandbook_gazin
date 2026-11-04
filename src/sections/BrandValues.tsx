import { brandContent as content } from '../data/brandContent'

export function BrandValues() {
  return (
    <section id="valores" className="section-space bg-paper text-brand" aria-labelledby="values-title">
      <div className="page-container">
          <h2 id="values-title" className="section-pill">{content.values.title}</h2>
          <ul className="purpose-text brand-values pl-6 space-y-5">
            {content.values.items.map((value, index) => (
              <li key={value}><span className="value-marker" aria-hidden="true" /><span className="value-label">{value}{index === content.values.items.length - 1 ? '.' : ';'}</span></li>
            ))}
          </ul>
      </div>
    </section>
  )
}
