import { Package, AlertTriangle, X } from 'lucide-react'
import type { EstoqueItem } from '../../types'

interface InventoryScreenProps {
  estoque: EstoqueItem[]
  handleSolicitarReposicao: (itemId: string, itemNome: string) => void
}

export function InventoryScreen({ estoque, handleSolicitarReposicao }: InventoryScreenProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Métricas do Almoxarifado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total de Itens</span>
            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{estoque.length}</h3>
          </div>
          <span className="p-3 bg-brand-green/10 rounded-2xl text-brand-green-hover dark:text-brand-green"><Package size={22} /></span>
        </div>

        <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Itens Críticos</span>
            <h3 className="text-2xl font-bold mt-1 text-amber-500">{estoque.filter(i => i.status === 'Crítico').length}</h3>
          </div>
          <span className="p-3 bg-amber-500/10 rounded-2xl text-amber-500"><AlertTriangle size={22} /></span>
        </div>

        <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Items Esgotados</span>
            <h3 className="text-2xl font-bold mt-1 text-rose-500">{estoque.filter(i => i.status === 'Esgotado').length}</h3>
          </div>
          <span className="p-3 bg-rose-500/10 rounded-2xl text-rose-500"><X size={22} /></span>
        </div>
      </div>

      {/* Tabela do Estoque */}
      <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark rounded-2xl shadow-sm overflow-hidden">
        
        <div className="px-6 py-4 border-b border-brand-border-light dark:border-brand-border-dark flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-semibold">Tabela de Almoxarifado</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-brand-green/20 text-brand-green-hover dark:text-brand-green border border-brand-green/30 text-xs font-semibold rounded-lg">Todos</button>
            <button className="px-3 py-1 bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark text-xs text-slate-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">Críticos/Esgotados</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/40 text-xs font-bold text-slate-500 dark:text-slate-400 border-b border-brand-border-light dark:border-brand-border-dark">
                <th className="px-6 py-3.5">Nome do Item</th>
                <th className="px-6 py-3.5">Categoria</th>
                <th className="px-6 py-3.5">Quantidade Atual</th>
                <th className="px-6 py-3.5">Mínimo Recomendado</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border-light dark:divide-brand-border-dark text-sm">
              {estoque.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                  <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">{item.item}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{item.categoria}</td>
                  <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">
                    {item.quantidade} {item.unidade}
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    {item.estoqueMinimo} {item.unidade}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`
                      px-2 py-0.5 rounded-full text-[10px] font-bold
                      ${item.status === 'Adequado' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : ''}
                      ${item.status === 'Crítico' ? 'bg-amber-500/10 text-amber-500' : ''}
                      ${item.status === 'Esgotado' ? 'bg-rose-500/10 text-rose-500' : ''}
                    `}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleSolicitarReposicao(item.id, item.item)}
                      disabled={item.status === 'Adequado'}
                      className={`
                        px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                        ${item.status === 'Adequado'
                          ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                          : 'bg-brand-green/20 text-brand-green-hover dark:text-brand-green hover:bg-brand-green/30 cursor-pointer'}
                      `}
                    >
                      Repor +50
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  )
}


