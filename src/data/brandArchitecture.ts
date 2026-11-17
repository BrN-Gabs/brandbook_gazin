// 02.9 · Arquitetura de Marcas do Grupo Gazin (antigo capítulo 09 · Arquitetura de Marcas,
// mesclado com "Marcas do Grupo Gazin").
//
// Estrutura conforme o Manual da Logomarca Gazin (págs. 30–31, "Unidades de negócio do Grupo
// Gazin"): a Gazin Holding no centro e as marcas em cinco conjuntos, que o manual NÃO nomeia
// (aqui são só numerados, com a cor do arco do manual). As marcas da pasta de logos que não
// aparecem no diagrama ficam em "Outras marcas" (posição a validar). As citações da fonte ficam
// só neste comentário, não na página. Downloads: src/data/groupLogos.json (originais).
import groupLogos from './groupLogos.json' with { type: 'json' }

export type GroupLogo = (typeof groupLogos)[number]
export type BrandCluster = { id: string; number: string; color: string; brands: string[] }

/** Main Gazin logo: official file from chapter 02 (not part of the group-logo folder). */
export const mainBrand = {
  slug: 'gazin', name: 'Gazin', src: 'assets/logos/gazin-cores-originais.png', width: 2974, height: 835,
  download: 'assets/logos/gazin-cores-originais.png', downloadName: 'gazin-cores-originais.png',
}

export const architecture = {
  rule: 'As logomarcas das unidades de negócio devem seguir os padrões estabelecidos pela logomarca principal.',
  note: 'Para determinados tipos de negócio, a logomarca pode seguir outros padrões, principalmente de cores, mas sempre preservando a essência da logomarca “mãe”.',
  signature: 'Uma Gazin para todos!',
  holding: 'gazin-holding',
  /** Clockwise as drawn in the manual: left-bottom, left-top, top, right-top, right-bottom. */
  clusters: [
    { id: 'c4', number: '4', color: '#8DC63F', brands: ['gazin-auto-posto', 'gazin-agronegocio'] },
    { id: 'c5', number: '5', color: '#1D3E7A', brands: ['paranatec', 'consorcio-gazin', 'gazin-seguros'] },
    { id: 'c1', number: '1', color: '#1B5FAA', brands: ['gazin', 'gazin-atacado', 'gazin-colchoes'] },
    { id: 'c2', number: '2', color: '#29ABE2', brands: ['gazin-bank', 'gazin-com-br', 'tv-gazin'] },
    { id: 'c3', number: '3', color: '#6CD4EE', brands: ['gazin-log', 'gazin-tech', 'gazin-viagens'] },
  ] satisfies BrandCluster[],
  othersTitle: 'Outras marcas vinculadas',
}

const bySlug = new Map(groupLogos.map(logo => [logo.slug, logo]))
export const logoBySlug = (slug: string) => bySlug.get(slug)
const placed = new Set([architecture.holding, ...architecture.clusters.flatMap(cluster => cluster.brands)])
/** Brands in the logo folder that the architecture diagram does not place. */
export const otherBrands = groupLogos.filter(logo => !placed.has(logo.slug))
export const clusterOf = (slug: string) => architecture.clusters.find(cluster => cluster.brands.includes(slug))
