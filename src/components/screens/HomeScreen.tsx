import { 
  Briefcase, 
  DollarSign, 
  Package, 
  Settings, 
  ArrowRight,
  HardHat
} from 'lucide-react'
import type { EstoqueItem } from '../../types'
import { VoiceRecorder } from '../voice/VoiceRecorder'

interface HomeScreenProps {
  estoque: EstoqueItem[]
  setCurrentScreen: (screen: 'home' | 'projects' | 'budgets' | 'inventory' | 'settings') => void
  recordingStatus: 'idle' | 'recording' | 'sending' | 'success' | 'error'
  recordingTime: number
  transcriptionResult: { texto: string; acao: string } | null
  startRecording: () => void
  stopRecording: () => void
  processarAudioComando: (audioBlob: Blob | null, textPreset?: string) => void
}

export function HomeScreen({
  estoque,
  setCurrentScreen,
  recordingStatus,
  recordingTime,
  transcriptionResult,
  startRecording,
  stopRecording,
  processarAudioComando
}: HomeScreenProps) {
  
  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Card de Boas-Vindas */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#11241f] to-[#0c1318] p-6 md:p-8 text-white border border-brand-green-dark/40 shadow-lg">
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-brand-green/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1 bg-brand-green/20 text-brand-green px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-brand-green/30">
            <HardHat size={12} /> Plataforma inteligente para gestão de obras
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Sua obra no tempo certo, <span className="text-brand-green font-extrabold underline decoration-brand-green/30">sem dor de cabeça</span>
          </h2>
          <p className="mt-2 text-slate-300 text-sm md:text-base leading-relaxed">
            Bem-vindo ao **smartBIIM**. Utilize o gravador de comandos de voz abaixo para gerenciar seu estoque ou navegue pelas seções do sistema através do painel de atalhos.
          </p>
        </div>
      </div>

      {/* Seção de Comando de Voz para o Almoxarifado */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gravador de Áudio */}
        <VoiceRecorder 
          recordingStatus={recordingStatus}
          recordingTime={recordingTime}
          transcriptionResult={transcriptionResult}
          startRecording={startRecording}
          stopRecording={stopRecording}
          processarAudioComando={processarAudioComando}
        />

        {/* Minivisualizador de Estoque do Almoxarifado */}
        <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-6 rounded-2xl shadow-sm flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Status Rápido do Almoxarifado</h3>
            <p className="text-xxs text-slate-500">Veja as alterações do estoque em tempo real.</p>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto max-h-56 pr-1">
            {estoque.map(item => (
              <div key={item.id} className="flex justify-between items-center text-xs py-1.5 border-b border-brand-border-light dark:border-brand-border-dark last:border-b-0">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{item.item}</p>
                  <p className="text-[10px] text-slate-400">{item.categoria}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800 dark:text-slate-200">{item.quantidade} {item.unidade}</p>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                    item.status === 'Adequado' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setCurrentScreen('inventory')}
            className="w-full text-center py-2 bg-slate-50 dark:bg-slate-900/60 hover:bg-brand-green/10 text-slate-600 dark:text-slate-400 hover:text-brand-green-hover dark:hover:text-brand-green text-xs font-bold rounded-xl transition-all border border-brand-border-light dark:border-brand-border-dark hover:border-brand-green/30"
          >
            Abrir Almoxarifado Completo
          </button>
        </div>

      </div>

      {/* Menu de Atalhos Rápidos para outras telas */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white font-semibold">Seções do Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Atalho Obras */}
          <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-4 hover:border-brand-green/30 transition-colors group">
            <div className="flex justify-between items-start">
              <span className="p-2 bg-brand-green/10 text-brand-green-hover dark:text-brand-green rounded-xl"><Briefcase size={20} /></span>
              <span className="text-[10px] uppercase font-bold text-slate-400">04 Projetos</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Obras & Projetos</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Gerencie canteiros, progresso físico, equipes e orçamentos totais.</p>
            </div>
            <button 
              onClick={() => setCurrentScreen('projects')}
              className="text-xs font-bold text-brand-green-hover dark:text-brand-green flex items-center gap-1.5 hover:underline text-left cursor-pointer"
            >
              Acessar Obras <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Atalho Financeiro */}
          <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-4 hover:border-brand-green/30 transition-colors group">
            <div className="flex justify-between items-start">
              <span className="p-2 bg-brand-green/10 text-brand-green-hover dark:text-brand-green rounded-xl"><DollarSign size={20} /></span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Fluxo de Caixa</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Financeiro & Orçamentos</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Controle despesas com fornecedores, mão de obra e receitas de aportes.</p>
            </div>
            <button 
              onClick={() => setCurrentScreen('budgets')}
              className="text-xs font-bold text-brand-green-hover dark:text-brand-green flex items-center gap-1.5 hover:underline text-left cursor-pointer"
            >
              Acessar Financeiro <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Atalho Almoxarifado */}
          <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-4 hover:border-brand-green/30 transition-colors group">
            <div className="flex justify-between items-start">
              <span className="p-2 bg-brand-green/10 text-brand-green-hover dark:text-brand-green rounded-xl"><Package size={20} /></span>
              <span className="text-[10px] uppercase font-bold text-slate-400">{estoque.length} Itens</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Almoxarifado & Estoque</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Acompanhe níveis de materiais, insumos de alvenaria e faça pedidos.</p>
            </div>
            <button 
              onClick={() => setCurrentScreen('inventory')}
              className="text-xs font-bold text-brand-green-hover dark:text-brand-green flex items-center gap-1.5 hover:underline text-left cursor-pointer"
            >
              Acessar Almoxarifado <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Atalho Configurações */}
          <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-4 hover:border-brand-green/30 transition-colors group">
            <div className="flex justify-between items-start">
              <span className="p-2 bg-brand-green/10 text-brand-green-hover dark:text-brand-green rounded-xl"><Settings size={20} /></span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Aparência</span>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Configurações</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Modifique os seus dados cadastrais fictícios e selecione o tema.</p>
            </div>
            <button 
              onClick={() => setCurrentScreen('settings')}
              className="text-xs font-bold text-brand-green-hover dark:text-brand-green flex items-center gap-1.5 hover:underline text-left cursor-pointer"
            >
              Acessar Ajustes <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>

        </div>
      </div>

    </div>
  )
}



