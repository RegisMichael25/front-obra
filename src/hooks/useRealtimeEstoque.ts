import { useState, useEffect, useRef } from 'react'
import { api } from '../services/api'
import type { EstoqueItem, Obra } from '../types'

export function useRealtimeEstoque(isOperador: boolean) {
  const [estoqueCompleto, setEstoqueCompleto] = useState<EstoqueItem[]>([])
  const [estoqueRapido, setEstoqueRapido] = useState<EstoqueItem[]>([])
  const [loading, setLoading] = useState(false)
  const isInitialLoad = useRef(true)

  const fetchEstoque = async (silent = false) => {
    if (isOperador) return

    if (!silent) setLoading(true)

    try {
      const obras = await api.get<Obra[]>('/obra')
      if (obras.length > 0) {
        const items = await api.get<EstoqueItem[]>(`/obra/estoque?idObra=${obras[0].id}`)
        setEstoqueCompleto(items)
        setEstoqueRapido(items.slice(0, 10))
      }
    } catch (err) {
      console.error('Erro ao buscar estoque (real-time):', err)
    } finally {
      if (!silent) setLoading(false)
      isInitialLoad.current = false
    }
  }

  useEffect(() => {
    // Initial fetch (shows loading)
    fetchEstoque(false)

    // Polling every 5 seconds (silent)
    const interval = setInterval(() => {
      fetchEstoque(true)
    }, 5000)

    return () => clearInterval(interval)
  }, [isOperador])

  return { estoqueCompleto, estoqueRapido, loading, fetchEstoque }
}
