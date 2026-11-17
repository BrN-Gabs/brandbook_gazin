import type { ReactNode } from 'react'
import type { Chapter, Subsection } from '../../data/brandChapters'
import { banners, digitalLabels, ecommerce, motion, social, web, type CrossLink, type Guideline } from '../../data/digitalCommunication'
import { Guidelines, Related } from './DigitalShared'
import { SocialShowcase } from './SocialShowcase'
import { ResponsiveWebsitePreview } from './ResponsiveWebsitePreview'
import { DigitalBannerComparison } from './DigitalBannerComparison'
import { EcommerceShowcase } from './EcommerceShowcase'
import { MotionDesignExamples } from './MotionDesignExamples'
import '../../styles/digital.css'

/**
 * One row of the existing "devices" composition (head + text on one side, the demonstration on
 * the other, alternating), with the same ids and anatomy as every chapter: the in-chapter index,
 * the side menu and F5 keep working.
 */
function Row({ subsection, text, guidelines, guidelinesLabel, links, children }: { subsection: Subsection; text: string; guidelines: Guideline[]; guidelinesLabel?: string; links: CrossLink[]; children: ReactNode }) {
  return <article id={subsection.id} className="subsection dg-row" data-status={subsection.status} aria-labelledby={`${subsection.id}-title`}>
    <header className="subsection-head">
      <span className="subsection-number">{subsection.number}</span>
      <h3 id={`${subsection.id}-title`}>{subsection.title}</h3>
    </header>
    <div className="subsection-text dg-text"><p>{text}</p></div>
    <div className="dg-demo" data-dg-reveal>{children}</div>
    <div className="dg-aside">
      <Guidelines items={guidelines} label={guidelinesLabel} />
      <Related links={links} />
    </div>
  </article>
}

/** Chapter 06 · Comunicação Digital: content from src/data/digitalCommunication.ts. */
export function DigitalBody({ chapter }: { chapter: Chapter }) {
  const [socialSection, webSection, bannerSection, shopSection, motionSection] = chapter.subsections
  return <>
    <p className="dg-proposal">{digitalLabels.proposal}</p>
    <div className="chapter-body layout-devices layout-digital">
      <Row subsection={socialSection} text={social.text} guidelines={social.guidelines} links={social.links}><SocialShowcase /></Row>
      <Row subsection={webSection} text={web.text} guidelines={web.guidelines} links={web.links}><ResponsiveWebsitePreview /></Row>
      <Row subsection={bannerSection} text={banners.text} guidelines={banners.elements} guidelinesLabel="Elementos principais" links={banners.links}><DigitalBannerComparison /></Row>
      <Row subsection={shopSection} text={ecommerce.text} guidelines={ecommerce.guidelines} links={ecommerce.links}><EcommerceShowcase /></Row>
      <Row subsection={motionSection} text={motion.text} guidelines={motion.principles} guidelinesLabel="Princípios de motion design" links={motion.links}><MotionDesignExamples /></Row>
    </div>
  </>
}
