import { useState, useEffect } from 'react'

// Tipos
import type { Obra, EstoqueItem, Transacao, PerfilUsuario } from './types'

// Dados Mockados
import { initialObras, initialEstoque, initialTransacoes } from './data/mockData'

// Hooks
import { useVoiceRecording } from './hooks/useVoiceRecording'

// Layout
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'

// Telas
import { HomeScreen } from './components/screens/HomeScreen'
import { ProjectsScreen } from './components/screens/ProjectsScreen'
import { BudgetsScreen } from './components/screens/BudgetsScreen'
import { InventoryScreen } from './components/screens/InventoryScreen'
import { SettingsScreen } from './components/screens/SettingsScreen'

// Modais
import { ObraModal } from './components/modals/ObraModal'
import { TransacaoModal } from './components/modals/TransacaoModal'

// Common
import { Toast } from './components/common/Toast'

export default function App() {
  // Estado do Tema (Light / Dark)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme')
    return (saved as 'light' | 'dark') || 'dark'
  })

  // Estado de Navegação e Menu Lateral
  const [currentScreen, setCurrentScreen] = useState<'home' | 'projects' | 'budgets' | 'inventory' | 'settings'>('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Estados dos Dados Mockados
  const [perfil, setPerfil] = useState<PerfilUsuario>({
    nome: 'Gabriel Silva',
    cargo: 'Engenheiro Civil & Gestor',
    empresa: 'Gabriel Construções Ltda',
    iniciais: 'GS'
  })

  const [obras, setObras] = useState<Obra[]>(initialObras)
  const [estoque, setEstoque] = useState<EstoqueItem[]>(initialEstoque)
  const [transacoes, setTransacoes] = useState<Transacao[]>(initialTransacoes)

  // Modais e Estados de Criação
  const [modalObraOpen, setModalObraOpen] = useState(false)
  const [modalTransacaoOpen, setModalTransacaoOpen] = useState(false)

  // Toasts de Notificação
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Hook para gravação de voz
  const {
    recordingStatus,
    recordingTime,
    transcriptionResult,
    startRecording,
    stopRecording,
    processarAudioComando
  } = useVoiceRecording({ setEstoque, showToast })

  // Efeito para injetar a classe Dark no HTML
  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  // Lógica de Cadastro
  const handleCriarObra = (novaDados: Omit<Obra, 'id' | 'orcamentoGasto' | 'dataInicio' | 'dataFim'>) => {
    const nova: Obra = {
      ...novaDados,
      id: Date.now().toString(),
      orcamentoGasto: 0,
      dataInicio: new Date().toLocaleDateString('pt-BR'),
      dataFim: 'Sem previsão'
    }
    setObras([nova, ...obras])
    showToast(`Obra "${nova.nome}" cadastrada com sucesso!`)
  }

  const handleCriarTransacao = (novaDados: Omit<Transacao, 'id' | 'data'>) => {
    const nova: Transacao = {
      ...novaDados,
      id: Date.now().toString(),
      data: new Date().toLocaleDateString('pt-BR')
    }
    if (nova.tipo === 'Despesa') {
      setObras(prevObras => prevObras.map(o => {
        if (o.nome === nova.obraNome) {
          return { ...o, orcamentoGasto: o.orcamentoGasto + nova.valor }
        }
        return o
      }))
    }
    setTransacoes([nova, ...transacoes])
    showToast('Lançamento financeiro registrado!')
  }

  // Lógica de Estoque
  const handleSolicitarReposicao = (itemId: string, itemNome: string) => {
    setEstoque(prevEstoque => prevEstoque.map(item => {
      if (item.id === itemId) {
        const novaQtd = item.quantidade + 50
        return {
          ...item,
          quantidade: novaQtd,
          status: novaQtd >= item.estoqueMinimo ? 'Adequado' : 'Crítico'
        }
      }
      return item
    }))
    showToast(`Pedido de reposição de 50 unidades feito para "${itemNome}"`)
  }

  return (
    <div className="min-h-screen font-sans bg-brand-bg-light text-slate-800 dark:bg-brand-bg-dark dark:text-slate-100 flex flex-col md:flex-row relative">
      
      {toastMessage && <Toast message={toastMessage} />}

      <Sidebar 
        currentScreen={currentScreen} 
        setCurrentScreen={setCurrentScreen} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        perfil={perfil} 
      />

      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm md:hidden"
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header 
          currentScreen={currentScreen} 
          setCurrentScreen={setCurrentScreen}
          theme={theme} 
          setTheme={setTheme} 
          setSidebarOpen={setSidebarOpen} 
          perfil={perfil} 
        />

        <main className="p-6 max-w-7xl w-full mx-auto space-y-6 flex-1">
          {currentScreen === 'home' && (
            <HomeScreen 
              estoque={estoque}
              setCurrentScreen={setCurrentScreen}
              recordingStatus={recordingStatus}
              recordingTime={recordingTime}
              transcriptionResult={transcriptionResult}
              startRecording={startRecording}
              stopRecording={stopRecording}
              processarAudioComando={processarAudioComando}
            />
          )}

          {currentScreen === 'projects' && (
            <ProjectsScreen 
              obras={obras}
              setModalObraOpen={setModalObraOpen}
            />
          )}

          {currentScreen === 'budgets' && (
            <BudgetsScreen 
              transacoes={transacoes}
              setModalTransacaoOpen={setModalTransacaoOpen}
            />
          )}

          {currentScreen === 'inventory' && (
            <InventoryScreen 
              estoque={estoque}
              handleSolicitarReposicao={handleSolicitarReposicao}
            />
          )}

          {currentScreen === 'settings' && (
            <SettingsScreen 
              perfil={perfil}
              setPerfil={setPerfil}
              theme={theme}
              setTheme={setTheme}
              showToast={showToast}
            />
          )}
        </main>

        <Footer />
      </div>

      {modalObraOpen && (
        <ObraModal 
          onClose={() => setModalObraOpen(false)} 
          onSave={handleCriarObra} 
        />
      )}

      {modalTransacaoOpen && (
        <TransacaoModal 
          onClose={() => setModalTransacaoOpen(false)} 
          onSave={handleCriarTransacao} 
          obras={obras} 
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .text-xxs {
          font-size: 0.65rem;
        }
      `}</style>
    </div>
  )
}


