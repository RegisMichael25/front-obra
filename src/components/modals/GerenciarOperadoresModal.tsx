import { useState, useEffect } from 'react'
import { X, Users, UserPlus, CheckCircle2, Circle } from 'lucide-react'
import { api } from '../../services/api'
import { NovoOperadorModal } from './NovoOperadorModal'

interface Operador {
  id: number
  nome: string
  chave: string
}

interface GerenciarOperadoresModalProps {
  idObra: number
  nomeObra: string
  onClose: () => void
  showToast: (msg: string) => void
}

export function GerenciarOperadoresModal({ idObra, nomeObra, onClose, showToast }: GerenciarOperadoresModalProps) {
  const [operadores, setOperadores] = useState<Operador[]>([])
  const [vinculadosIds, setVinculadosIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)
  const [isNovoOperadorOpen, setIsNovoOperadorOpen] = useState(false)

  const carregarDados = async () => {
    try {
      setLoading(true)
      // 1. Busca todos os operadores
      const ops = await api.get<Operador[]>('/usuarios/operadores')
      setOperadores(ops)

      // 2. Busca os vinculados à obra
      const vinculados = await api.get<Operador[]>(`/obras/${idObra}/operadores`)
      setVinculadosIds(new Set(vinculados.map(v => v.id)))
    } catch (err: any) {
      showToast(err.message || 'Erro ao carregar operadores')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarDados()
  }, [idObra])

  const toggleVinculo = async (operador: Operador) => {
    const isVinculado = vinculadosIds.has(operador.id)
    
    // Atualização Otimista
    setVinculadosIds(prev => {
      const next = new Set(prev)
      if (isVinculado) next.delete(operador.id)
      else next.add(operador.id)
      return next
    })

    try {
      if (isVinculado) {
        await api.delete(`/obras/${idObra}/operadores/${operador.id}`)
        showToast(`Operador ${operador.nome} desvinculado!`)
      } else {
        await api.post(`/obras/${idObra}/operadores/${operador.id}`)
        showToast(`Operador ${operador.nome} vinculado!`)
      }
    } catch (err: any) {
      // Reverter se falhar
      showToast(err.message || 'Erro ao alterar vínculo')
      setVinculadosIds(prev => {
        const next = new Set(prev)
        if (isVinculado) next.add(operador.id)
        else next.delete(operador.id)
        return next
      })
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-[50] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
        <div className="bg-white dark:bg-brand-card-dark border border-brand-border-light dark:border-brand-border-dark rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col h-[80vh]">
          
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-brand-border-light dark:border-brand-border-dark bg-slate-50/50 dark:bg-slate-900/20 shrink-0">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-brand-green/20 text-brand-green-dark dark:text-brand-green flex items-center justify-center">
                  <Users size={18} />
                </div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Equipe de Operadores</h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 pl-10">Obra: {nomeObra}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer self-start"
            >
              <X size={20} />
            </button>
          </div>

          {/* Action Bar */}
          <div className="p-4 border-b border-brand-border-light dark:border-brand-border-dark flex justify-end shrink-0">
            <button 
              onClick={() => setIsNovoOperadorOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-green hover:bg-brand-green-hover text-brand-green-dark text-sm font-bold rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
            >
              <UserPlus size={16} /> Novo Operador
            </button>
          </div>

          {/* List Body */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50/30 dark:bg-transparent">
            {loading ? (
              <div className="flex justify-center items-center h-full text-slate-500 text-sm">Carregando...</div>
            ) : operadores.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-3">
                <Users size={32} className="text-slate-300" />
                <p>Nenhum operador cadastrado no sistema.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {operadores.map(operador => {
                  const isVinculado = vinculadosIds.has(operador.id)
                  return (
                    <div 
                      key={operador.id}
                      onClick={() => toggleVinculo(operador)}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                        isVinculado 
                          ? 'bg-brand-green/5 border-brand-green/30 dark:border-brand-green/20' 
                          : 'bg-white dark:bg-slate-800/50 border-brand-border-light dark:border-brand-border-dark hover:border-brand-green/50'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{operador.nome}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Login: {operador.chave}</p>
                      </div>
                      
                      <button className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        isVinculado 
                          ? 'text-brand-green-hover dark:text-brand-green bg-brand-green/10' 
                          : 'text-slate-300 hover:text-slate-400'
                      }`}>
                        {isVinculado ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {isNovoOperadorOpen && (
        <NovoOperadorModal 
          onClose={() => setIsNovoOperadorOpen(false)}
          onSuccess={() => {
            setIsNovoOperadorOpen(false)
            showToast('Operador criado com sucesso!')
            carregarDados() // Recarrega a lista
          }}
        />
      )}
    </>
  )
}
