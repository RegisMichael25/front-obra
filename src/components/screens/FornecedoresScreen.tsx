import { useState, useEffect } from 'react'
import { Search, Plus, Truck, Package, ChevronDown, ChevronUp, Edit2, Trash2 } from 'lucide-react'
import { api } from '../../services/api'
import type { Fornecedor, Material } from '../../types'
import { FornecedorModal } from '../modals/FornecedorModal'
import { MaterialModal } from '../modals/MaterialModal'

export function FornecedoresScreen() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [materiais, setMateriais] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  
  const [modalFornecedorOpen, setModalFornecedorOpen] = useState(false)
  const [fornecedorToEdit, setFornecedorToEdit] = useState<Fornecedor | null>(null)
  
  const [modalMaterialOpenFor, setModalMaterialOpenFor] = useState<Fornecedor | null>(null)
  const [materialToEdit, setMaterialToEdit] = useState<Material | null>(null)
  
  const [expandedFornecedor, setExpandedFornecedor] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchData = async () => {
    try {
      setLoading(true)
      const [forns, mats] = await Promise.all([
        api.get<Fornecedor[]>('/fornecedores'),
        api.get<Material[]>('/materiais')
      ])
      setFornecedores(forns)
      setMateriais(mats)
    } catch (err: any) {
      console.error('Erro ao buscar dados:', err)
      alert('Erro ao carregar fornecedores e materiais')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSaveFornecedor = async (data: Partial<Fornecedor>) => {
    try {
      const payload = {
        ...data
      }

      if (fornecedorToEdit) {
        await api.put(`/fornecedores/${fornecedorToEdit.id}`, payload)
      } else {
        await api.post('/fornecedores', payload)
      }
      
      setModalFornecedorOpen(false)
      setFornecedorToEdit(null)
      fetchData()
    } catch (err: any) {
      console.error(err)
      const errorMsg = err.response?.data?.message || err.message || 'Erro ao salvar fornecedor'
      throw new Error(errorMsg)
    }
  }

  const handleDeleteFornecedor = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm('Tem certeza que deseja excluir este fornecedor? Produtos vinculados também podem ser afetados.')) return
    
    try {
      await api.delete(`/fornecedores/${id}`)
      fetchData()
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Erro ao excluir fornecedor')
    }
  }

  const handleSaveMaterial = async (data: Partial<Material>) => {
    try {
      if (materialToEdit) {
        await api.put(`/materiais/${materialToEdit.id}`, data)
      } else {
        await api.post('/materiais', data)
      }
      setModalMaterialOpenFor(null)
      setMaterialToEdit(null)
      fetchData()
    } catch (err: any) {
      console.error(err)
      const errorMsg = err.response?.data?.message || err.message || 'Erro ao salvar material'
      throw new Error(errorMsg)
    }
  }

  const handleDeleteMaterial = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return
    
    try {
      await api.delete(`/materiais/${id}`)
      fetchData()
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Erro ao excluir produto')
    }
  }

  const toggleExpand = (id: number) => {
    setExpandedFornecedor(expandedFornecedor === id ? null : id)
  }

  const filteredFornecedores = fornecedores.filter(f => 
    f.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.codigo.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Bar */}
      <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-4 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Pesquisar fornecedores..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green transition-colors"
          />
        </div>
        
        <button 
          onClick={() => setModalFornecedorOpen(true)}
          className="px-4 py-2 bg-brand-green hover:bg-brand-green-hover text-brand-green-dark font-bold text-xs md:text-sm rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Plus size={16} /> Novo Fornecedor
        </button>
      </div>

      {/* Lista de Fornecedores */}
      {loading ? (
        <div className="flex justify-center p-12 text-slate-500">Carregando dados...</div>
      ) : filteredFornecedores.length === 0 ? (
        <div className="flex justify-center p-12 text-slate-500">Nenhum fornecedor encontrado.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredFornecedores.map(forn => {
            const isExpanded = expandedFornecedor === forn.id
            const mats = materiais.filter(m => m.idFornecedor === forn.id)

            return (
              <div key={forn.id} className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
                {/* Header do Card */}
                <div 
                  className={`p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors ${isExpanded ? 'bg-slate-50 dark:bg-slate-900/50 border-b border-brand-border-light dark:border-brand-border-dark' : ''}`}
                  onClick={() => toggleExpand(forn.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                      <Truck size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">{forn.nome}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-indigo-500 dark:text-indigo-400">
                          {forn.codigo}
                        </span>
                        {forn.telefone && <span>{forn.telefone}</span>}
                        <span>• {mats.length} produtos cadastrados</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        setFornecedorToEdit(forn)
                        setModalFornecedorOpen(true)
                      }}
                      className="p-1.5 text-slate-400 hover:text-brand-green hover:bg-brand-green/10 rounded-lg transition-colors"
                      title="Editar Fornecedor"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteFornecedor(forn.id, e)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Excluir Fornecedor"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="text-slate-400 ml-2">
                      {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                    </div>
                  </div>
                </div>

                {/* Conteúdo Expandido (Materiais) */}
                {isExpanded && (
                  <div className="p-5 bg-slate-50/50 dark:bg-slate-900/20">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Package size={16} /> Produtos Disponibilizados
                      </h4>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          setModalMaterialOpenFor(forn)
                        }}
                        className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-brand-border-light dark:border-brand-border-dark hover:border-brand-green dark:hover:border-brand-green text-xs font-bold text-slate-700 dark:text-slate-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                      >
                        <Plus size={14} /> Adicionar Produto
                      </button>
                    </div>

                    {mats.length === 0 ? (
                      <p className="text-sm text-slate-500 italic p-4 bg-white dark:bg-brand-card-dark rounded-xl border border-dashed border-brand-border-light dark:border-brand-border-dark text-center">
                        Nenhum produto cadastrado para este fornecedor.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {mats.map(mat => (
                          <div key={mat.id} className="bg-white dark:bg-brand-card-dark p-3 rounded-xl border border-brand-border-light dark:border-brand-border-dark flex items-start gap-3 shadow-sm hover:border-brand-green/30 transition-colors">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                              <Package size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate" title={mat.nome}>{mat.nome}</p>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button 
                                    onClick={() => setMaterialToEdit(mat)}
                                    className="p-1 text-slate-400 hover:text-brand-green hover:bg-brand-green/10 rounded-md transition-colors"
                                    title="Editar Produto"
                                  >
                                    <Edit2 size={14} />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteMaterial(mat.id)}
                                    className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-md transition-colors"
                                    title="Excluir Produto"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{mat.codigo}</span>
                                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">{mat.nomeCategoria}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Modals */}
      {modalFornecedorOpen && (
        <FornecedorModal 
          fornecedoresExistentes={fornecedores}
          initialData={fornecedorToEdit || undefined}
          onClose={() => {
            setModalFornecedorOpen(false)
            setFornecedorToEdit(null)
          }}
          onSave={handleSaveFornecedor}
        />
      )}

      {(modalMaterialOpenFor || materialToEdit) && (
        <MaterialModal 
          idFornecedor={modalMaterialOpenFor?.id || materialToEdit!.idFornecedor}
          nomeFornecedor={modalMaterialOpenFor?.nome || fornecedores.find(f => f.id === materialToEdit!.idFornecedor)?.nome || ''}
          initialData={materialToEdit || undefined}
          onClose={() => {
            setModalMaterialOpenFor(null)
            setMaterialToEdit(null)
          }}
          onSave={handleSaveMaterial}
        />
      )}
    </div>
  )
}
