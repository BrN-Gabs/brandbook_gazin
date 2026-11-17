// Gera os MODELOS PROPOSTOS da Biblioteca de Materiais (capítulo 08.4 · Comunicação Interna):
//   · apresentação corporativa (PPTX), documento institucional (DOCX), comunicado interno
//     (DOCX + PDF), relatório (PPTX + XLSX) e kit de eventos (PDF + PNG em ZIP);
//   · usam só a logomarca oficial (arquivos do capítulo 02, sem alteração), a paleta e as fontes
//     digitais do Manual (Plus Jakarta Sans e Inter, SIL OFL);
//   · os textos são campos a preencher ([Título], [Data]…): não há conteúdo real nem dados reais.
// São PROPOSTAS do Manual da Marca, em validação: cada arquivo traz essa indicação no rodapé.
//
// As bibliotecas de geração não fazem parte do site: ficam numa pasta à parte.
//   npm install pptxgenjs@3.12.0 docx@9.5.1 exceljs@4.4.0   (numa pasta qualquer)
//   node scripts/generate-internal-templates.mjs "<pasta com node_modules>"
import { createRequire } from 'node:module'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

const deps = process.argv[2]
if (!deps) throw new Error('Uso: node scripts/generate-internal-templates.mjs "<pasta com node_modules (pptxgenjs, docx, exceljs)>"')
const load = createRequire(join(deps, 'package.json'))
const PptxGenJS = load('pptxgenjs')
const docx = load('docx')
const ExcelJS = load('exceljs')
const JSZip = load('jszip')

const root = fileURLToPath(new URL('..', import.meta.url))
const out = join(root, 'public', 'assets', 'comunicacao-interna', 'modelos')
await mkdir(out, { recursive: true })

const C = { blue: '080EA0', bright: '4169FE', navy: '050B2F', gray: '494E64', grayDark: '2B2F45', light: 'DCE5FF', pale: 'F2F5FF', white: 'FFFFFF', line: 'D4D9EE' }
const TITLE = 'Plus Jakarta Sans', BODY = 'Inter'
const NOTE = 'Modelo proposto pelo Manual da Marca DNA Gazin · versão 1 · em validação'
const logo = { light: join(root, 'public/assets/logos/gazin-cores-originais.png'), dark: join(root, 'public/assets/logos/gazin-fundo-escuro.png') }
const logoRatio = { light: 2974 / 835, dark: 3034 / 895 }
const b64 = async path => (await readFile(path)).toString('base64')
const files = {}
const save = async (name, data) => { await writeFile(join(out, name), data); files[name] = data.length; console.log('✓', name) }

