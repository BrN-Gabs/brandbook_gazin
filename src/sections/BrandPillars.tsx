import { brandContent as content } from '../data/brandContent'
import { SectionHeading } from '../components/SectionHeading'

export function BrandPillars() {
  return (
    <section id="pilares" className="pillars section-space" aria-labelledby="pillars-title">
      <div className="page-container">
        <div className="pillars-heading">
          <SectionHeading id="pillars-title">{content.pillars.title}</SectionHeading>
        </div>
        <div className="pillars-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {content.pillars.items.map(pillar => (
            <div key={pillar.number} className="pillar-reveal">
              <article className="pillar">
                <div className="pillar-heading">
                  <span className="pillar-number" aria-hidden="true">{pillar.number}</span>
                  <h3>{pillar.title}</h3>
                </div>
                <div className="pillar-line" />
                <p className="pillar-attributes">
                  {pillar.attributes[0]}<span>+</span>{pillar.attributes[1]}
                </p>
                <p className="body-copy pillar-description">{pillar.description}</p>
                <div className="pillar-icon-stage" aria-hidden="true"><img className="pillar-icon" src={`${import.meta.env.BASE_URL}assets/pillar.svg`} alt="" width="80" height="80" loading="lazy" /></div>
              </article>
            </div>
          ))}
        </div>
          <p className="pillars-note">{content.pillars.note}</p>
      </div>
    </section>
  )
}
