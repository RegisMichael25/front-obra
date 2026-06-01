import { Search, Filter, Plus, MapPin, Calendar, User } from 'lucide-react'
import type { Obra } from '../../types'

interface ProjectsScreenProps {
  obras: Obra[]
  setModalObraOpen: (open: boolean) => void
}

export function ProjectsScreen({ obras, setModalObraOpen }: ProjectsScreenProps) {
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
            onClick={() => setModalObraOpen(true)}
            className="ml-auto md:ml-4 px-4 py-2 bg-brand-green hover:bg-brand-green-hover text-brand-green-dark font-bold text-xs md:text-sm rounded-xl flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus size={16} /> Cadastrar Obra
          </button>
        </div>
      </div>

      {/* Grid de Obras */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {obras.map((obra) => {
          const gastoPercent = obra.orcamentoTotal > 0 ? Math.round((obra.orcamentoGasto / obra.orcamentoTotal) * 100) : 0
          
          return (
            <div 
              key={obra.id}
              className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-green/30 transition-all duration-300 flex flex-col justify-between gap-4"
            >
              {/* Topo do Card */}
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">{obra.nome}</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 truncate">
                    <MapPin size={12} className="shrink-0" /> {obra.endereco}
                  </span>
                </div>
                
                {/* Badge de Status */}
                <span className={`
                  px-2.5 py-1 rounded-full text-[10px] font-bold uppercase
                  ${obra.status === 'Andamento' ? 'bg-blue-500/10 text-blue-500' : ''}
                  ${obra.status === 'Concluido' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : ''}
                  ${obra.status === 'Planejamento' ? 'bg-slate-500/10 text-slate-500 dark:text-slate-400' : ''}
                `}>
                  {obra.status}
                </span>
              </div>

              {/* Progresso de Obra */}
              <div>
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>Progresso da Construção</span>
                  <span className="font-bold">{obra.progresso}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-green rounded-full transition-all duration-500"
                    style={{ width: `${obra.progresso}%` }}
                  ></div>
                </div>
              </div>

              {/* Progresso Financeiro da Obra */}
              <div>
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                  <span>Orçamento Utilizado</span>
                  <span className={`font-semibold ${gastoPercent > 90 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>
                    R$ {obra.orcamentoGasto.toLocaleString('pt-BR')} ({gastoPercent}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      gastoPercent > 90 ? 'bg-rose-500' : gastoPercent > 70 ? 'bg-amber-500' : 'bg-slate-400'
                    }`}
                    style={{ width: `${Math.min(gastoPercent, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                  <span>Total Alocado: R$ {obra.orcamentoTotal.toLocaleString('pt-BR')}</span>
                </div>
              </div>

              {/* Rodapé do Card */}
              <div className="pt-4 border-t border-brand-border-light dark:border-brand-border-dark flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  <span>{obra.dataInicio} - {obra.dataFim}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                  <User size={13} />
                  <span>{obra.responsavel}</span>
                </div>
              </div>

            </div>
          )
        })}
      </div>

    </div>
  )
}


