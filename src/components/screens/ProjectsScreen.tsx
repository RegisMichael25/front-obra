import { useState, useEffect } from 'react'
import { Search, Filter, Plus, Calendar, User, FileDown, MapPin, Map, Edit2, Users } from 'lucide-react'
import type { Obra } from '../../types'
import { api } from '../../services/api'
import { ObraModal } from '../modals/ObraModal'
import { GerenciarOperadoresModal } from '../modals/GerenciarOperadoresModal'

interface ProjectsScreenProps {
  showToast: (msg: string) => void
}

export function ProjectsScreen({ showToast }: ProjectsScreenProps) {
  const [obras, setObras] = useState<Obra[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [obraToEdit, setObraToEdit] = useState<Obra | null>(null)
  const [exportingObraId, setExportingObraId] = useState<string | null>(null)
  const [obraParaOperadores, setObraParaOperadores] = useState<{id: number, nome: string} | null>(null)

  const fetchObras = async () => {
    try {
      setLoading(true)
      const data = await api.get<Obra[]>('/obra')
      setObras(data)
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar obras')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchObras()
  }, [])

  const handleSave = async (obraData: Partial<Obra>) => {
    try {
      if (obraData.id) {
        await api.put(`/obra/${obraData.id}`, obraData)
        showToast('Obra atualizada com sucesso!')
      } else {
        await api.post('/obra', obraData)
        showToast('Obra cadastrada com sucesso!')
      }
      setModalOpen(false)
      setObraToEdit(null)
      fetchObras()
    } catch (err: any) {
      showToast(err.message || 'Erro ao salvar obra')
    }
  }

  const handleExportObra = async (idObra: string) => {
    try {
      setExportingObraId(idObra)
      await api.download(`/relatorios/obra/${idObra}?formato=xlsx`, {
        filename: `obra-${idObra}.xlsx`
      })
      showToast('Relatório da obra gerado com sucesso')
    } catch (err: any) {
      showToast(err.message || 'Erro ao gerar relatório da obra')
    } finally {
      setExportingObraId(null)
    }
  }

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Barra de Filtros e Busca */}
      <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-4 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Pesquisar obras por nome..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green transition-colors"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-slate-500 flex items-center gap-1"><Filter size={12} /> Filtros:</span>
          <button className="px-3 py-1.5 bg-brand-green/20 text-brand-green-hover dark:text-brand-green border border-brand-green/30 text-xs font-semibold rounded-lg">Todos</button>
          <button className="px-3 py-1.5 bg-slate-50 border border-brand-border-light dark:bg-slate-900 dark:border-brand-border-dark text-xs text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">Ativos</button>

          <button 
            onClick={() => setModalOpen(true)}
            className="ml-auto md:ml-4 px-4 py-2 bg-brand-green hover:bg-brand-green-hover text-brand-green-dark font-bold text-xs md:text-sm rounded-xl flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus size={16} /> Cadastrar Obra
          </button>
        </div>
      </div>

      {/* Grid de Obras */}
      {loading ? (
        <div className="flex justify-center p-12">Carregando obras...</div>
      ) : obras.length === 0 ? (
        <div className="flex justify-center p-12 text-slate-500">Nenhuma obra cadastrada.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {obras.map((obra) => (
            <div 
              key={obra.id}
              className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-green/30 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Informações Principais */}
              <div className="flex-1 min-w-0 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{obra.nome}</h3>
                    <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 truncate">
                      Código: {obra.codigo || '-'}
                    </span>
                  </div>
                  
                  {/* Badge de Status */}
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase bg-slate-500/10 text-slate-500 dark:text-slate-400 shrink-0`}>
                    {obra.nomeStatusObra || 'Sem Status'}
                  </span>
                </div>

                {/* Descrição */}
                {obra.descricao && (
                  <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {obra.descricao}
                  </div>
                )}
                
                {/* Rodapé (Datas e Responsável) */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400" />
                    <span>
                      {obra.dataInicio ? new Date(obra.dataInicio).toLocaleDateString('pt-BR') : 'Sem data'} - 
                      {obra.dataFim ? new Date(obra.dataFim).toLocaleDateString('pt-BR') : 'Sem fim'}
                    </span>
                  </div>
                  {(obra.nomeResponsavel || obra.chaveResponsavel) && (
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                      <User size={16} className="text-slate-400" />
                      <span className="truncate">{obra.nomeResponsavel || obra.chaveResponsavel}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Lado Direito: Endereço e Ações */}
              <div className="flex flex-col md:items-end gap-4 md:w-[340px] shrink-0 md:border-l md:border-brand-border-light dark:md:border-brand-border-dark md:pl-6">
                
                {/* Endereço */}
                {(obra.logradouro || obra.bairro || obra.localidade || obra.cep) ? (
                  <div className="w-full flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60">
                    <MapPin size={18} className="text-brand-green mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {obra.logradouro ? `${obra.logradouro}${obra.numero ? `, ${obra.numero}` : ''}` : 'Sem logradouro'}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {[obra.bairro, obra.localidade ? `${obra.localidade}/${obra.uf || ''}` : ''].filter(Boolean).join(' - ') || 'Sem localidade'}
                      </p>
                      {obra.cep && <p className="text-[11px] text-slate-400 mt-1">CEP: {obra.cep}</p>}
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        [obra.logradouro, obra.numero, obra.bairro, obra.localidade, obra.uf, obra.cep].filter(Boolean).join(', ')
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl text-brand-green hover:bg-brand-green/10 dark:hover:bg-brand-green/20 transition-all cursor-pointer flex items-center justify-center shrink-0 self-center border border-brand-green/10 hover:border-brand-green/30"
                      title="Ver no Google Maps"
                    >
                      <Map size={20} />
                    </a>
                  </div>
                ) : (
                  <div className="w-full text-xs text-slate-400 dark:text-slate-500 italic p-4 bg-slate-50/50 dark:bg-slate-900/20 border border-dashed border-slate-100 dark:border-slate-800/40 rounded-xl flex items-center gap-2">
                    <MapPin size={16} className="text-slate-400 dark:text-slate-500" />
                    <span>Sem endereço cadastrado</span>
                  </div>
                )}

                {/* Ações */}
                <div className="flex items-center gap-2 w-full md:justify-end mt-2 md:mt-auto">
                  <button 
                    onClick={() => setObraParaOperadores({ id: obra.id, nome: obra.nome })}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold text-sm transition-colors cursor-pointer border border-blue-100 dark:border-blue-900/30"
                    title="Equipe de Operadores"
                  >
                    <Users size={16} /> <span className="md:hidden">Equipe</span>
                  </button>
                  <button 
                    onClick={() => {
                      setObraToEdit(obra)
                      setModalOpen(true)
                    }}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
                    title="Editar Obra"
                  >
                    <Edit2 size={16} /> <span className="md:hidden">Editar</span>
                  </button>
                  <button 
                    onClick={() => handleExportObra(obra.id.toString())}
                    disabled={exportingObraId === obra.id.toString()}
                    className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-bold text-sm transition-colors ${exportingObraId === obra.id.toString() ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-500' : 'bg-brand-green/10 hover:bg-brand-green/20 text-brand-green-hover dark:text-brand-green cursor-pointer border border-brand-green/20'}`}
                    title="Exportar Relatório (XLSX)"
                  >
                    <FileDown size={16} /> <span className="md:hidden">Exportar</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <ObraModal 
          obraToEdit={obraToEdit}
          onClose={() => {
            setModalOpen(false)
            setObraToEdit(null)
          }} 
          onSave={handleSave} 
        />
      )}

      {obraParaOperadores && (
        <GerenciarOperadoresModal
          idObra={obraParaOperadores.id}
          nomeObra={obraParaOperadores.nome}
          onClose={() => setObraParaOperadores(null)}
          showToast={showToast}
        />
      )}
    </div>
  )
}
