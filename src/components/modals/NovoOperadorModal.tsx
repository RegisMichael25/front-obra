import { useState } from 'react'
import { X, UserPlus, Save, AlertCircle } from 'lucide-react'
import { api } from '../../services/api'

interface NovoOperadorModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function NovoOperadorModal({ onClose, onSuccess }: NovoOperadorModalProps) {
  const [nome, setNome] = useState('')
  const [chave, setChave] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome || !chave || !senha) {
      setError('Por favor, preencha todos os campos.')
      return
    }

    try {
      setLoading(true)
      setError(null)
      await api.post('/usuarios/operadores', { nome, chave, senha })
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Erro ao criar operador')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-brand-card-dark border border-brand-border-light dark:border-brand-border-dark rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-brand-border-light dark:border-brand-border-dark bg-slate-50/50 dark:bg-slate-900/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-green/20 text-brand-green-dark dark:text-brand-green flex items-center justify-center">
              <UserPlus size={18} />
            </div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Novo Operador</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-sm flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form id="novoOperadorForm" onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Nome Completo</label>
              <input 
                type="text" 
                value={nome}
                onChange={e => setNome(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green transition-colors text-slate-800 dark:text-slate-200"
                placeholder="Ex: João Silva"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Login (Chave/CPF)</label>
              <input 
                type="text" 
                value={chave}
                onChange={e => setChave(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green transition-colors text-slate-800 dark:text-slate-200"
                placeholder="Ex: joao.silva ou 12345678900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Senha</label>
              <input 
                type="password" 
                value={senha}
                onChange={e => setSenha(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green transition-colors text-slate-800 dark:text-slate-200"
                placeholder="******"
                required
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-brand-border-light dark:border-brand-border-dark bg-slate-50 dark:bg-slate-900/50 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            form="novoOperadorForm"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-brand-green-dark bg-brand-green hover:bg-brand-green-hover rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <Save size={16} />
            {loading ? 'Salvando...' : 'Salvar Operador'}
          </button>
        </div>
      </div>
    </div>
  )
}