// ── PPTX helpers ──────────────────────────────────────────────────────────────────────
function deck(title) {
  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_WIDE' // 13.33 × 7.5 in (16:9)
  pptx.author = 'Gazin'; pptx.company = 'Gazin'; pptx.title = title
  pptx.theme = { headFontFace: TITLE, bodyFontFace: BODY }
  return pptx
}
const footer = (slide, dark = false) => slide.addText(NOTE, { x: .5, y: 7.05, w: 9, h: .3, fontFace: BODY, fontSize: 8, color: dark ? 'A9B6E8' : '8A90A8' })
function cover(pptx, title, subtitle) {
  const s = pptx.addSlide(); s.background = { color: C.navy }
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: .22, h: 7.5, fill: { color: C.bright } })
  s.addImage({ path: logo.dark, x: .9, y: .8, w: 2.6, h: 2.6 / logoRatio.dark })
  s.addText(title, { x: .9, y: 2.7, w: 11, h: 1.4, fontFace: TITLE, fontSize: 44, bold: true, color: C.white })
  s.addText(subtitle, { x: .9, y: 4.1, w: 11, h: .6, fontFace: BODY, fontSize: 18, color: C.light })
  s.addShape(pptx.ShapeType.rect, { x: .9, y: 5.0, w: 1.6, h: .08, fill: { color: C.bright } })
  s.addText('[Área responsável] · [Data]', { x: .9, y: 5.25, w: 8, h: .4, fontFace: BODY, fontSize: 14, color: 'A9B6E8' })
  footer(s, true)
  s.addNotes('Capa: substitua os textos entre colchetes. Não altere nem recolora a logomarca.')
}
function divider(pptx, number, title) {
  const s = pptx.addSlide(); s.background = { color: C.blue }
  s.addText(number, { x: .9, y: 1.6, w: 4, h: 2, fontFace: TITLE, fontSize: 120, bold: true, color: C.bright })
  s.addText(title, { x: .9, y: 3.7, w: 10, h: 1, fontFace: TITLE, fontSize: 36, bold: true, color: C.white })
  s.addImage({ path: logo.dark, x: 10.9, y: .55, w: 1.8, h: 1.8 / logoRatio.dark })
  footer(s, true)
}
function contentBase(pptx, title) {
  const s = pptx.addSlide(); s.background = { color: C.white }
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: .9, fill: { color: C.blue } })
  s.addImage({ path: logo.dark, x: 11.2, y: .22, w: 1.6, h: 1.6 / logoRatio.dark })
  s.addText(title, { x: .6, y: 1.2, w: 12, h: .8, fontFace: TITLE, fontSize: 30, bold: true, color: C.navy })
  footer(s)
  return s
}
function closing(pptx) {
  const s = pptx.addSlide(); s.background = { color: C.navy }
  s.addImage({ path: logo.dark, x: 4.95, y: 1.7, w: 3.4, h: 3.4 / logoRatio.dark })
  s.addText('Obrigado!', { x: 0, y: 3.2, w: 13.33, h: 1, align: 'center', fontFace: TITLE, fontSize: 40, bold: true, color: C.white })
  s.addText('[Nome] · [Área] · [Contato]', { x: 0, y: 4.2, w: 13.33, h: .5, align: 'center', fontFace: BODY, fontSize: 16, color: C.light })
  footer(s, true)
}
const bullets = (s, items, opts) => s.addText(items.map(text => ({ text, options: { bullet: { code: '25CF' }, paraSpaceAfter: 10 } })), { fontFace: BODY, fontSize: 18, color: C.grayDark, valign: 'top', ...opts })

// 1 · Apresentação corporativa
{
  const pptx = deck('Modelo de apresentação corporativa · Gazin')
  cover(pptx, '[Título da apresentação]', '[Subtítulo ou objetivo do encontro]')
  divider(pptx, '01', '[Título da seção]')
  { const s = contentBase(pptx, '[Título do conteúdo]'); bullets(s, ['[Tópico principal, em uma frase curta]', '[Segundo tópico]', '[Terceiro tópico]', '[Até cinco tópicos por slide]'], { x: .6, y: 2.2, w: 12, h: 4.3 }) }
  {
    const s = contentBase(pptx, '[Título com imagem]')
    bullets(s, ['[Mensagem principal]', '[Informação de apoio]', '[Conclusão ou próximo passo]'], { x: .6, y: 2.2, w: 6, h: 4.2 })
    s.addShape(pptx.ShapeType.roundRect, { x: 7.1, y: 2.2, w: 5.6, h: 4.2, rectRadius: .12, fill: { color: C.pale }, line: { color: C.line, dashType: 'dash' } })
    s.addText('[Inserir imagem de qualidade]', { x: 7.1, y: 4.0, w: 5.6, h: .6, align: 'center', fontFace: BODY, fontSize: 14, color: C.gray })
  }
  {
    const s = contentBase(pptx, '[Três pontos-chave]')
    ;['01', '02', '03'].forEach((n, i) => {
      const x = .6 + i * 4.1
      s.addShape(pptx.ShapeType.roundRect, { x, y: 2.3, w: 3.8, h: 3.9, rectRadius: .12, fill: { color: C.pale } })
      s.addText(n, { x: x + .35, y: 2.6, w: 2, h: .7, fontFace: TITLE, fontSize: 30, bold: true, color: C.bright })
      s.addText('[Título]', { x: x + .35, y: 3.4, w: 3.2, h: .6, fontFace: TITLE, fontSize: 20, bold: true, color: C.navy })
      s.addText('[Explicação curta, em até duas linhas]', { x: x + .35, y: 4.0, w: 3.2, h: 1.4, fontFace: BODY, fontSize: 14, color: C.gray, valign: 'top' })
    })
  }
  closing(pptx)
  await save('modelo-apresentacao-corporativa-gazin.pptx', await pptx.write({ outputType: 'nodebuffer' }))
}

