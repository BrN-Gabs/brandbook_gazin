// Capítulo · Nossas Marcas.
//
// Fonte: "Portfolio_Marcas_Grupo_Gazin.pdf" (90 páginas). Só as dez marcas, seus segmentos (como
// no sumário do PDF) e uma síntese editorial curta. Não entram aplicações, embalagens,
// estratégias, registros, acompanhamentos, datas, vendas ou status comercial. Logos extraídas do
// PDF por scripts/import-our-brands.mjs (sem redesenho nem recoloração).
import files from './ourBrandsFiles.json' with { type: 'json' }

export const ourBrandsIntro = {
  title: 'Um ecossistema de marcas. Diferentes identidades, uma visão de futuro.',
  text: 'O portfólio de marcas do Grupo Gazin reúne identidades desenvolvidas para diferentes segmentos e necessidades do mercado. Cada marca possui características e propostas próprias, ampliando as possibilidades de atuação do grupo e conectando novos produtos, serviços e experiências aos consumidores.',
  concept: 'Diferentes marcas. Novas possibilidades. Um mesmo grupo.',
  source: 'Portfólio de marcas do Grupo Gazin, conforme o material de referência. As informações podem ter evoluído desde a sua elaboração.',
  /** Full reference PDF (compressed version, unchanged content: 90 pages). */
  portfolio: { path: 'assets/marcas/portfolio-marcas-grupo-gazin.pdf', file: 'Portfolio-Marcas-Grupo-Gazin.pdf', label: 'Baixar portfólio de marcas', meta: 'PDF · 90 páginas · 1,8 MB', note: 'Documento completo do Grupo Gazin, com as dez marcas.' },
}

type LogoId = keyof typeof files
export type OurBrand = { id: LogoId; name: string; segment: string; description: string; logo: (typeof files)[LogoId] }
const brand = (id: LogoId, name: string, segment: string, description: string): OurBrand => ({ id, name, segment, description, logo: files[id] })

export const ourBrands: OurBrand[] = [
  brand('gazin-a-z', 'Gazin A–Z', 'Compras e serviços', 'A Gazin A–Z é uma marca voltada à experiência de compras e serviços, reunindo diferentes categorias de produtos e soluções em uma proposta que busca praticidade e conveniência para o consumidor.'),
  brand('gamerzone', 'GamerZone', 'Produtos gamers', 'A GamerZone é uma marca dedicada ao universo gamer, com produtos e acessórios voltados ao entretenimento, à tecnologia e à experiência dos jogadores.'),
  brand('done', 'DONE', 'Eletrodomésticos e utilidades', 'A DONE reúne eletrodomésticos, eletroportáteis e utilidades domésticas, com uma proposta de oferecer funcionalidade e praticidade para as atividades do dia a dia.'),
  brand('ecoflash', 'Ecoflash', 'Mobilidade urbana', 'A Ecoflash é voltada a soluções de mobilidade urbana, incluindo bicicletas elétricas, patinetes e scooters, com uma identidade associada à praticidade, à agilidade e à mobilidade.'),
  brand('gold-confort', 'Gold Confort', 'Colchões e franquias', 'A Gold Confort apresenta uma proposta de atuação no segmento de colchões e franquias, associando conforto, bem-estar e oportunidades de negócio.'),
  brand('sleep-on', 'Sleep On', 'Colchões e e-commerce', 'A Sleep On é uma marca direcionada ao segmento de colchões e ao comércio eletrônico, com foco em soluções relacionadas ao descanso e ao conforto.'),
  brand('mark-blank', 'Mark Blank', 'Moda, casa e acessórios', 'A Mark Blank integra o portfólio de marcas voltadas à moda, ao universo da casa e aos acessórios, reunindo diferentes possibilidades de produtos para o cotidiano.'),
  brand('grock', 'Grock', 'Pneus', 'A Grock é uma marca do portfólio voltada ao segmento de pneus, ampliando a presença do grupo em categorias relacionadas ao setor automotivo.'),
  brand('fitmotion', 'Fitmotion', 'Produtos fitness', 'A Fitmotion integra o segmento fitness, com uma proposta direcionada a produtos e equipamentos relacionados à atividade física e ao bem-estar.'),
  brand('colorvision', 'Colorvision', 'Televisores e monitores', 'A Colorvision é uma marca voltada a televisores e monitores, com atuação relacionada à tecnologia, à imagem e ao entretenimento.'),
]
