import { 
  Mic, 
  Square, 
  RefreshCw, 
  CheckCircle2,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'
import { useState, useRef } from 'react'
import { CustomAudioPlayer } from '../CustomAudioPlayer'

interface VoiceRecorderProps {
  recordingStatus: 'idle' | 'recording' | 'analyzing' | 'preview' | 'saving' | 'success' | 'error'
  recordingTime: number
  transcriptionResult: { texto: string; acao: string; audioUrl?: string } | null
  previewAudioUrl: string | null
  startRecording: () => void
  stopRecording: () => void
  retryRecording: () => void
  confirmSend: () => void
  errorMessage?: string | null
}

// Mini player inline para preview (sem carregar o CustomAudioPlayer completo)
function PreviewPlayer({ url }: { url: string }) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setPlaying(!playing)
  }

  const stop = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setPlaying(false)
    setProgress(0)
    setCurrentTime(0)
  }

  const fmt = (t: number) => {
    if (!isFinite(t)) return '0:00'
    return `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-brand-border-light dark:border-brand-border-dark w-full shadow-sm">
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          onClick={toggle}
          className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-amber-400 hover:bg-amber-500 text-white transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          {playing
            ? <Pause size={13} className="fill-current" />
            : <Play size={13} className="fill-current ml-0.5" />
          }
        </button>
        {(playing || currentTime > 0) && (
          <button
            onClick={stop}
            className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-rose-500 hover:bg-rose-600 text-white transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            title="Cancelar / Parar"
          >
            <Square size={12} className="fill-current" />
          </button>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-slate-500 font-medium">
          <span>{fmt(currentTime)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={() => {
          if (!audioRef.current) return
          setCurrentTime(audioRef.current.currentTime)
          setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100)
        }}
        onLoadedMetadata={() => { if (audioRef.current) setDuration(audioRef.current.duration) }}
        onEnded={() => { setPlaying(false); setProgress(0); setCurrentTime(0) }}
      />
    </div>
  )
}

export function VoiceRecorder({
  recordingStatus,
  recordingTime,
  transcriptionResult,
  previewAudioUrl,
  startRecording,
  stopRecording,
  retryRecording,
  confirmSend,
  errorMessage
}: VoiceRecorderProps) {
  
  return (
    <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-6 rounded-2xl shadow-sm lg:col-span-2 flex flex-col justify-between gap-6 min-w-0">
      <div>
        <div className="flex items-center gap-2 mb-2 min-w-0">
          <span className="p-1.5 bg-brand-green/10 text-brand-green-hover dark:text-brand-green rounded-lg">
            <Mic size={18} />
          </span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white min-w-0">Entrada de Dados por Voz (Almoxarifado)</h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Grave uma instrução de voz. O arquivo de áudio será enviado para o seu microsserviço de transcrição, processado no backend e refletido no estoque do Almoxarifado.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6 justify-center py-6 bg-slate-50/55 dark:bg-slate-950/20 rounded-2xl border border-brand-border-light dark:border-brand-border-dark border-dashed">
        
        {/* Botão de Controle do Microfone */}
        <div className="flex flex-col items-center gap-3">
          {recordingStatus === 'recording' ? (
            <button 
              onClick={stopRecording}
              className="w-16 h-16 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center cursor-pointer shadow-lg shadow-rose-500/25 relative animate-pulse"
            >
              <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-35"></span>
              <Square size={24} className="relative z-10" />
            </button>
          ) : (recordingStatus === 'analyzing' || recordingStatus === 'saving') ? (
            <div className="w-16 h-16 rounded-full bg-brand-green-dark border-2 border-brand-green text-brand-green flex items-center justify-center">
              <RefreshCw size={24} className="animate-spin" />
            </div>
          ) : recordingStatus === 'preview' ? (
            <div className="w-16 h-16 rounded-full bg-amber-400/10 border-2 border-amber-400 text-amber-500 flex items-center justify-center">
              <Play size={24} className="fill-current ml-1" />
            </div>
          ) : (
            <button 
              onClick={startRecording}
              className="w-16 h-16 rounded-full bg-brand-green hover:bg-brand-green-hover text-brand-green-dark flex items-center justify-center cursor-pointer shadow-lg shadow-brand-green/20 hover:scale-105 transition-transform"
            >
              <Mic size={24} />
            </button>
          )}

          {/* Texto do Status */}
          <span className="text-xs font-semibold text-center">
            {recordingStatus === 'idle' && 'Clique para gravar'}
            {recordingStatus === 'recording' && `Gravando... ${Math.floor(recordingTime / 60).toString().padStart(2, '0')}:${(recordingTime % 60).toString().padStart(2, '0')}`}
            {recordingStatus === 'analyzing' && 'Analisando áudio (IA)...'}
            {recordingStatus === 'preview' && 'Áudio analisado'}
            {recordingStatus === 'saving' && 'Salvando no banco de dados...'}
            {recordingStatus === 'success' && 'Salvo com sucesso!'}
            {recordingStatus === 'error' && 'Erro de gravação'}
          </span>
        </div>

        {/* Painel de conteúdo dinâmico */}
        <div className="flex-1 px-4 text-center sm:text-left space-y-2 max-w-sm min-w-0 w-full">

          {/* === ESTADO: PREVIEW === */}
          {recordingStatus === 'preview' && previewAudioUrl ? (
            <div className="space-y-3 animate-fadeIn text-left">
              
              {/* Mostra a transcrição já nesta etapa */}
              {transcriptionResult && (
                <div className="bg-slate-100 dark:bg-slate-900/50 p-3 rounded-xl border border-brand-border-light dark:border-brand-border-dark mb-3">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Entendido pela IA:</div>
                  <p className="text-sm font-semibold italic text-slate-800 dark:text-slate-200">
                    "{transcriptionResult.texto}"
                  </p>
                  <div className="mt-2 text-[10px] uppercase font-bold text-slate-400">Ação a ser salva:</div>
                  <div className="text-xs text-brand-green-hover dark:text-brand-green font-medium">
                    {transcriptionResult.acao}
                  </div>
                </div>
              )}

              <div className="text-[10px] uppercase font-bold text-slate-400">Ouça antes de confirmar:</div>
              <PreviewPlayer url={previewAudioUrl} />
              
              <div className="flex gap-2 pt-1">
                <button
                  onClick={retryRecording}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-500 dark:text-rose-400 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors cursor-pointer"
                >
                  <RotateCcw size={13} />
                  Descartar
                </button>
                <button
                  onClick={confirmSend}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-brand-green hover:bg-brand-green-hover text-brand-green-dark text-xs font-semibold shadow-sm hover:shadow-brand-green/30 transition-all cursor-pointer"
                >
                  <CheckCircle2 size={13} />
                  Confirmar e Salvar
                </button>
              </div>
            </div>

          ) : recordingStatus === 'success' && transcriptionResult ? (
            <div className="space-y-1.5 animate-fadeIn">
              <div className="text-[10px] uppercase font-bold text-slate-400">Transcrição do Microsserviço:</div>
              <p className="text-sm font-semibold italic text-slate-800 dark:text-slate-200">
                "{transcriptionResult.texto}"
              </p>
              <div className="text-[10px] uppercase font-bold text-slate-400 mt-2">Ação do Backend no Banco de Dados:</div>
              <div className="flex items-center gap-1.5 text-xs text-brand-green-hover dark:text-brand-green font-medium">
                <CheckCircle2 size={13} />
                <span>{transcriptionResult.acao}</span>
              </div>
              
              {transcriptionResult.audioUrl && (
                <div className="pt-2">
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Áudio Sintetizado:</div>
                  <CustomAudioPlayer audioUrl={transcriptionResult.audioUrl} />
                </div>
              )}
            </div>
          ) : recordingStatus === 'analyzing' ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              O microsserviço está convertendo o áudio em texto e identificando o comando...
            </p>
          ) : recordingStatus === 'saving' ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              Salvando movimentação no banco de dados da obra selecionada...
            </p>
          ) : recordingStatus === 'recording' ? (
            <div className="flex flex-col gap-1 items-center sm:items-start">
              <p className="text-xs text-slate-500 dark:text-slate-400 italic animate-pulse">
                Capturando áudio do microfone...
              </p>
              {/* Ondas sonoras animadas */}
              <div className="flex gap-1 h-3 mt-1 items-end">
                <span className="w-1 bg-brand-green h-2 animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                <span className="w-1 bg-brand-green h-3 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-1 bg-brand-green h-1 animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                <span className="w-1 bg-brand-green h-2.5 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                <span className="w-1 bg-brand-green h-1.5 animate-bounce" style={{ animationDelay: '0.5s' }}></span>
              </div>
            </div>
          ) : recordingStatus === 'error' ? (
            <div className="space-y-3 animate-fadeIn text-left">
              <div className="bg-rose-50 dark:bg-rose-900/20 p-3 rounded-xl border border-rose-200 dark:border-rose-800/50">
                <div className="text-[10px] uppercase font-bold text-rose-500 mb-1 flex items-center gap-1">
                  Erro de Processamento
                </div>
                <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">
                  {errorMessage || 'Ocorreu um erro inesperado ao processar o áudio.'}
                </p>
              </div>
              <button
                onClick={retryRecording}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-500 dark:text-rose-400 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors cursor-pointer"
              >
                <RotateCcw size={13} />
                Tentar Novamente
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fale comandos como: <br />
              <code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-brand-green-hover dark:text-brand-green">"Adicionar 50 sacos de cimento"</code> ou <br />
              <code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-brand-green-hover dark:text-brand-green">"Repor 100 barras de aço"</code>.
            </p>
          )}
        </div>

      </div>


    </div>
  )
}