// 4 · Relatório (PPTX)
{
  const pptx = deck('Modelo de relatório · Gazin')
  cover(pptx, '[Relatório de indicadores]', '[Período · Área]')
  {
    const s = contentBase(pptx, 'Resumo do período')
    ;['[Indicador 1]', '[Indicador 2]', '[Indicador 3]'].forEach((label, i) => {
      const x = .6 + i * 4.1
      s.addShape(pptx.ShapeType.roundRect, { x, y: 2.3, w: 3.8, h: 2.2, rectRadius: .12, fill: { color: C.pale } })
      s.addText('00', { x: x + .35, y: 2.5, w: 3, h: 1, fontFace: TITLE, fontSize: 44, bold: true, color: C.blue })
      s.addText(label, { x: x + .35, y: 3.5, w: 3.2, h: .5, fontFace: BODY, fontSize: 14, color: C.gray })
    })
    s.addText('[Comentário: o que os números mostram, em uma ou duas frases.]', { x: .6, y: 4.9, w: 12, h: 1, fontFace: BODY, fontSize: 16, color: C.grayDark })
  }
  {
    const s = contentBase(pptx, '[Evolução do indicador]')
    s.addChart(pptx.ChartType.bar, [{ name: 'Realizado', labels: ['Mês 1', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5', 'Mês 6'], values: [40, 55, 50, 68, 62, 75] }, { name: 'Meta', labels: ['Mês 1', 'Mês 2', 'Mês 3', 'Mês 4', 'Mês 5', 'Mês 6'], values: [50, 50, 60, 60, 70, 70] }], {
      x: .6, y: 2.1, w: 12, h: 4.4, barGrouping: 'clustered', chartColors: [C.blue, C.bright], catAxisLabelFontFace: BODY, valAxisLabelFontFace: BODY, catAxisLabelColor: C.gray, valAxisLabelColor: C.gray,
      showLegend: true, legendPos: 'b', legendFontFace: BODY, valGridLine: { color: 'E1E6F8', size: .5 }, catGridLine: { style: 'none' },
    })
    s.addText('Dados de exemplo: substitua pelos valores do período (clique com o botão direito no gráfico › Editar dados).', { x: .6, y: 6.55, w: 12, h: .35, fontFace: BODY, fontSize: 10, italic: true, color: C.gray })
  }
  { const s = contentBase(pptx, 'Conclusões e próximos passos'); bullets(s, ['[Principal conclusão]', '[Ponto de atenção]', '[Próximo passo, com responsável e prazo]'], { x: .6, y: 2.2, w: 12, h: 4.2 }) }
  closing(pptx)
  await save('modelo-relatorio-gazin.pptx', await pptx.write({ outputType: 'nodebuffer' }))
}

// 4 · Relatório (XLSX)
{
  const wb = new ExcelJS.Workbook(); wb.creator = 'Gazin'
  const ws = wb.addWorksheet('Indicadores', { views: [{ state: 'frozen', ySplit: 4, showGridLines: false }], pageSetup: { orientation: 'landscape', paperSize: 9, fitToPage: true, fitToWidth: 1, fitToHeight: 0, margins: { left: .4, right: .4, top: .5, bottom: .5, header: .2, footer: .2 } } })
  ws.columns = [{ width: 4 }, { width: 34 }, { width: 16 }, { width: 16 }, { width: 16 }, { width: 18 }, { width: 30 }]
  ws.getRow(1).height = 46
  ws.mergeCells('B1:G1')
  ws.getCell('B1').value = '[Relatório de indicadores · Área · Período]'
  ws.getCell('B1').font = { name: TITLE, size: 18, bold: true, color: { argb: 'FF' + C.navy } }
  ws.getCell('B1').alignment = { vertical: 'middle' }
  ws.addImage(wb.addImage({ buffer: await readFile(logo.light), extension: 'png' }), { tl: { col: 5.4, row: .15 }, ext: { width: 140, height: 140 / logoRatio.light } })
  ws.mergeCells('B2:G2'); ws.getCell('B2').value = NOTE; ws.getCell('B2').font = { name: BODY, size: 9, italic: true, color: { argb: 'FF8A90A8' } }
  const header = ws.getRow(4)
  ;['', 'Indicador', 'Meta', 'Realizado', 'Atingimento', 'Status', 'Observação'].forEach((text, i) => { header.getCell(i + 1).value = text })
  header.height = 24
  for (let c = 2; c <= 7; c++) Object.assign(header.getCell(c), { font: { name: BODY, bold: true, color: { argb: 'FFFFFFFF' } }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + C.blue } }, alignment: { vertical: 'middle', horizontal: c === 2 || c === 7 ? 'left' : 'center' } })
  for (let r = 5; r <= 14; r++) {
    const row = ws.getRow(r)
    row.getCell(2).value = `[Indicador ${r - 4}]`
    row.getCell(5).value = { formula: `IF(C${r}=0,"",D${r}/C${r})` }
    row.getCell(5).numFmt = '0%'
    row.getCell(6).value = { formula: `IF(C${r}=0,"",IF(D${r}>=C${r},"Atingido","Em andamento"))` }
    for (let c = 2; c <= 7; c++) {
      const cell = row.getCell(c)
      cell.font = { name: BODY, size: 11, color: { argb: 'FF' + C.grayDark } }
      cell.border = { bottom: { style: 'thin', color: { argb: 'FFE1E6F8' } } }
      if (r % 2 === 0) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + C.pale } }
      if (c >= 3 && c <= 6) cell.alignment = { horizontal: 'center' }
    }
  }
  ws.addConditionalFormatting({ ref: 'F5:F14', rules: [{ type: 'containsText', operator: 'containsText', text: 'Atingido', style: { font: { color: { argb: 'FF3F7A00' }, bold: true } } }] })
  const how = wb.addWorksheet('Como usar', { views: [{ showGridLines: false }] })
  how.columns = [{ width: 4 }, { width: 100 }]
  ;['Como usar este modelo', '', '1. Preencha o título na aba Indicadores (área e período).', '2. Informe Meta e Realizado: Atingimento e Status são calculados automaticamente.', '3. Use a coluna Observação para contextualizar desvios, em frases curtas.', '4. Para apresentar, copie os resultados para o Modelo de relatório (PPTX).', '5. Não altere nem recolora a logomarca.', '', NOTE]
    .forEach((text, i) => { const cell = how.getCell(`B${i + 2}`); cell.value = text; cell.font = { name: i === 0 ? TITLE : BODY, size: i === 0 ? 16 : 11, bold: i === 0, color: { argb: 'FF' + (i === 0 ? C.navy : C.grayDark) } } })
  await save('modelo-relatorio-gazin.xlsx', Buffer.from(await wb.xlsx.writeBuffer()))
}

