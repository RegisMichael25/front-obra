import { useState } from 'react'
import { X, DollarSign } from 'lucide-react'
import type { Obra, Transacao } from '../../types'

interface TransacaoModalProps {
  obras: Obra[]
  onClose: () => void
  onSave: (transacao: {
    descricao: string
    obraNome: string
    valor: number
    tipo: Transacao['tipo']
    categoria: Transacao['categoria']
    status: Transacao['status']
  }) => void
}

export function TransacaoModal({ obras, onClose, onSave }: TransacaoModalProps) {
  const [descricao, setDescricao] = useState('')
  const [obraNome, setObraNome] = useState('')
  const [valor, setValor] = useState(0)
  const [tipo, setTipo] = useState<Transacao['tipo']>('Despesa')
  const [categoria, setCategoria] = useState<Transacao['categoria']>('Material')
  const [status, setStatus] = useState<Transacao['status']>('Pendente')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      descricao,
      obraNome,
      valor,
      tipo,
      categoria,
      status
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-brand-card-dark border border-brand-border-light dark:border-brand-border-dark rounded-2xl w-full max-w-md shadow-2xl p-6 overflow-hidden animate-scaleIn">
        <div className="flex justify-between items-center pb-4 border-b border-brand-border-light dark:border-brand-border-dark">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <DollarSign className="text-brand-green" size={18} /> Registrar Lançamento
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Descrição do Lançamento *</label>
            <input 
              type="text" 
              required
              placeholder="Ex: Compra de areia lavada grossa"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Vincular à Obra *</label>
            <select 
              value={obraNome}
              required
              onChange={(e) => setObraNome(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
            >
              <option value="">Selecione uma obra...</option>
              {obras.map(o => (
                <option key={o.id} value={o.nome}>{o.nome}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Valor (R$) *</label>
              <input 
                type="number" 
                required
                placeholder="Ex: 1250"
                value={valor || ''}
                onChange={(e) => setValor(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Tipo de Lançamento</label>
              <select 
                value={tipo}
                onChange={(e) => setTipo(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
              >
                <option value="Despesa">Saída (Despesa)</option>
                <option value="Receita">Entrada (Receita)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Categoria de Custo</label>
              <select 
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
              >
                <option value="Material">Material</option>
                <option value="Mão de Obra">Mão de Obra</option>
                <option value="Equipamentos">Equipamentos</option>
                <option value="Administrativo">Administrativo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Status Pagamento</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
              >
                <option value="Pago">Liquidado (Pago)</option>
                <option value="Pendente">Pendente</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-brand-border-light dark:border-brand-border-dark justify-end">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:opacity-90 rounded-xl text-xs font-bold cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-5 py-2 bg-brand-green hover:bg-brand-green-hover text-brand-green-dark font-bold rounded-xl text-xs cursor-pointer shadow-md shadow-brand-green/10"
            >
              Confirmar Lançamento
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


