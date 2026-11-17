import { useDeferredValue, useMemo, useState } from 'react'
import { CalendarDays, Download, Eye, FileArchive, Search } from 'lucide-react'
import { calendar, calendarCover, campaigns, library, logoOf, logosZip, months, type Campaign } from '../../data/campaigns'
import { base, CampaignArt, categoryLabel, LogoDownload, useCampaignViewer, whenLabel } from './CampaignViewer'

type Category = 'todas' | 'institucionais' | 'promocionais' | 'recorrentes'
const categories: { id: Category; label: string }[] = [
  { id: 'todas', label: 'Todas' }, { id: 'institucionais', label: 'Institucionais' }, { id: 'promocionais', label: 'Promocionais' }, { id: 'recorrentes', label: 'Recorrentes' },
]
const normalize = (text: string) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
const matchesCategory = (campaign: Campaign, category: Category) =>
  category === 'todas' || (category === 'institucionais' ? campaign.category === 'institucional' : category === 'promocionais' ? campaign.category === 'promocional' : campaign.kind === 'recorrente')

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const open = useCampaignViewer()
  return <li className="cp-card">
    <button type="button" className="cp-card-art" onClick={() => open(campaign.id)} aria-label={`Ver detalhes: ${campaign.name}`}><CampaignArt campaign={campaign} /></button>
    <div className="cp-card-body">
      <p className="cp-card-meta">{categoryLabel(campaign)}</p>
      <p className="cp-card-name">{campaign.name}</p>
      <p className="cp-card-when"><CalendarDays size={13} aria-hidden="true" />{whenLabel(campaign)}</p>
      <p className="cp-card-text">{campaign.description}</p>
    </div>
    <div className="cp-card-actions">
      <button type="button" className="cp-view" onClick={() => open(campaign.id)}><Eye size={15} aria-hidden="true" />Visualizar</button>
      <LogoDownload campaign={campaign} compact />
    </div>
  </li>
}

/** Calendar 2027: cover, page count, download and view in a new tab (no inline page images). */
export function CalendarDownload() {
  return <aside className="cp-calendar" aria-labelledby="cp-calendar-title" data-cp-reveal>
    <img className="cp-calendar-cover" src={`${base}${calendarCover.path}`} width={calendarCover.width} height={calendarCover.height} alt="Capa do Calendário Gazin 2027, com a identidade dos 61 anos" loading="lazy" decoding="async" />
    <div className="cp-calendar-body">
      <p className="cp-kicker"><CalendarDays size={14} aria-hidden="true" />2027 · 61 anos Gazin</p>
      <h3 id="cp-calendar-title">{calendar.title}</h3>
      <p>{calendar.description}</p>
      <p className="cp-calendar-meta">PDF · {calendar.pages} páginas ({calendar.pagesNote}) · {calendar.sizeMB.toLocaleString('pt-BR')} MB</p>
      <div className="cp-calendar-actions">
        <a className="cp-button" href={`${base}${calendar.path}`} download={calendar.fileName} type="application/pdf"><Download size={17} aria-hidden="true" />Baixar calendário 2027</a>
        <a className="cp-button is-ghost" href={`${base}${calendar.path}`} target="_blank" rel="noopener" type="application/pdf"><Eye size={17} aria-hidden="true" />Visualizar calendário<span className="pos-sr-only"> (abre em nova aba)</span></a>
      </div>
    </div>
  </aside>
}

/** Library: search, filters (category, month, format), grid, individual and full downloads. */
export function CampaignLibrary() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category>('todas')
  const [month, setMonth] = useState('')
  const [format, setFormat] = useState('')
  const deferred = useDeferredValue(query)
  const results = useMemo(() => campaigns.filter(campaign =>
    matchesCategory(campaign, category)
    && (!month || campaign.month === Number(month))
    && (!format || (format === 'png' ? !!logoOf(campaign.id) : !logoOf(campaign.id)))
    && (!deferred.trim() || normalize(campaign.name).includes(normalize(deferred.trim())))), [category, month, format, deferred])
  const reset = () => { setQuery(''); setCategory('todas'); setMonth(''); setFormat('') }

  return <section className="cp-library" aria-labelledby="cp-library-title" data-cp-reveal>
    <header className="cp-library-head">
      <div>
        <p className="cp-kicker">Centro de recursos</p>
        <h3 id="cp-library-title">{library.title}</h3>
        <p>{library.description}</p>
      </div>
      <a className="cp-button" href={`${base}${logosZip.path}`} download={logosZip.fileName} type="application/zip">
        <FileArchive size={17} aria-hidden="true" />Baixar todas as logos 2027<small>ZIP · {logosZip.count} arquivos originais · {logosZip.sizeMB.toLocaleString('pt-BR')} MB</small>
      </a>
    </header>

    <div className="cp-filters" role="search">
      <label className="cp-search"><Search size={16} aria-hidden="true" /><span className="pos-sr-only">Pesquisar campanha</span>
        <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Pesquisar campanha" />
      </label>
      <div className="cp-chips" role="radiogroup" aria-label="Categoria">
        {categories.map(item => <button key={item.id} type="button" role="radio" aria-checked={category === item.id} onClick={() => setCategory(item.id)}>{item.label}</button>)}
      </div>
      <label className="cp-select"><span>Mês</span>
        <select value={month} onChange={event => setMonth(event.target.value)}>
          <option value="">Todos os meses</option>
          {months.map((name, index) => <option key={name} value={index + 1}>{name}</option>)}
        </select>
      </label>
      <label className="cp-select"><span>Formato</span>
        <select value={format} onChange={event => setFormat(event.target.value)}>
          <option value="">Todos</option>
          <option value="png">PNG disponível</option>
          <option value="none">Sem arquivo</option>
        </select>
      </label>
    </div>

    <p className="cp-count" aria-live="polite">{results.length} {results.length === 1 ? 'campanha' : 'campanhas'}</p>
    {results.length
      ? <ul className="cp-grid">{results.map(campaign => <CampaignCard key={campaign.id} campaign={campaign} />)}</ul>
      : <div className="cp-empty"><p>Nenhuma campanha encontrada com esses filtros.</p><button type="button" className="cp-view" onClick={reset}>Limpar filtros</button></div>}
  </section>
}
