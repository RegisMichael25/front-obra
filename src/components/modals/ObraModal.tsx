import { useState, useEffect } from 'react'
import { X, HardHat } from 'lucide-react'
import type { Obra } from '../../types'
import { api } from '../../services/api'

interface ObraModalProps {
  onClose: () => void
  onSave: (obra: Partial<Obra>) => void
}

export function ObraModal({ onClose, onSave }: ObraModalProps) {
  const [nome, setNome] = useState('')
  const [codigo, setCodigo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [idStatusObra, setIdStatusObra] = useState<number | ''>('')
  
  const [statusOptions, setStatusOptions] = useState<any[]>([])

  useEffect(() => {
    // Carregar opções de status
    api.get<any[]>('/obra/status')
      .then(res => {
        setStatusOptions(res)
        if (res.length > 0) setIdStatusObra(res[0].id)
      })
      .catch(() => {})
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      nome,
      codigo,
      descricao,
      dataInicio: dataInicio ? new Date(dataInicio).toISOString() : undefined,
      dataFim: dataFim ? new Date(dataFim).toISOString() : undefined,
      idStatusObra: Number(idStatusObra)
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
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Código da Obra *</label>
            <input 
              type="text" 
              required
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Descrição</label>
            <textarea 
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Data Início</label>
              <input 
                type="date" 
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Data Fim</label>
              <input 
                type="date" 
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Status da Obra *</label>
            <select 
              required
              value={idStatusObra}
              onChange={(e) => setIdStatusObra(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
            >
              <option value="" disabled>Selecione um status</option>
              {statusOptions.map(st => (
                <option key={st.id} value={st.id}>{st.nome}</option>
              ))}
            </select>
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
