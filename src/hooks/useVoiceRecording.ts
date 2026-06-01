import { useState, useRef } from 'react'
import type { EstoqueItem } from '../types'

interface UseVoiceRecordingProps {
  setEstoque: React.Dispatch<React.SetStateAction<EstoqueItem[]>>
  showToast: (msg: string) => void
}

export function useVoiceRecording({ setEstoque, showToast }: UseVoiceRecordingProps) {
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'sending' | 'success' | 'error'>('idle')
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcriptionResult, setTranscriptionResult] = useState<{ texto: string; acao: string } | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)

  const startRecording = async () => {
    setTranscriptionResult(null)
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
        processarAudioComando(audioBlob)
      }

      mediaRecorder.start()
      setRecordingStatus('recording')
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime(t => t + 1)
      }, 1000) as unknown as number
    } catch (err) {
      console.error('Erro ao acessar microfone:', err)
      showToast('Permissão de microfone negada ou indisponível.')
      setRecordingStatus('error')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingStatus === 'recording') {
      mediaRecorderRef.current.stop()
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      setRecordingStatus('sending')
    }
  }

  const processarAudioComando = async (audioBlob: Blob | null, textPreset?: string) => {
    setRecordingStatus('sending')
    console.log("Arquivo de áudio gravado e enviado para o microsserviço de transcrição:", audioBlob)

    // Simula a requisição POST ao microsserviço (FormData contendo o arquivo de áudio)
    await new Promise(resolve => setTimeout(resolve, 2000)) // Atraso de rede de 2s

    let textoTranscrito = ""
    let mensagemAcao = ""
    let itemAfetadoId = ""
    let quantidadeAdicionar = 0

    if (textPreset) {
      textoTranscrito = textPreset
    } else {
      const comandosPossiveis = [
        "Adicionar 50 sacos de cimento CP II Votoran",
        "Repor 100 barras de aço CA-50 10.0mm",
        "Adicionar 15 metros cúbicos de areia lavada média",
        "Repor 10 milheiros de tijolo cerâmico 8 furos"
      ]

      const randomIdx = Math.floor(Math.random() * comandosPossiveis.length)
      textoTranscrito = comandosPossiveis[randomIdx]
    }

    const textoLower = textoTranscrito.toLowerCase()

    if (textoLower.includes('cimento')) {
      itemAfetadoId = '1'
      quantidadeAdicionar = 50
      mensagemAcao = "Adicionados 50 sacos de Cimento CP II Votoran ao estoque."
    } else if (textoLower.includes('aço') || textoLower.includes('aco')) {
      itemAfetadoId = '2'
      quantidadeAdicionar = 100
      mensagemAcao = "Adicionadas 100 barras de Aço CA-50 10.0mm ao estoque."
    } else if (textoLower.includes('areia')) {
      itemAfetadoId = '3'
      quantidadeAdicionar = 15
      mensagemAcao = "Adicionados 15 m³ de Areia Lavada Média ao estoque."
    } else if (textoLower.includes('tijolo')) {
      itemAfetadoId = '4'
      quantidadeAdicionar = 10
      mensagemAcao = "Adicionados 10 milheiros de Tijolo Cerâmico ao estoque."
    } else {
      itemAfetadoId = '1'
      quantidadeAdicionar = 50
      textoTranscrito = "Adicionar 50 sacos de cimento CP II Votoran"
      mensagemAcao = "Adicionados 50 sacos de Cimento CP II Votoran ao estoque."
    }

    setEstoque(prevEstoque => prevEstoque.map(item => {
      if (item.id.toString() === itemAfetadoId) {
        const novaQtd = item.quantidadeAtual + quantidadeAdicionar
        return {
          ...item,
          quantidadeAtual: novaQtd,
        }
      }
      return item
    }))

    setTranscriptionResult({
      texto: textoTranscrito,
      acao: mensagemAcao
    })
    setRecordingStatus('success')
    showToast('Estoque atualizado pelo Microsserviço!')
  }

  return {
    recordingStatus,
    recordingTime,
    transcriptionResult,
    startRecording,
    stopRecording,
    processarAudioComando
  }
}


