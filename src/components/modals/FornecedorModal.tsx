import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Fornecedor, Obra } from '../../types'
import { api } from '../../services/api'

interface FornecedorModalProps {
  fornecedoresExistentes: Fornecedor[]
  initialData?: Fornecedor
  onClose: () => void
  onSave: (fornecedor: Partial<Fornecedor>) => void
}

export function FornecedorModal({ fornecedoresExistentes, initialData, onClose, onSave }: FornecedorModalProps) {
  const [codigo, setCodigo] = useState(initialData?.codigo || '')
  const [nome, setNome] = useState(initialData?.nome || '')
  const [telefone, setTelefone] = useState(initialData?.telefone || '')
  const [idsObras, setIdsObras] = useState<number[]>(initialData?.idsObras || [])
  const [loading, setLoading] = useState(false)
  const [obrasDisponiveis, setObrasDisponiveis] = useState<Obra[]>([])

  useEffect(() => {
    api.get<Obra[]>('/obra')
      .then(res => setObrasDisponiveis(res))
      .catch(err => console.error('Erro ao buscar obras:', err))
  }, [])

  const formatTelefone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length === 0) return ''
    if (digits.length <= 2) return `(${digits}`
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(formatTelefone(e.target.value))
  }
  const [erro, setErro] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro(null)

    // Validar se o código já existe (ignorando se for o próprio)
    const codigoJaExiste = fornecedoresExistentes.some(
      f => f.codigo.toLowerCase() === codigo.trim().toLowerCase() && f.id !== initialData?.id
    )

    if (codigoJaExiste) {
      setErro('Já existe um fornecedor cadastrado com este código.')
      return
    }

    setLoading(true)
    try {
      await onSave({
        codigo,
        nome,
        telefone,
        ativo: true,
        idsObras
      })
    } catch (err: any) {
      setErro(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-brand-card-dark w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-slideUp">
        <div className="flex items-center justify-between p-4 border-b border-brand-border-light dark:border-brand-border-dark bg-slate-50 dark:bg-slate-900/50">
          <h2 className="font-bold text-slate-800 dark:text-slate-200">
            {initialData ? 'Editar Fornecedor' : 'Novo Fornecedor'}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {erro && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-xl">
              {erro}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Código (ex: FORN-004)
            </label>
            <input
              type="text"
              required
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900/50 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green transition-colors"
              placeholder="FORN-XXX"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Nome do Fornecedor
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={e => setNome(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900/50 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green transition-colors"
              placeholder="Ex: Construmax Materiais"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Telefone
            </label>
            <input
              type="text"
              value={telefone}
              onChange={handleTelefoneChange}
              maxLength={15}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900/50 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green transition-colors"
              placeholder="(XX) XXXXX-XXXX"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
              Vincular às Obras
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
              {obrasDisponiveis.map(obra => (
                <label key={obra.id} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={idsObras.includes(obra.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setIdsObras([...idsObras, obra.id])
                      } else {
                        setIdsObras(idsObras.filter(id => id !== obra.id))
                      }
                    }}
                    className="w-4 h-4 text-brand-green bg-slate-100 border-slate-300 rounded focus:ring-brand-green focus:ring-2 dark:bg-slate-700 dark:border-slate-600 cursor-pointer"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                    {obra.nome}
                  </span>
                </label>
              ))}
              {obrasDisponiveis.length === 0 && (
                <p className="text-xs text-slate-500 italic">Nenhuma obra encontrada.</p>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-bold bg-brand-green hover:bg-brand-green-hover text-brand-green-dark rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Fornecedor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
