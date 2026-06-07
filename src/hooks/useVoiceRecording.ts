import { useState, useRef } from 'react'
import type { EstoqueItem } from '../types'
import { api } from '../services/api'

interface UseVoiceRecordingProps {
  setEstoque: React.Dispatch<React.SetStateAction<EstoqueItem[]>>
  showToast: (msg: string) => void
}

export function useVoiceRecording({ setEstoque, showToast }: UseVoiceRecordingProps) {
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'analyzing' | 'preview' | 'saving' | 'success' | 'error'>('idle')
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcriptionResult, setTranscriptionResult] = useState<{ texto: string; acao: string; audioUrl?: string } | null>(null)
  const [extractedData, setExtractedData] = useState<any>(null)
  const [previewAudioUrl, setPreviewAudioUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)

  const startRecording = async () => {
    setTranscriptionResult(null)
    setExtractedData(null)
    setPreviewAudioUrl(null)
    setErrorMessage(null)
    audioChunksRef.current = []
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        stream.getTracks().forEach(track => track.stop())
        
        const url = URL.createObjectURL(audioBlob)
        setPreviewAudioUrl(url)
        
        // Em vez de só preview, já manda analisar no microsserviço
        analyzeAudio(audioBlob)
      }

      mediaRecorder.start()
      setRecordingStatus('recording')
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime(t => t + 1)
      }, 1000) as unknown as number
    } catch (err: any) {
      console.error('Erro ao acessar microfone:', err)
      const msg = err.message || 'Permissão de microfone negada ou indisponível.'
      showToast(msg)
      setErrorMessage(`Microfone indisponível: ${msg}`)
      setRecordingStatus('error')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingStatus === 'recording') {
      mediaRecorderRef.current.stop()
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const retryRecording = () => {
    if (previewAudioUrl) {
      URL.revokeObjectURL(previewAudioUrl)
    }
    setPreviewAudioUrl(null)
    setRecordingStatus('idle')
  }

  const confirmSend = async () => {
    if (!extractedData) return
    setRecordingStatus('saving')
    
    // --- Envia dados extraídos para o Java backend ---
    try {
      // Lê idObra do JWT (suporta formato novo com 'obras' e o antigo 'idObra')
      let idObra: number | null = null
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const payload = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))))
          if (payload.obras && Array.isArray(payload.obras) && payload.obras.length > 0) {
            idObra = payload.obras[0]
          } else if (payload.idObra) {
            idObra = payload.idObra
          }
        } catch (e) {
          console.error('Erro ao decodificar JWT', e)
        }
      }

      const resp = await api.post<EstoqueItem>('/obra/estoque/voz', {
        material:    extractedData.material,
        quantidade:  extractedData.quantidade,
        fornecedor:  extractedData.fornecedor,
        acao:        extractedData.acao,
        idObra:      idObra
      })

      // Atualiza o estoque local com a resposta
      setEstoque(prevEstoque => {
        const existe = prevEstoque.find(i => i.id === resp.id)
        if (existe) {
          return prevEstoque.map(i => i.id === resp.id ? resp : i)
        }
        return [...prevEstoque, resp]
      })

    } catch (err: any) {
      console.error('Erro ao salvar comando de voz no backend:', err)
      const errorMsg = err.response?.data?.message || err.message || 'Erro ao conectar com o servidor.'
      showToast(errorMsg)
      setErrorMessage(`Servidor/Banco de Dados: ${errorMsg}`)
      setRecordingStatus('error')
      return
    }

    setRecordingStatus('success')
    showToast('Estoque atualizado com sucesso!')
  }

  const analyzeAudio = async (audioBlob: Blob | null, textPreset?: string) => {
    setRecordingStatus('analyzing')

    let textoTranscrito = ''
    let mensagemAcao = ''
    let audioUrlTemp: string | undefined = undefined

    // Campos extraídos do microsserviço
    let materialExtraido = 'Não identificado'
    let quantidadeExtraida: number | string = 'Não identificada'
    let fornecedorExtraido = 'Não identificado'
    let acaoExtraida = 'Não identificada'

    if (audioBlob) {
      // --- Fluxo real: envia áudio ao microsserviço Python ---
      try {
        const formData = new FormData()
        formData.append('file', audioBlob, 'audio.webm')

        const response = await fetch('http://localhost:8000/transcribe', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          throw new Error(`Erro na API: ${response.statusText}`)
        }

        const data = await response.json()

        textoTranscrito    = data.texto_completo           || 'Texto não identificado'
        materialExtraido   = data.dados_extraidos?.material  || 'Não identificado'
        quantidadeExtraida = data.dados_extraidos?.quantidade ?? 'Não identificada'
        fornecedorExtraido = data.dados_extraidos?.fornecedor || 'Não identificado'
        acaoExtraida       = data.dados_extraidos?.acao       || 'adicionar'

        if (data.audio_base64) {
          const mime = data.mime_type || 'audio/webm'
          audioUrlTemp = `data:${mime};base64,${data.audio_base64}`
        }

        mensagemAcao = `Ação: ${acaoExtraida} | Material: ${materialExtraido} | Quantidade: ${quantidadeExtraida} | Fornecedor: ${fornecedorExtraido}`

      } catch (err: any) {
        console.error('Erro ao enviar áudio ao microsserviço:', err)
        const msg = err.message || 'Falha de conexão com o microsserviço de IA.'
        showToast(msg)
        setErrorMessage(`Conexão com a IA (Python): ${msg}`)
        setRecordingStatus('error')
        return
      }

    } else if (textPreset) {
      // --- Fluxo preset: simula transcrição para demonstração ---
      textoTranscrito = textPreset
      const textoLower = textPreset.toLowerCase()

      if (textoLower.includes('cimento')) {
        materialExtraido   = 'Cimento CP II Votoran'
        quantidadeExtraida = 50
        fornecedorExtraido = 'Votoran'
        acaoExtraida       = 'adicionar'
        mensagemAcao       = 'Adicionados 50 sacos de Cimento CP II Votoran ao estoque.'
      } else if (textoLower.includes('aço') || textoLower.includes('aco')) {
        materialExtraido   = 'Aço CA-50 10.0mm'
        quantidadeExtraida = 100
        fornecedorExtraido = 'Gerdau'
        acaoExtraida       = 'adicionar'
        mensagemAcao       = 'Adicionadas 100 barras de Aço CA-50 10.0mm ao estoque.'
      } else if (textoLower.includes('areia')) {
        materialExtraido   = 'Areia Lavada Média'
        quantidadeExtraida = 15
        fornecedorExtraido = 'Não identificado'
        acaoExtraida       = 'adicionar'
        mensagemAcao       = 'Adicionados 15 m³ de Areia Lavada Média ao estoque.'
      } else if (textoLower.includes('tijolo')) {
        materialExtraido   = 'Tijolo Cerâmico'
        quantidadeExtraida = 10
        fornecedorExtraido = 'Não identificado'
        acaoExtraida       = 'adicionar'
        mensagemAcao       = 'Adicionados 10 milheiros de Tijolo Cerâmico ao estoque.'
      } else {
        materialExtraido   = 'Material genérico'
        quantidadeExtraida = 1
        acaoExtraida       = 'adicionar'
        mensagemAcao       = 'Comando de voz processado.'
      }
    }

    setExtractedData({
      material: materialExtraido,
      quantidade: quantidadeExtraida,
      fornecedor: fornecedorExtraido,
      acao: acaoExtraida
    })

    setTranscriptionResult({
      texto: textoTranscrito,
      acao: mensagemAcao,
      audioUrl: audioUrlTemp
    })
    
    // Agora vai para preview
    setRecordingStatus('preview')
  }

  // Wrapper para retrocompatibilidade
  const processarAudioComando = (audioBlob: Blob | null, textPreset?: string) => {
    analyzeAudio(audioBlob, textPreset)
  }

  return {
    recordingStatus,
    recordingTime,
    transcriptionResult,
    previewAudioUrl,
    startRecording,
    stopRecording,
    retryRecording,
    confirmSend,
    processarAudioComando,
    errorMessage
  }
}