// ── DOCX helpers ──────────────────────────────────────────────────────────────────────
const { Document, Packer, Paragraph, TextRun, ImageRun, Header, Footer, AlignmentType, BorderStyle, LevelFormat, PageNumber, Table, TableRow, TableCell, WidthType, ShadingType } = docx
const run = (text, o = {}) => new TextRun({ text, font: o.title ? TITLE : BODY, size: o.size ?? 22, bold: o.bold, italics: o.italics, color: o.color ?? C.grayDark })
const para = (children, o = {}) => new Paragraph({ children: Array.isArray(children) ? children : [children], spacing: { after: o.after ?? 160, before: o.before ?? 0, line: 300 }, alignment: o.align, numbering: o.numbering, border: o.border })
const logoRun = async (width = 150) => new ImageRun({ type: 'png', data: await readFile(logo.light), transformation: { width, height: Math.round(width / logoRatio.light) } })
const docFooter = () => new Footer({ children: [new Paragraph({ alignment: AlignmentType.LEFT, border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.line, space: 6 } }, children: [run(`${NOTE}   ·   Página `, { size: 16, color: '8A90A8' }), new TextRun({ children: [PageNumber.CURRENT], font: BODY, size: 16, color: '8A90A8' })] })] })
const numbering = { config: [{ reference: 'steps', levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 420, hanging: 300 } } } }] }, { reference: 'dots', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 420, hanging: 300 } } } }] }] }
const page = { page: { size: { width: 11906, height: 16838 }, margin: { top: 1300, bottom: 1200, left: 1300, right: 1300 } } }
const box = (children, fill = C.pale) => new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.SINGLE, size: 18, color: C.bright }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } }, rows: [new TableRow({ children: [new TableCell({ shading: { type: ShadingType.CLEAR, fill, color: 'auto' }, margins: { top: 140, bottom: 80, left: 200, right: 200 }, children })] })] })
const heading = text => para(run(text, { title: true, bold: true, size: 26, color: C.navy }), { before: 240, after: 100 })

