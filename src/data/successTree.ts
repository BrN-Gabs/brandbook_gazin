// Árvore da Jornada de Sucesso — encerramento da Essência.
//
// Fonte: imagem "ARVORE GAZIN.jpg" (Árvore da Jornada de Sucesso do Grupo Gazin). Os textos
// seguem a grafia da imagem; títulos curtos são editoriais. Afirmações com números, rankings
// e prêmios (frutos) são as registradas no material original e NÃO foram atualizadas.
//
// Para editar: altere `title`/`description` abaixo. Para acrescentar um elemento, inclua um
// objeto em `treeItems` com `region` e `position` (coordenadas da cena 3D, ver a legenda de
// `TreeItem`). A cena constrói raízes, galhos e frutos a partir dessas posições.

export type TreeRegionId = 'raizes' | 'tronco' | 'galhos' | 'frutos'
export type Vec3 = [number, number, number]
/** Enquadramento da câmera: centro (x, y) e tamanho (largura, altura) da área, em unidades da cena. */
export type TreeView = { center: [number, number]; size: [number, number] }

export type TreeRegion = {
  id: TreeRegionId
  label: string
  /** Conceito da região, como aparece na imagem original. */
  concept: string
  /** Onde o nome da região aparece na visão geral. */
  labelPosition: Vec3
  view: TreeView
}

export type TreeItem = {
  id: string
  region: TreeRegionId
  title: string
  description: string
  /**
   * Posição na cena (x: esquerda → direita, y: altura, z: profundidade). O solo fica em y = -1.
   * Raízes: ponta da raiz. Tronco: ponto no tronco. Galhos: ponta do galho. Frutos: centro do fruto.
   */
  position: Vec3
  /** Cor do fruto: azul por padrão; verde e laranja só em poucos destaques. */
  accent?: 'green' | 'orange'
}

export const treeIntro = {
  eyebrow: 'Essência',
  title: 'Árvore da Jornada de Sucesso',
  concept: 'Raízes que nos fortalecem. Valores que nos sustentam. Conquistas que nos fazem crescer.',
  text: 'Tudo começa nas raízes, passa pela estrutura e pela estratégia e se transforma em conquistas.',
  hint: 'Explore cada parte da árvore',
  closingEyebrow: 'Encerramento · Essência',
  closing: 'Da raiz aos frutos, um só DNA.',
  closingText: 'Valores inegociáveis, uma estrutura sólida e áreas de atuação estratégica sustentam cada conquista do Grupo Gazin e nos preparam para ir ainda mais longe.',
  sourceNote: 'Conforme registrado no material original da Árvore da Jornada de Sucesso.',
}

export const overviewView: TreeView = { center: [0, 1.7], size: [14.6, 10.4] }

export const treeRegions: TreeRegion[] = [
  { id: 'raizes', label: 'Raízes', concept: 'Raízes inegociáveis: onde tudo começou e o que nos mantém firmes e fortes.', labelPosition: [-6.6, -1.25, 0], view: { center: [.2, -2.2], size: [16.8, 3.8] } },
  { id: 'tronco', label: 'Tronco', concept: 'A estrutura que faz a Gazin crescer e frutificar.', labelPosition: [-2.2, .4, 0], view: { center: [0, .65], size: [8.5, 4.6] } },
  { id: 'galhos', label: 'Galhos', concept: 'Nossas grandes áreas de atuação estratégica.', labelPosition: [3.9, 1.7, 0], view: { center: [0, 3.4], size: [17.2, 5.2] } },
  { id: 'frutos', label: 'Frutos', concept: 'Tudo o que colhemos ao longo desta bela jornada, que nos prepara para ir ainda mais longe.', labelPosition: [6.3, 6.1, 0], view: { center: [0, 4.4], size: [17.4, 4.8] } },
]

