import { useState } from 'react'
import type { Subsection } from '../../data/brandChapters'
import { interfaceTypefaces, slogan, specimen, typefaces } from '../../data/visualIdentity'
import { IdentitySection, OfficialLogo, ProvenanceTag } from './shared'

/** Splits a word into spans so GSAP can reveal it letter by letter (read as one word). */
function Chars({ text }: { text: string }) {
  return <span className="vi-chars">
    <span className="vi-sr-only">{text}</span>
    {Array.from(text, (char, index) => <span key={index} className="vi-char" aria-hidden="true">{char === ' ' ? ' ' : char}</span>)}
  </span>
}

function Renfrew() {
  const face = typefaces[0]
  return <article className="vi-face vi-face-renfrew" data-vi-reveal>
    <header>
      <p className="vi-face-use">{face.use}</p>
      <h4 className="vi-face-name"><Chars text={face.family} /></h4>
    </header>
    <figure className="vi-face-logo">
      <OfficialLogo decorative />
      <figcaption>O nome GAZIN em Renfrew existe somente no arquivo da logomarca, exibido aqui sem alteração.</figcaption>
    </figure>
    <p className="vi-muted">{face.style}</p>
  </article>
}

function Gotham() {
  const face = typefaces[1]
  const [inclined, setInclined] = useState(true)
  return <article className="vi-face vi-face-gotham" data-vi-reveal>
    <header>
      <p className="vi-face-use">{face.use}</p>
      <h4 className="vi-face-name"><Chars text={face.family} /></h4>
    </header>
    <div className="vi-specimen" aria-label="Amostra de caracteres em fonte de aproximação">
      <p className="vi-specimen-upper">{specimen.upper}</p>
      <p className="vi-specimen-lower">{specimen.lower}</p>
      <p className="vi-specimen-digits">{specimen.digits}</p>
    </div>
    <div className="vi-slogan-sample">
      <div className="vi-segmented" role="group" aria-label="Inclinação do slogan">
        <button type="button" aria-pressed={!inclined} onClick={() => setInclined(false)}>Reto</button>
        <button type="button" aria-pressed={inclined} onClick={() => setInclined(true)}>Inclinado</button>
      </div>
      <p className={`vi-slogan-type ${inclined ? 'is-inclined' : ''}`}>{slogan}</p>
    </div>
    <p className="vi-muted">{face.style}</p>
    <div className="vi-tags">
      <ProvenanceTag kind="didatico">Amostras em Montserrat, substituta livre da Gotham</ProvenanceTag>
    </div>
  </article>
}

function InterfaceType() {
  const [text, setText] = useState('Identidade que se reconhece de longe')
  const [weight, setWeight] = useState(700)
  const sample = text.trim() || 'Identidade que se reconhece de longe'
  return <div className="vi-ui-type">
    <div className="vi-ui-type-head" data-vi-reveal>
      <h4 className="vi-h4">Tipografia da interface</h4>
      <p className="vi-muted">Fontes escolhidas para a leitura digital do Manual da Marca. São livres (OFL) e servidas pelo próprio site. O manual não as prescreve e elas não são usadas para reconstruir a logomarca nem o slogan.</p>
      <ProvenanceTag kind="digital">Escolha do Manual da Marca digital · não consta no manual</ProvenanceTag>
    </div>
    <div className="vi-tester" data-vi-reveal>
      <div className="vi-tester-controls">
        <label className="vi-field">
          <span>Teste um texto</span>
          <input type="text" value={text} maxLength={60} onChange={event => setText(event.target.value)} />
        </label>
        <label className="vi-field">
          <span>Peso dos títulos: <output>{weight}</output></span>
          <input type="range" min={200} max={800} step={100} value={weight} onChange={event => setWeight(Number(event.target.value))} />
        </label>
      </div>
      <div className="vi-tester-samples">
        {interfaceTypefaces.map(face => <div key={face.id} className={`vi-tester-row is-${face.id}`}>
          <span className="vi-tester-meta"><b>{face.family}</b>{face.use}</span>
          <p style={{ fontFamily: face.css, fontWeight: face.id === 'jakarta' ? weight : 400 }}>{sample}</p>
        </div>)}
      </div>
    </div>
  </div>
}

export function TypographyShowcase({ subsection }: { subsection: Subsection }) {
  return <IdentitySection subsection={subsection} className="vi-type-section"
    lead={<>
      <p>Um alfabeto padronizado reforça a unidade da comunicação em praticamente todos os meios. A logomarca usa duas famílias: <strong>Renfrew</strong> no nome GAZIN e <strong>Gotham Bold com inclinação</strong> no slogan.</p>
      <p>Nenhuma das duas fontes comerciais está incorporada ao site. Os nomes são mantidos como documentados e a logomarca é exibida sempre pelo arquivo original.</p>
    </>}>
    <div className="vi-faces">
      <Renfrew />
      <Gotham />
    </div>
    <InterfaceType />
  </IdentitySection>
}
