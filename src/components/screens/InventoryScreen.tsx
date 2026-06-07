import { useState, useEffect } from 'react'
import { Package, AlertTriangle, X, FileDown } from 'lucide-react'
import type { EstoqueItem, Obra } from '../../types'
import { api } from '../../services/api'

interface InventoryScreenProps {
  showToast: (msg: string) => void
}

export function InventoryScreen({ showToast }: InventoryScreenProps) {
  const [obras, setObras] = useState<Obra[]>([])
  const [selectedObra, setSelectedObra] = useState<string>('')
  const [estoque, setEstoque] = useState<EstoqueItem[]>([])
  const [loading, setLoading] = useState(false)
  const [exportingFormat, setExportingFormat] = useState<'csv' | null>(null)

  const exportEndpoints = {
    csv: (idObra: string) => `/relatorios/movimentacao/estoque?formato=csv&idObra=${idObra}`
  } as const

  // Carregar lista de obras ao abrir a tela
  useEffect(() => {
    api.get<Obra[]>('/obra')
      .then(res => {
        setObras(res)
        if (res.length > 0) {
          setSelectedObra(res[0].id.toString())
        }
      })
      .catch(err => showToast(err.message || 'Erro ao carregar obras'))
  }, [])

  // Carregar estoque quando a obra selecionada mudar
  useEffect(() => {
    if (!selectedObra) return
    
    let isMounted = true

    const fetchEstoque = async (silent = false) => {
      if (!silent) setLoading(true)
      try {
        const res = await api.get<EstoqueItem[]>(`/obra/estoque?idObra=${selectedObra}`)
        if (isMounted) {
          const itensFiltrados = res.filter(item => item.idObra.toString() === selectedObra)
          setEstoque(itensFiltrados)
        }
      } catch (err: any) {
        if (isMounted && !silent) showToast(err.message || 'Erro ao carregar estoque')
      } finally {
        if (isMounted && !silent) setLoading(false)
      }
    }

    fetchEstoque(false)

    const interval = setInterval(() => {
      fetchEstoque(true)
    }, 5000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [selectedObra])

  const [editingMinimoId, setEditingMinimoId] = useState<number | null>(null)
  const [editMinimoValue, setEditMinimoValue] = useState<string>('')

  const handleSaveMinimo = async (item: EstoqueItem) => {
    if (!editingMinimoId) return
    const numValue = Number(editMinimoValue)
    if (isNaN(numValue) || numValue < 0) {
      showToast('Valor inválido para o mínimo recomendado.')
      setEditingMinimoId(null)
      return
    }

    try {
      await api.put(`/obra/estoque/${item.id}`, {
        ...item,
        quantidadeMinima: numValue
      })
      setEstoque(prev => prev.map(i => i.id === item.id ? { ...i, quantidadeMinima: numValue } : i))
      showToast('Mínimo recomendado atualizado!')
    } catch (err: any) {
      showToast(err.message || 'Erro ao atualizar o mínimo.')
    } finally {
      setEditingMinimoId(null)
    }
  }

  const handleExport = async (format: 'csv') => {
    if (!selectedObra) {
      showToast('Selecione uma obra para exportar o estoque')
      return
    }

    try {
      setExportingFormat(format)
      await api.download(exportEndpoints[format](selectedObra), {
        filename: `estoque-obra-${selectedObra}.${format}`
      })
      showToast(`Arquivo ${format.toUpperCase()} gerado com sucesso`)
    } catch (err: any) {
      showToast(err.message || `Erro ao gerar ${format.toUpperCase()}`)
    } finally {
      setExportingFormat(null)
    }
  }

  const getStatus = (qtd: number, min: number) => {
    if (qtd === 0) return 'Esgotado'
    if (qtd <= min) return 'Crítico'
    if (qtd <= min * 1.2) return 'Atenção'
    return 'Adequado'
  }

  const itensCriticos = estoque.filter(i => getStatus(i.quantidadeAtual, i.quantidadeMinima) === 'Crítico').length
  const itensEsgotados = estoque.filter(i => getStatus(i.quantidadeAtual, i.quantidadeMinima) === 'Esgotado').length
  const itensAtencao = estoque.filter(i => getStatus(i.quantidadeAtual, i.quantidadeMinima) === 'Atenção').length

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Seleção de Obra */}
      <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-5 rounded-2xl shadow-sm">
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Selecione a Obra</label>
        <select
          value={selectedObra}
          onChange={(e) => setSelectedObra(e.target.value)}
          className="w-full md:w-1/2 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
        >
          <option value="" disabled>Selecione uma obra</option>
          {obras.map(obra => (
            <option key={obra.id} value={obra.id}>{obra.nome}</option>
          ))}
        </select>
      </div>

      {/* Métricas do Almoxarifado */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total de Itens</span>
            <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{estoque.length}</h3>
          </div>
          <span className="p-3 bg-brand-green/10 rounded-2xl text-brand-green-hover dark:text-brand-green"><Package size={22} /></span>
        </div>

        <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Em Atenção</span>
            <h3 className="text-2xl font-bold mt-1 text-amber-500">{itensAtencao}</h3>
          </div>
          <span className="p-3 bg-amber-500/10 rounded-2xl text-amber-500"><AlertTriangle size={22} /></span>
        </div>

        <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Críticos</span>
            <h3 className="text-2xl font-bold mt-1 text-rose-500">{itensCriticos}</h3>
          </div>
          <span className="p-3 bg-rose-500/10 rounded-2xl text-rose-500"><AlertTriangle size={22} /></span>
        </div>

        <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Esgotados</span>
            <h3 className="text-2xl font-bold mt-1 text-red-600 dark:text-red-500">{itensEsgotados}</h3>
          </div>
          <span className="p-3 bg-red-500/10 rounded-2xl text-red-600 dark:text-red-500"><X size={22} /></span>
        </div>
      </div>

      {/* Tabela do Estoque */}
      <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark rounded-2xl shadow-sm overflow-hidden">
        
        <div className="px-6 py-4 border-b border-brand-border-light dark:border-brand-border-dark flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-semibold">Tabela de Almoxarifado</h3>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleExport('csv')}
              disabled={exportingFormat !== null || !selectedObra}
              className="px-3 py-1.5 bg-slate-50 border border-brand-border-light dark:bg-slate-900 dark:border-brand-border-dark text-xs font-semibold text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 flex items-center gap-1.5"
            >
              <FileDown size={13} /> {exportingFormat === 'csv' ? 'Gerando...' : 'CSV'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">Carregando estoque...</div>
        ) : estoque.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Nenhum item cadastrado para esta obra.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/40 text-xs font-bold text-slate-500 dark:text-slate-400 border-b border-brand-border-light dark:border-brand-border-dark">
                  <th className="px-6 py-3.5">Nome do Item</th>
                  <th className="px-6 py-3.5">Fornecedor</th>
                  <th className="px-6 py-3.5">Quantidade Atual</th>
                  <th className="px-6 py-3.5">Mínimo Recomendado</th>
                  <th className="px-6 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border-light dark:divide-brand-border-dark text-sm">
                {estoque.map((item) => {
                  const status = getStatus(item.quantidadeAtual, item.quantidadeMinima)

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                      <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">{item.nomeMaterial}</td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{item.nomeFornecedor || '-'}</td>
                      <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">
                        {item.quantidadeAtual}
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        {editingMinimoId === item.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={editMinimoValue}
                              onChange={e => setEditMinimoValue(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') handleSaveMinimo(item)
                                if (e.key === 'Escape') setEditingMinimoId(null)
                              }}
                              className="w-20 px-2 py-1 text-sm bg-white dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-md focus:outline-none focus:border-brand-green"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveMinimo(item)}
                              className="text-[10px] font-bold bg-brand-green text-white px-2 py-1 rounded hover:bg-brand-green-hover"
                            >
                              OK
                            </button>
                            <button
                              onClick={() => setEditingMinimoId(null)}
                              className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setEditingMinimoId(item.id)
                              setEditMinimoValue(item.quantidadeMinima.toString())
                            }}
                            className="cursor-pointer hover:text-brand-green transition-colors flex items-center gap-2 group"
                            title="Clique para editar"
                          >
                            {item.quantidadeMinima}
                            <span className="opacity-0 group-hover:opacity-100 text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 transition-opacity">
                              editar
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`
                          px-2 py-0.5 rounded-full text-[10px] font-bold
                          ${status === 'Adequado' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : ''}
                          ${status === 'Atenção' ? 'bg-amber-500/10 text-amber-500' : ''}
                          ${status === 'Crítico' ? 'bg-rose-500/10 text-rose-500' : ''}
                          ${status === 'Esgotado' ? 'bg-red-600/10 text-red-600 dark:text-red-500' : ''}
                        `}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  )
}