// 2 · Documento institucional (DOCX)
{
  const doc = new Document({ creator: 'Gazin', title: 'Modelo de documento institucional · Gazin', numbering, sections: [{
    properties: page,
    headers: { default: new Header({ children: [new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: C.blue, space: 8 } }, children: [await logoRun(120), run('\tDOCUMENTO INSTITUCIONAL', { size: 16, bold: true, color: C.gray })], tabStops: [{ type: 'right', position: 9300 }] })] }) },
    footers: { default: docFooter() },
    children: [
      para(run('[Título do documento]', { title: true, bold: true, size: 40, color: C.navy }), { before: 200, after: 120 }),
      para([run('Área: ', { bold: true, size: 20, color: C.gray }), run('[Área responsável]   ', { size: 20, color: C.gray }), run('Data: ', { bold: true, size: 20, color: C.gray }), run('[dd/mm/aaaa]   ', { size: 20, color: C.gray }), run('Versão: ', { bold: true, size: 20, color: C.gray }), run('[1.0]', { size: 20, color: C.gray })], { after: 320 }),
      heading('1. Objetivo'),
      para(run('[Explique, em até três frases, para que serve este documento e a quem se destina.]')),
      heading('2. Orientações'),
      para(run('[Primeira orientação, em frase objetiva.]'), { numbering: { reference: 'dots', level: 0 }, after: 80 }),
      para(run('[Segunda orientação.]'), { numbering: { reference: 'dots', level: 0 }, after: 80 }),
      para(run('[Terceira orientação.]'), { numbering: { reference: 'dots', level: 0 } }),
      heading('3. Informações complementares'),
      box([para(run('[Prazos, contatos, links ou documentos relacionados.]'), { after: 60 })]),
      para(run(''), { after: 600 }),
      para(run('[Nome · Cargo]', { bold: true }), { after: 40, border: { top: { style: BorderStyle.SINGLE, size: 4, color: C.line, space: 6 } } }),
      para(run('[Área responsável]', { color: C.gray, size: 20 })),
    ],
  }] })
  await save('modelo-documento-institucional-gazin.docx', await Packer.toBuffer(doc))
}

// 3 · Comunicado interno (DOCX): the six-part structure of 08.2.
{
  const doc = new Document({ creator: 'Gazin', title: 'Modelo de comunicado interno · Gazin', numbering, sections: [{
    properties: page,
    footers: { default: docFooter() },
    children: [
      para(await logoRun(170), { after: 320 }),
      para(run('COMUNICADO INTERNO', { bold: true, size: 18, color: C.bright }), { after: 80 }),
      para(run('[Título objetivo: o assunto principal em poucas palavras]', { title: true, bold: true, size: 38, color: C.navy }), { after: 240 }),
      para(run('[Contexto: explique a informação em até três frases curtas, sem rodeios.]')),
      heading('O que fazer'),
      ...['[Primeira orientação]', '[Segunda orientação]', '[Terceira orientação]'].map(text => para(run(text), { numbering: { reference: 'steps', level: 0 }, after: 80 })),
      para(run(''), { after: 120 }),
      box([para([run('Quando: ', { bold: true, color: C.blue }), run('[data, horário ou prazo]', { color: C.blue })], { after: 40 }), para([run('Dúvidas: ', { bold: true, color: C.blue }), run('[canal de contato]', { color: C.blue })], { after: 40 })]),
      para(run(''), { after: 320 }),
      para(run('[Área responsável]', { color: C.gray, size: 20 })),
    ],
  }] })
  await save('modelo-comunicado-interno-gazin.docx', await Packer.toBuffer(doc))
}