export const treeItems: TreeItem[] = [
  // Raízes — da esquerda para a direita, como na imagem.
  { id: 'cultura-gazin', region: 'raizes', title: 'Cultura Gazin', description: 'Honestidade, respeito, lealdade, trabalho e simplicidade.', position: [-5.6, -1.85, .6] },
  { id: 'fundacao-douradina', region: 'raizes', title: 'Fundação em Douradina', description: 'Fundação em Douradina (PR), em 1966.', position: [-2.7, -3.05, 1.1] },
  { id: 'fe-em-deus', region: 'raizes', title: 'Fé em Deus', description: 'Um dos valores históricos que sustentam a nossa trajetória.', position: [-.6, -2, 1.7] },
  { id: 'proposito', region: 'raizes', title: 'Propósito', description: 'Propósito de servir com excelência.', position: [.9, -3.1, .2] },
  { id: 'coragem', region: 'raizes', title: 'Coragem', description: 'Valor ligado à nossa trajetória de crescimento.', position: [2.4, -2.05, -1.1] },
  { id: 'compromisso-social', region: 'raizes', title: 'Compromisso social', description: 'Compromisso social e comunitário.', position: [3.7, -3.15, .9] },
  { id: 'foco-em-gente', region: 'raizes', title: 'Foco em gente', description: 'Foco em gente: clientes, colaboradores e parceiros.', position: [5.8, -2.7, -.4] },
  { id: 'respeito-legado', region: 'raizes', title: 'Respeito ao legado', description: 'Respeito ao legado dos fundadores.', position: [6.1, -1.65, 1] },

  // Tronco — de cima para baixo, como na imagem.
  { id: 'gestao-humanizada', region: 'tronco', title: 'Gestão humanizada', description: 'Gestão humanizada.', position: [.05, 2.15, .62] },
  { id: 'governanca-solida', region: 'tronco', title: 'Governança sólida', description: 'Governança sólida.', position: [-.05, 1.62, .58] },
  { id: 'gestao-de-pessoas', region: 'tronco', title: 'Gestão de pessoas', description: 'Gestão de pessoas.', position: [0, 1.1, .56] },
  { id: 'lideranca-inspiradora', region: 'tronco', title: 'Liderança inspiradora', description: 'Liderança inspiradora.', position: [.05, .58, .56] },
  { id: 'melhoria-continua', region: 'tronco', title: 'Melhoria contínua', description: 'Melhoria contínua.', position: [0, .06, .6] },
  { id: 'inovacao-constante', region: 'tronco', title: 'Inovação constante', description: 'Inovação constante.', position: [-.05, -.42, .7] },
  { id: 'diversificacao-metas', region: 'tronco', title: 'Diversificação, metas e alto desempenho', description: 'Diversificação, metas e alto desempenho.', position: [0, -.85, .86] },

  // Galhos — da esquerda para a direita.
  { id: 'varejo-experience', region: 'galhos', title: 'Varejo Experience Brasil', description: 'Área de atuação estratégica: Varejo Experience Brasil.', position: [-6.3, 2.35, .5] },
  { id: 'consorcio', region: 'galhos', title: 'Consórcio', description: 'Área de atuação estratégica: Consórcio.', position: [-4.8, 1.75, -1.3] },
  { id: 'gazinbank', region: 'galhos', title: 'GazinBank', description: 'Área de atuação estratégica: GazinBank.', position: [-4.6, 3.65, 1] },
  { id: 'tv-gazin', region: 'galhos', title: 'TV Gazin', description: 'Área de atuação estratégica: TV Gazin.', position: [-3.2, 4.75, -.8] },
  { id: 'atacado', region: 'galhos', title: 'Atacado', description: 'Área de atuação estratégica: Atacado.', position: [-2.2, 2.75, 1.9] },
  { id: 'servicos', region: 'galhos', title: 'Serviços', description: 'Área de atuação estratégica: Serviços.', position: [-1.45, 4.05, .9] },
  { id: 'gazintech', region: 'galhos', title: 'GazinTech', description: 'Área de atuação estratégica: GazinTech.', position: [-.2, 5.45, .2] },
  { id: 'varejo', region: 'galhos', title: 'Varejo', description: 'Área de atuação estratégica: Varejo.', position: [-.1, 3.15, 2.2] },
  { id: 'seguros', region: 'galhos', title: 'Seguros', description: 'Área de atuação estratégica: Seguros.', position: [1.1, 4.35, -1] },
  { id: 'industrias', region: 'galhos', title: 'Indústrias', description: 'Área de atuação estratégica: Indústrias.', position: [1.9, 2.7, 1.6] },
  { id: 'gazinlog', region: 'galhos', title: 'GazinLog', description: 'Área de atuação estratégica: GazinLog.', position: [2.6, 5.05, .6] },
  { id: 'expansao', region: 'galhos', title: 'Expansão e novos mercados', description: 'Área de atuação estratégica: expansão e novos mercados.', position: [3.7, 3.3, -1.2] },
  { id: 'instituto-mario-gazin', region: 'galhos', title: 'Instituto Mário Gazin', description: 'Área de atuação estratégica: Instituto Mário Gazin.', position: [4.7, 4.45, .8] },
  { id: 'e-commerce', region: 'galhos', title: 'E-commerce', description: 'Área de atuação estratégica: e-commerce.', position: [6.1, 3, .2] },

  // Frutos — conquistas, com a formulação do material original.
  { id: 'crescimento-sustentavel', region: 'frutos', title: 'Crescimento sustentável', description: 'Crescimento sustentável há décadas.', position: [-5.3, 4.4, 1.2], accent: 'green' },
  { id: 'cinco-maiores', region: 'frutos', title: 'Destaque no varejo', description: 'Uma das 5 maiores empresas de varejo do Brasil.', position: [-3.4, 3.85, 1.6], accent: 'orange' },
  { id: 'sucessao', region: 'frutos', title: 'Sucessão estruturada', description: 'Processo de sucessão estruturado e de longo prazo.', position: [-3.7, 5.9, .3] },
  { id: 'impacto-comunidades', region: 'frutos', title: 'Impacto nas comunidades', description: 'Impacto real nas comunidades onde atua.', position: [-1.6, 5.1, 1.6], accent: 'green' },
  { id: 'cuidado-pessoas', region: 'frutos', title: 'Cuidado com as pessoas', description: 'O cuidado com as pessoas sustenta o lucro de longo prazo.', position: [-.7, 6.35, .6] },
  { id: 'reconhecimento-gestao', region: 'frutos', title: 'Reconhecimento de gestão', description: 'Reconhecimento nacional pela excelência em gestão.', position: [1.2, 6.15, 1] },
  { id: 'premios', region: 'frutos', title: 'Marca e responsabilidade social', description: 'Prêmios de marca, qualidade e responsabilidade social.', position: [3.4, 5.45, -.2] },
  { id: 'melhores-empresas', region: 'frutos', title: 'Empregabilidade', description: 'Há mais de 20 anos no pódio das melhores empresas para se trabalhar no Brasil e na América Latina.', position: [2.3, 4.7, 1.9] },
  { id: 'unidades', region: 'frutos', title: 'Expansão', description: 'Mais de 480 unidades de negócio.', position: [5, 4.25, 1], accent: 'orange' },
  { id: 'clientes-colaboradores', region: 'frutos', title: 'Clientes e colaboradores', description: 'Clientes e colaboradores fiéis e orgulhosos da marca.', position: [5.7, 2.55, 1.4] },
  { id: 'rentabilidade', region: 'frutos', title: 'Rentabilidade', description: 'Rentabilidade acima da média do mercado.', position: [-5.7, 2.95, 1.5] },
]

export const treeRegion = (id: TreeRegionId) => treeRegions.find(region => region.id === id)!
export const itemsOf = (region: TreeRegionId) => treeItems.filter(item => item.region === region)
