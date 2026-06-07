import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { api } from '../../services/api'
import type { Material, CategoriaMaterial, Obra } from '../../types'

interface MaterialModalProps {
  idFornecedor: number
  nomeFornecedor: string
  initialData?: Material
  onClose: () => void
  onSave: (material: Partial<Material>) => void
}

export function MaterialModal({ idFornecedor, nomeFornecedor, initialData, onClose, onSave }: MaterialModalProps) {
  const [codigo, setCodigo] = useState(initialData?.codigo || '')
  const [nome, setNome] = useState(initialData?.nome || '')
  const [idCategoria, setIdCategoria] = useState<number | ''>(initialData?.idCategoria || '')
  const [idsObras, setIdsObras] = useState<number[]>(initialData?.idsObras || [])
  
  const [categorias, setCategorias] = useState<CategoriaMaterial[]>([])
  const [obras, setObras] = useState<Obra[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingDados, setLoadingDados] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const [cats, obs] = await Promise.all([
          api.get<CategoriaMaterial[]>('/materiais/categoria'),
          api.get<Obra[]>('/obra')
        ])
        setCategorias(cats)
        setObras(obs)
        
        // Auto-select obra if there's only one and creating new
        if (!initialData && obs.length === 1) {
          setIdsObras([obs[0].id])
        }
      } catch (err) {
        console.error('Erro ao buscar dados complementares:', err)
      } finally {
        setLoadingDados(false)
      }
    }
    fetchDados()
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idCategoria || idsObras.length === 0) {
      setErro('Preencha todos os campos obrigatórios e selecione ao menos uma obra.')
      return
    }

    setErro(null)
    setLoading(true)
    try {
      await onSave({
        codigo,
        nome,
        idCategoria: Number(idCategoria),
        idsObras,
        idFornecedor
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
          <div>
            <h2 className="font-bold text-slate-800 dark:text-slate-200">
              {initialData ? 'Editar Material' : 'Novo Material'}
            </h2>
            <p className="text-xs text-slate-500">Para: {nomeFornecedor}</p>
          </div>
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
              Código (ex: MAT-005)
            </label>
            <input
              type="text"
              required
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900/50 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green transition-colors"
              placeholder="MAT-XXX"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Nome do Material
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={e => setNome(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900/50 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green transition-colors"
              placeholder="Ex: Tijolo Baiano 8 Furos"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              Categoria
            </label>
            <select
              required
              value={idCategoria}
              onChange={e => setIdCategoria(Number(e.target.value))}
              disabled={loadingDados}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900/50 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green transition-colors"
            >
              <option value="" disabled>Selecione uma categoria...</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nome} ({cat.codigo})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
              Vincular às Obras
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
              {obras.map(obra => (
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
              {obras.length === 0 && (
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
              {loading ? 'Salvando...' : 'Salvar Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
