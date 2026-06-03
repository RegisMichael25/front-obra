import { useState, useRef } from 'react'
import { Play, Pause, Volume2, Square } from 'lucide-react'

// Componente Customizado para Reprodução de Áudio
export const CustomAudioPlayer = ({ audioUrl }: { audioUrl: string }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const stopPlay = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
      setProgress(0)
      setCurrentTime(0)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "0:00"
    const m = Math.floor(time / 60)
    const s = Math.floor(time % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-brand-border-light dark:border-brand-border-dark w-full mt-1.5 shadow-sm">
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button 
          onClick={togglePlay} 
          className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-green text-brand-green-dark hover:bg-brand-green-hover transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          {isPlaying ? <Pause size={14} className="fill-current" /> : <Play size={14} className="fill-current ml-0.5" />}
        </button>
        {(isPlaying || currentTime > 0) && (
          <button 
            onClick={stopPlay} 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            title="Cancelar / Parar"
          >
            <Square size={12} className="fill-current" />
          </button>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-green transition-all duration-100 ease-linear" 
            style={{ width: `${progress || 0}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-slate-500 font-medium">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      <div className="text-slate-400 dark:text-slate-500 flex-shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 p-1.5 rounded-lg">
        <Volume2 size={14} />
      </div>

      <audio 
        ref={audioRef} 
        src={audioUrl} 
        onTimeUpdate={handleTimeUpdate} 
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => { setIsPlaying(false); setProgress(0); setCurrentTime(0); }}
      />
    </div>
  )
}
