import { 
  Mic, 
  Square, 
  RefreshCw, 
  FileAudio, 
  CheckCircle2 
} from 'lucide-react'

interface VoiceRecorderProps {
  recordingStatus: 'idle' | 'recording' | 'sending' | 'success' | 'error'
  recordingTime: number
  transcriptionResult: { texto: string; acao: string } | null
  startRecording: () => void
  stopRecording: () => void
  processarAudioComando: (audioBlob: Blob | null, textPreset?: string) => void
}

export function VoiceRecorder({
  recordingStatus,
  recordingTime,
  transcriptionResult,
  startRecording,
  stopRecording,
  processarAudioComando
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
          ) : recordingStatus === 'sending' ? (
            <div className="w-16 h-16 rounded-full bg-brand-green-dark border-2 border-brand-green text-brand-green flex items-center justify-center">
              <RefreshCw size={24} className="animate-spin" />
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
          <span className="text-xs font-semibold">
            {recordingStatus === 'idle' && 'Clique para gravar'}
            {recordingStatus === 'recording' && `Gravando... ${Math.floor(recordingTime / 60).toString().padStart(2, '0')}:${(recordingTime % 60).toString().padStart(2, '0')}`}
            {recordingStatus === 'sending' && 'Enviando áudio ao microsserviço...'}
            {recordingStatus === 'success' && 'Áudio enviado com sucesso!'}
            {recordingStatus === 'error' && 'Erro de gravação'}
          </span>
        </div>

        {/* Resultado da Transcrição e Ação tomada */}
        <div className="flex-1 px-4 text-center sm:text-left space-y-2 max-w-sm min-w-0">
          {recordingStatus === 'success' && transcriptionResult ? (
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
            </div>
          ) : recordingStatus === 'sending' ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              O microsserviço está convertendo o áudio em texto e enviando as alterações para o banco de dados...
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
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fale comandos como: <br />
              <code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-brand-green-hover dark:text-brand-green">"Adicionar 50 sacos de cimento"</code> ou <br />
              <code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded text-brand-green-hover dark:text-brand-green">"Repor 100 barras de aço"</code>.
            </p>
          )}
        </div>

      </div>

      {/* Atalhos de Simulação Física */}
      <div className="pt-3 border-t border-brand-border-light dark:border-brand-border-dark">
        <span className="block text-[10px] uppercase font-bold text-slate-400 mb-2">Simular envio de arquivos de áudio rápidos (Presets):</span>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => processarAudioComando(null, "Adicionar 50 sacos de cimento CP II Votoran")}
            className="px-2.5 py-1 bg-slate-50 border border-brand-border-light dark:bg-slate-900 dark:border-brand-border-dark text-[10px] text-slate-600 dark:text-slate-300 rounded-lg hover:border-brand-green transition-colors cursor-pointer flex items-center gap-1"
          >
            <FileAudio size={11} /> +50 Cimento
          </button>
          <button 
            onClick={() => processarAudioComando(null, "Repor 100 barras de aço CA-50 10.0mm")}
            className="px-2.5 py-1 bg-slate-50 border border-brand-border-light dark:bg-slate-900 dark:border-brand-border-dark text-[10px] text-slate-600 dark:text-slate-300 rounded-lg hover:border-brand-green transition-colors cursor-pointer flex items-center gap-1"
          >
            <FileAudio size={11} /> +100 Aço
          </button>
          <button 
            onClick={() => processarAudioComando(null, "Adicionar 15 metros cúbicos de areia lavada média")}
            className="px-2.5 py-1 bg-slate-50 border border-brand-border-light dark:bg-slate-900 dark:border-brand-border-dark text-[10px] text-slate-600 dark:text-slate-300 rounded-lg hover:border-brand-green transition-colors cursor-pointer flex items-center gap-1"
          >
            <FileAudio size={11} /> +15 Areia
          </button>
        </div>
      </div>
    </div>
  )
}

