import { TrendingUp, TrendingDown, DollarSign, Plus } from 'lucide-react'
import type { Transacao } from '../../types'

interface BudgetsScreenProps {
  transacoes: Transacao[]
  setModalTransacaoOpen: (open: boolean) => void
}

export function BudgetsScreen({ transacoes, setModalTransacaoOpen }: BudgetsScreenProps) {
  const totalReceitas = transacoes.filter(t => t.tipo === 'Receita').reduce((a, b) => a + b.valor, 0)
  const totalDespesas = transacoes.filter(t => t.tipo === 'Despesa').reduce((a, b) => a + b.valor, 0)
  const saldoLiquido = totalReceitas - totalDespesas

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Cards de Balanço */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-6 rounded-2xl shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Entradas / Receitas</span>
          <div className="flex items-center gap-2 mt-2">
            <span className="p-1 bg-emerald-500/10 rounded-lg text-emerald-600"><TrendingUp size={16} /></span>
            <h3 className="text-2xl font-bold text-emerald-600">
              R$ {totalReceitas.toLocaleString('pt-BR')}
            </h3>
          </div>
        </div>

        <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-6 rounded-2xl shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Saídas / Despesas</span>
          <div className="flex items-center gap-2 mt-2">
            <span className="p-1 bg-rose-500/10 rounded-lg text-rose-500"><TrendingDown size={16} /></span>
            <h3 className="text-2xl font-bold text-rose-500">
              R$ {totalDespesas.toLocaleString('pt-BR')}
            </h3>
          </div>
        </div>

        <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-6 rounded-2xl shadow-sm">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Saldo Líquido</span>
          <div className="flex items-center gap-2 mt-2">
            <span className="p-1 bg-brand-green/10 rounded-lg text-brand-green-hover"><DollarSign size={16} /></span>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              R$ {saldoLiquido.toLocaleString('pt-BR')}
            </h3>
          </div>
        </div>
      </div>

      {/* Tabela de Transações */}
      <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark rounded-2xl shadow-sm overflow-hidden">
        
        {/* Header da Tabela */}
        <div className="px-6 py-4 border-b border-brand-border-light dark:border-brand-border-dark flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-semibold">Registro de Lançamentos</h3>
          <button 
            onClick={() => setModalTransacaoOpen(true)}
            className="px-4 py-2 bg-brand-green hover:bg-brand-green-hover text-brand-green-dark font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all hover:scale-102 cursor-pointer"
          >
            <Plus size={14} /> Novo Lançamento
          </button>
        </div>

        {/* Tabela Real */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/40 text-xs font-bold text-slate-500 dark:text-slate-400 border-b border-brand-border-light dark:border-brand-border-dark">
                <th className="px-6 py-3.5">Descrição</th>
                <th className="px-6 py-3.5">Obra / Projeto</th>
                <th className="px-6 py-3.5">Categoria</th>
                <th className="px-6 py-3.5">Data</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border-light dark:divide-brand-border-dark text-sm">
              {transacoes.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                  <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">{t.descricao}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{t.obraNome}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{t.categoria}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{t.data}</td>
                  <td className="px-6 py-4">
                    <span className={`
                      px-2 py-0.5 rounded-full text-[10px] font-bold
                      ${t.status === 'Pago' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-500'}
                    `}>
                      {t.status === 'Pago' ? 'Liquidado' : 'Pendente'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${
                    t.tipo === 'Receita' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                  }`}>
                    {t.tipo === 'Receita' ? '+' : '-'} R$ {t.valor.toLocaleString('pt-BR')}
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


