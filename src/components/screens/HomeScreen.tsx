import { 
  Briefcase, 
  Package, 
  Settings, 
  ArrowRight,
  HardHat
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import type { EstoqueItem, PerfilUsuario, Obra } from '../../types'
import { VoiceRecorder } from '../voice/VoiceRecorder'
import { api } from '../../services/api'
import { useRealtimeEstoque } from '../../hooks/useRealtimeEstoque'

interface HomeScreenProps {
  perfil: PerfilUsuario
  estoque: EstoqueItem[]
  recordingStatus: 'idle' | 'recording' | 'analyzing' | 'preview' | 'saving' | 'success' | 'error'
  recordingTime: number
  transcriptionResult: { texto: string; acao: string } | null
  previewAudioUrl: string | null
  startRecording: () => void
  stopRecording: () => void
  retryRecording: () => void
  confirmSend: () => void
  errorMessage?: string | null
}

export function HomeScreen({
  perfil,
  estoque,
  recordingStatus,
  recordingTime,
  transcriptionResult,
  previewAudioUrl,
  startRecording,
  stopRecording,
  retryRecording,
  confirmSend,
  errorMessage
}: HomeScreenProps) {
  
  const cargoNorm = perfil.cargo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
  const isOperador = cargoNorm.includes('pedreiro') || cargoNorm.includes('operador') || cargoNorm.includes('operario')
  const isAdmin = cargoNorm.includes('admin') || cargoNorm.includes('engenheiro')

  const { estoqueRapido, loading: loadingEstoque } = useRealtimeEstoque(isOperador)

  return (
    <div className="space-y-6 animate-fadeIn min-w-0">
      
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
            Bem-vindo ao Gestão de Obras. Utilize o gravador de comandos de voz abaixo para gerenciar seu estoque ou navegue pelas seções do sistema através do painel de atalhos.
          </p>
        </div>
      </div>

      {/* Seção de Comando de Voz para o Almoxarifado */}
      <div className={`grid grid-cols-1 ${!isAdmin ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6 min-w-0`}>
        
        {/* Gravador de Áudio - Oculto para Administrador */}
        {!isAdmin && (
          <VoiceRecorder 
            recordingStatus={recordingStatus}
            recordingTime={recordingTime}
            transcriptionResult={transcriptionResult}
            previewAudioUrl={previewAudioUrl}
            startRecording={startRecording}
            stopRecording={stopRecording}
            retryRecording={retryRecording}
            confirmSend={confirmSend}
            errorMessage={errorMessage}
          />
        )}

        {/* Minivisualizador de Estoque do Almoxarifado */}
      {!isOperador && (
        <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-6 rounded-2xl shadow-sm flex flex-col justify-between gap-4 min-w-0">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Status Rápido do Almoxarifado</h3>
            <p className="text-xxs text-slate-500">Veja as alterações do estoque em tempo real.</p>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto max-h-56 pr-1">
            {loadingEstoque ? (
              <p className="text-xs text-slate-500 py-4 text-center">Carregando estoque...</p>
            ) : estoqueRapido.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">Nenhum item cadastrado.</p>
            ) : (
              estoqueRapido.map(item => {
                const status = item.quantidadeAtual === 0 ? 'Esgotado' : item.quantidadeAtual <= item.quantidadeMinima ? 'Crítico' : 'Adequado'
                return (
                  <div key={item.id} className="flex justify-between items-center text-xs py-1.5 border-b border-brand-border-light dark:border-brand-border-dark last:border-b-0">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{item.nomeMaterial}</p>
                      <p className="text-[10px] text-slate-400">{item.nomeFornecedor || '-'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{item.quantidadeAtual}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                        status === 'Adequado' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {status}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          <Link 
            to="/almoxarifado"
            className="block w-full text-center py-2 bg-slate-50 dark:bg-slate-900/60 hover:bg-brand-green/10 text-slate-600 dark:text-slate-400 hover:text-brand-green-hover dark:hover:text-brand-green text-xs font-bold rounded-xl transition-all border border-brand-border-light dark:border-brand-border-dark hover:border-brand-green/30"
          >
            Abrir Almoxarifado Completo
          </Link>
        </div>
      )}

      </div>

      {/* Menu de Atalhos Rápidos para outras telas */}
      {!isOperador && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white font-semibold">Seções do Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-0">
            
            {/* Atalho Obras */}
            <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-5 rounded-2xl shadow-sm flex flex-col justify-between gap-4 hover:border-brand-green/30 transition-colors group">
              <div className="flex justify-between items-start">
                <span className="p-2 bg-brand-green/10 text-brand-green-hover dark:text-brand-green rounded-xl"><Briefcase size={20} /></span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Projetos</span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Obras & Projetos</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Gerencie canteiros, progresso físico, equipes e orçamentos totais.</p>
              </div>
              <Link 
                to="/projetos"
                className="text-xs font-bold text-brand-green-hover dark:text-brand-green flex items-center gap-1.5 hover:underline text-left cursor-pointer"
              >
                Acessar Obras <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </Link>
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
              <Link 
                to="/almoxarifado"
                className="text-xs font-bold text-brand-green-hover dark:text-brand-green flex items-center gap-1.5 hover:underline text-left cursor-pointer"
              >
                Acessar Almoxarifado <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </Link>
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
              <Link 
                to="/configuracoes"
                className="text-xs font-bold text-brand-green-hover dark:text-brand-green flex items-center gap-1.5 hover:underline text-left cursor-pointer"
              >
                Acessar Ajustes <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
