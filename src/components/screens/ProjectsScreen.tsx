import { useState, useEffect } from 'react'
import { Search, Filter, Plus, Calendar, User } from 'lucide-react'
import type { Obra } from '../../types'
import { api } from '../../services/api'
import { ObraModal } from '../modals/ObraModal'

interface ProjectsScreenProps {
  showToast: (msg: string) => void
}

export function ProjectsScreen({ showToast }: ProjectsScreenProps) {
  const [obras, setObras] = useState<Obra[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

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
      await api.post('/obra', obraData)
      showToast('Obra cadastrada com sucesso!')
      setModalOpen(false)
      fetchObras()
    } catch (err: any) {
      showToast(err.message || 'Erro ao salvar obra')
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {obras.map((obra) => (
            <div 
              key={obra.id}
              className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-green/30 transition-all duration-300 flex flex-col justify-between gap-4"
            >
              {/* Topo do Card */}
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">{obra.nome}</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 truncate">
                    Código: {obra.codigo || '-'}
                  </span>
                </div>
                
                {/* Badge de Status */}
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-500/10 text-slate-500 dark:text-slate-400`}>
                  {obra.nomeStatusObra || 'Sem Status'}
                </span>
              </div>

              {/* Descrição */}
              {obra.descricao && (
                <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                  {obra.descricao}
                </div>
              )}

              {/* Rodapé do Card */}
              <div className="pt-4 border-t border-brand-border-light dark:border-brand-border-dark flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  <span>
                    {obra.dataInicio ? new Date(obra.dataInicio).toLocaleDateString('pt-BR') : 'Sem data'} - 
                    {obra.dataFim ? new Date(obra.dataFim).toLocaleDateString('pt-BR') : 'Sem fim'}
                  </span>
                </div>
                {obra.chaveResponsavel && (
                  <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                    <User size={13} />
                    <span>{obra.chaveResponsavel}</span>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <ObraModal 
          onClose={() => setModalOpen(false)} 
          onSave={handleSave} 
        />
      )}
    </div>
  )
}
