import { useState } from 'react'
import { X, HardHat } from 'lucide-react'
import type { Obra } from '../../types'

interface ObraModalProps {
  onClose: () => void
  onSave: (obra: {
    nome: string
    endereco: string
    progresso: number
    orcamentoTotal: number
    responsavel: string
    status: Obra['status']
  }) => void
}

export function ObraModal({ onClose, onSave }: ObraModalProps) {
  const [nome, setNome] = useState('')
  const [endereco, setEndereco] = useState('')
  const [orcamentoTotal, setOrcamentoTotal] = useState(0)
  const [progresso, setProgresso] = useState(0)
  const [status, setStatus] = useState<Obra['status']>('Planejamento')
  const [responsavel, setResponsavel] = useState('Eng. Marcos Silva')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      nome,
      endereco,
      progresso,
      orcamentoTotal,
      responsavel,
      status
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-brand-card-dark border border-brand-border-light dark:border-brand-border-dark rounded-2xl w-full max-w-md shadow-2xl p-6 overflow-hidden animate-scaleIn">
        <div className="flex justify-between items-center pb-4 border-b border-brand-border-light dark:border-brand-border-dark">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HardHat className="text-brand-green" size={18} /> Cadastrar Nova Obra
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Nome do Projeto *</label>
            <input 
              type="text" 
              required
              placeholder="Ex: Edifício Green Tower"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Endereço *</label>
            <input 
              type="text" 
              required
              placeholder="Ex: Av. Atlântica, 100 - Balneário Camboriú, SC"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Orçamento Total (R$) *</label>
              <input 
                type="number" 
                required
                placeholder="Ex: 500000"
                value={orcamentoTotal || ''}
                onChange={(e) => setOrcamentoTotal(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Progresso Inicial (%)</label>
              <input 
                type="number" 
                min="0"
                max="100"
                value={progresso}
                onChange={(e) => setProgresso(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Status da Obra</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
              >
                <option value="Planejamento">Planejamento</option>
                <option value="Andamento">Em Andamento</option>
                <option value="Concluido">Concluído</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Responsável</label>
              <select 
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
              >
                <option value="Eng. Marcos Silva">Eng. Marcos Silva</option>
                <option value="Engª. Sofia Costa">Engª. Sofia Costa</option>
                <option value="Eng. Roberto Azevedo">Eng. Roberto Azevedo</option>
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
              Salvar Obra
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


