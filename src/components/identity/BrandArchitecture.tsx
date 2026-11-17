import { useMemo, useState, type CSSProperties } from 'react'
import { Download, PackageOpen, Search } from 'lucide-react'
import type { Subsection } from '../../data/brandChapters'
import groupLogos from '../../data/groupLogos.json'
import { architecture, clusterOf, logoBySlug, mainBrand, otherBrands } from '../../data/brandArchitecture'
import { IdentitySection } from './shared'

const base = import.meta.env.BASE_URL
const archive = 'assets/marcas/marcas-grupo-gazin.zip'
const formatSize = (bytes: number) => bytes >= 1048576
  ? `${(bytes / 1048576).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB`
  : `${Math.round(bytes / 1024)} KB`
// Ignore accents and case when filtering ("colchoes" finds "Colchões").
const normalize = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

/** Everything the page needs about one brand: preview, name, download (original file). */
function brand(slug: string) {
  if (slug === mainBrand.slug) return { slug, name: mainBrand.name, preview: mainBrand.src, width: mainBrand.width, height: mainBrand.height, download: mainBrand.download, file: mainBrand.downloadName, meta: `PNG · ${mainBrand.width} × ${mainBrand.height} px · logomarca principal (02.4)` }
  const logo = logoBySlug(slug)!
  return { slug, name: logo.name, preview: `assets/marcas/previa/${slug}.png`, width: logo.preview.width, height: logo.preview.height, download: `assets/marcas/originais/${slug}.png`, file: `${slug}.png`, meta: `PNG · ${logo.width} × ${logo.height} px · ${formatSize(logo.bytes)}` }
}
const clusterLabel = (slug: string) => {
  if (slug === architecture.holding) return 'Centro da arquitetura'
  const cluster = clusterOf(slug)
  return cluster ? `Conjunto ${cluster.number}` : architecture.othersTitle
}

function BrandButton({ slug, active, onSelect }: { slug: string; active: boolean; onSelect: (slug: string) => void }) {
  const item = brand(slug)
  return <button type="button" className="ba-brand" aria-pressed={active} onClick={() => onSelect(slug)} aria-label={`${item.name}: ver e baixar`}>
    <img src={`${base}${item.preview}`} width={item.width} height={item.height} alt="" loading="lazy" decoding="async" draggable={false} />
  </button>
}

/**
 * 02.9: the brand architecture (Gazin Holding at the centre, five unnamed
 * clusters) with every brand selectable and downloadable as its original file, followed by the
 * complete library (search + ZIP).
 */
export function BrandArchitecture({ subsection }: { subsection: Subsection }) {
  const [selected, setSelected] = useState(mainBrand.slug)
  const [query, setQuery] = useState('')
  const current = brand(selected)
  const activeCluster = clusterOf(selected)?.id
  const visible = useMemo(() => {
    const term = normalize(query.trim())
    return term ? groupLogos.filter(logo => normalize(logo.name).includes(term)) : groupLogos
  }, [query])
  const select = (slug: string) => setSelected(slug)
  // Hub at the centre of the bottom row; clusters at the centres of the 3 × 2 grid cells.
  const anchors: Record<string, [number, number]> = { c4: [50, 150], c5: [50, 50], c1: [150, 50], c2: [250, 50], c3: [250, 150] }

  return <IdentitySection subsection={subsection} className="vi-group-section"
    lead={<>
      <p>{architecture.rule}</p>
      <p>{architecture.note}</p>
      <p>Abaixo, a arquitetura do Grupo Gazin e todas as logomarcas vinculadas, prontas para baixar no arquivo original.</p>
    </>}>
    <div className="ba-diagram">
      <svg className="ba-lines" viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true">
        {architecture.clusters.map(cluster => <line key={cluster.id} x1="150" y1="150" x2={anchors[cluster.id][0]} y2={anchors[cluster.id][1]} className={activeCluster === cluster.id ? 'is-lit' : ''} style={{ '--c': cluster.color } as CSSProperties} vectorEffect="non-scaling-stroke" />)}
      </svg>
      {architecture.clusters.map(cluster => <div key={cluster.id} className={`ba-cluster is-${cluster.id} ${activeCluster === cluster.id ? 'is-active' : ''}`} style={{ '--c': cluster.color } as CSSProperties}
        role="group" aria-label={`Conjunto ${cluster.number}: ${cluster.brands.map(slug => brand(slug).name).join(', ')}`}>
        <span className="ba-cluster-number" aria-hidden="true">{cluster.number}</span>
        {cluster.brands.map(slug => <BrandButton key={slug} slug={slug} active={selected === slug} onSelect={select} />)}
      </div>)}
      <div className="ba-hub">
        <BrandButton slug={architecture.holding} active={selected === architecture.holding} onSelect={select} />
        <p>{architecture.signature}</p>
      </div>
    </div>

    <div className="ba-others">
      <p className="ba-others-title">{architecture.othersTitle}</p>
      <div className="ba-others-list">{otherBrands.map(logo => <BrandButton key={logo.slug} slug={logo.slug} active={selected === logo.slug} onSelect={select} />)}</div>
    </div>

    <div className="ba-detail" aria-live="polite">
      <div className="vi-group-plate"><img key={current.slug} src={`${base}${current.preview}`} width={current.width} height={current.height} alt={`Logomarca ${current.name}`} decoding="async" draggable={false} /></div>
      <div className="ba-detail-info">
        <p className="ba-detail-cluster">{clusterLabel(current.slug)}</p>
        <h4>{current.name}</h4>
        <p>{current.meta}</p>
        <a className="vi-download" href={`${base}${current.download}`} download={current.file} aria-label={`Baixar ${current.name}, arquivo original (PNG)`}>
          <Download size={16} aria-hidden="true" /><span>Baixar PNG original</span>
        </a>
      </div>
    </div>

    <div className="ba-library">
      <div className="vi-group-toolbar">
        <label className="vi-group-search">
          <Search size={16} aria-hidden="true" />
          <span className="vi-sr-only">Buscar marca</span>
          <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar marca" />
        </label>
        <p className="vi-group-count" aria-live="polite">{visible.length} {visible.length === 1 ? 'marca' : 'marcas'}</p>
        <a className="vi-download is-primary" href={`${base}${archive}`} download="marcas-grupo-gazin.zip">
          <PackageOpen size={17} aria-hidden="true" /><span>Baixar todas (.zip)</span>
        </a>
      </div>
      {visible.length
        ? <ul className="vi-group-grid">
          {visible.map(logo => <li key={logo.slug} className="vi-group-card">
            <div className="vi-group-plate">
              <img src={`${base}assets/marcas/previa/${logo.slug}.png`} width={logo.preview.width} height={logo.preview.height}
                alt={`Logomarca ${logo.name}`} loading="lazy" decoding="async" draggable={false} />
            </div>
            <div className="vi-group-info">
              <h4>{logo.name}</h4>
              <p><span className="ba-chip" style={{ '--c': clusterOf(logo.slug)?.color ?? 'transparent' } as CSSProperties}>{clusterLabel(logo.slug)}</span> PNG · {logo.width} × {logo.height} px · {formatSize(logo.bytes)}</p>
            </div>
            <a className="vi-download is-compact" href={`${base}assets/marcas/originais/${logo.slug}.png`} download={`${logo.slug}.png`} aria-label={`Baixar logomarca ${logo.name} (PNG)`}>
              <Download size={15} aria-hidden="true" /><span>Baixar PNG</span>
            </a>
          </li>)}
        </ul>
        : <p className="vi-group-empty">Nenhuma marca encontrada para “{query}”.</p>}
    </div>
  </IdentitySection>
}