// ── HTML → PDF / PNG (Chrome) ─────────────────────────────────────────────────────────
const fonts = `@font-face { font-family: 'Plus Jakarta Sans'; font-weight: 200 800; src: url(data:font/woff2;base64,${await b64(join(root, 'node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2'))}) format('woff2'); }
@font-face { font-family: 'Inter'; font-weight: 100 900; src: url(data:font/woff2;base64,${await b64(join(root, 'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'))}) format('woff2'); }`
const L = { light: `data:image/png;base64,${await b64(logo.light)}`, dark: `data:image/png;base64,${await b64(logo.dark)}` }
const css = `${fonts} *{box-sizing:border-box;margin:0} body{font-family:Inter;color:#${C.grayDark}} h1,h2,.t{font-family:'Plus Jakarta Sans'} .note{font-size:9px;color:#8A90A8}`
const browser = await chromium.launch({ channel: 'chrome' })
const pageOf = async (html, viewport) => { const p = await browser.newPage({ viewport }); await p.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`); await p.evaluate(() => document.fonts.ready); return p }

// 3 · Comunicado interno (PDF, A4)
{
  const p = await pageOf(`<main style="padding:22mm 20mm;min-height:297mm;display:flex;flex-direction:column;gap:14px">
    <img src="${L.light}" style="width:52mm;margin-bottom:10px">
    <p style="font-size:11px;font-weight:700;letter-spacing:.18em;color:#${C.bright}">COMUNICADO INTERNO</p>
    <h1 style="font-size:30px;line-height:1.15;color:#${C.navy}">[Título objetivo: o assunto principal em poucas palavras]</h1>
    <p style="font-size:14px;line-height:1.6">[Contexto: explique a informação em até três frases curtas, sem rodeios.]</p>
    <h2 style="font-size:17px;color:#${C.navy};margin-top:8px">O que fazer</h2>
    <ol style="font-size:14px;line-height:1.8;padding-left:22px"><li>[Primeira orientação]</li><li>[Segunda orientação]</li><li>[Terceira orientação]</li></ol>
    <div style="padding:12px 16px;border-left:4px solid #${C.bright};background:#${C.pale};color:#${C.blue};font-size:13.5px;line-height:1.7"><b>Quando:</b> [data, horário ou prazo]<br><b>Dúvidas:</b> [canal de contato]</div>
    <p style="font-size:12.5px;color:#${C.gray};margin-top:18px">[Área responsável]</p>
    <p class="note" style="margin-top:auto;padding-top:8px;border-top:1px solid #${C.line}">${NOTE}</p></main>`, { width: 794, height: 1123 })
  await save('modelo-comunicado-interno-gazin.pdf', await p.pdf({ format: 'A4', printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } }))
  await p.close()
}

// 5 · Kit de eventos: tela 16:9, sinalização A4, crachá (PNG) + PDF com tudo.
{
  const pieces = [
    { file: 'tela-abertura-16x9', w: 1920, h: 1080, html: `<section style="width:1920px;height:1080px;position:relative;overflow:hidden;background:radial-gradient(ellipse 55% 70% at 85% 15%,rgba(65,105,254,.55),transparent 70%),linear-gradient(150deg,#${C.blue},#${C.navy});color:#fff;padding:120px 140px;display:flex;flex-direction:column;justify-content:center;gap:28px">
        <img src="${L.dark}" style="position:absolute;top:90px;left:140px;width:300px">
        <p style="font-size:30px;font-weight:700;letter-spacing:.2em;color:#${C.light}">[NOME DO EVENTO]</p>
        <h1 style="font-size:120px;line-height:1;letter-spacing:-.03em;max-width:1300px">[Título da tela de abertura]</h1>
        <p style="font-size:38px;color:#${C.light}">[Data · Local]</p>
        <span style="width:220px;height:10px;border-radius:10px;background:#${C.bright}"></span></section>` },
    { file: 'sinalizacao-direcional-a4', w: 1754, h: 1240, html: `<section style="width:1754px;height:1240px;background:#fff;display:grid;grid-template-rows:auto 1fr auto;padding:90px 110px;border-top:40px solid #${C.blue}">
        <img src="${L.light}" style="width:360px">
        <div style="display:flex;align-items:center;gap:80px"><svg width="300" height="300" viewBox="0 0 24 24" fill="none" stroke="#${C.blue}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        <div><p style="font-size:48px;font-weight:700;letter-spacing:.14em;color:#${C.bright}">[ÁREA OU SALA]</p><h1 style="font-size:150px;line-height:1;color:#${C.navy}">[Destino]</h1></div></div>
        <p style="font-size:34px;color:#${C.gray}">[Nome do evento · Data]</p></section>` },
    { file: 'cracha', w: 1063, h: 1535, html: `<section style="width:1063px;height:1535px;background:#fff;display:grid;grid-template-rows:420px 1fr 160px;border-radius:0;overflow:hidden">
        <div style="background:linear-gradient(150deg,#${C.blue},#${C.navy});display:grid;place-items:center"><img src="${L.dark}" style="width:520px"></div>
        <div style="padding:90px 80px;display:flex;flex-direction:column;gap:22px"><p style="font-size:40px;font-weight:700;letter-spacing:.16em;color:#${C.bright}">[NOME DO EVENTO]</p><h1 style="font-size:120px;line-height:1.02;color:#${C.navy}">[Nome]</h1><p style="font-size:52px;color:#${C.gray}">[Área · Unidade]</p></div>
        <div style="background:#${C.bright};display:grid;place-items:center;color:#fff;font-size:44px;font-weight:700;letter-spacing:.12em">[PARTICIPANTE]</div></section>` },
  ]
  const zip = new JSZip()
  const pdfPages = []
  for (const piece of pieces) {
    const p = await pageOf(piece.html, { width: piece.w, height: piece.h })
    const png = await p.screenshot({ type: 'png' })
    zip.file(`Kit-Eventos-Gazin/${piece.file}.png`, png)
    pdfPages.push(`<div style="page-break-after:always;width:297mm;height:210mm;display:grid;place-items:center;background:#E9ECF7"><img src="data:image/png;base64,${png.toString('base64')}" style="max-width:262mm;max-height:178mm;box-shadow:0 8px 30px rgba(0,0,0,.18)"><p class="note" style="position:absolute;bottom:6mm">${NOTE} · ${piece.file}</p></div>`)
    await p.close()
  }
  zip.file('Kit-Eventos-Gazin/LEIA-ME.txt', `Kit de materiais de eventos · Gazin\n${NOTE}\n\nPeças: tela de abertura 16:9 (1920×1080), sinalização direcional A4 paisagem (150 dpi) e crachá (9×13 cm, 300 dpi).\nSubstitua os textos entre colchetes. Não altere nem recolore a logomarca.\nPara editar, use o PDF como referência e refaça a arte no software de criação com os mesmos elementos.\n`)
  await save('kit-materiais-eventos-gazin-png.zip', await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }))
  const p = await pageOf(`<style>@page{size:A4 landscape;margin:0} div{position:relative}</style>${pdfPages.join('')}`, { width: 1123, height: 794 })
  await save('kit-materiais-eventos-gazin.pdf', await p.pdf({ format: 'A4', landscape: true, printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } }))
  await p.close()
}
await browser.close()
await writeFile(join(root, 'src', 'data', 'internalTemplates.json'), JSON.stringify(files, null, 2) + '\n')
console.log('✓ src/data/internalTemplates.json')
