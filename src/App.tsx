import { useState, useEffect, useRef } from 'react'
import { 
  Briefcase, 
  DollarSign, 
  Package, 
  Settings, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Plus, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  User, 
  HardHat, 
  Filter,
  Mic,
  Square,
  RefreshCw,
  FileAudio,
  Home,
  ArrowRight
} from 'lucide-react'

// Interfaces de Tipos
interface Obra {
  id: string
  nome: string
  endereco: string
  progresso: number
  orcamentoTotal: number
  orcamentoGasto: number
  dataInicio: string
  dataFim: string
  status: 'Andamento' | 'Planejamento' | 'Concluido'
  responsavel: string
}

interface EstoqueItem {
  id: string
  item: string
  quantidade: number
  unidade: string
  estoqueMinimo: number
  categoria: 'Básico' | 'Estrutura' | 'Acabamento'
  status: 'Adequado' | 'Crítico' | 'Esgotado'
}

interface Transacao {
  id: string
  descricao: string
  obraNome: string
  valor: number
  tipo: 'Despesa' | 'Receita'
  categoria: 'Material' | 'Mão de Obra' | 'Equipamentos' | 'Administrativo'
  data: string
  status: 'Pago' | 'Pendente'
}

interface PerfilUsuario {
  nome: string
  cargo: string
  empresa: string
  iniciais: string
}

export default function App() {
  // Estado do Tema (Light / Dark)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme')
    return (saved as 'light' | 'dark') || 'dark'
  })

  // Estado de Navegação e Menu Lateral
  const [currentScreen, setCurrentScreen] = useState<'home' | 'projects' | 'budgets' | 'inventory' | 'settings'>('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Estados e Refs para Gravação de Voz / Microsserviço
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'sending' | 'success' | 'error'>('idle')
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcriptionResult, setTranscriptionResult] = useState<{ texto: string; acao: string } | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)

  // Estados dos Dados Mockados
  const [perfil, setPerfil] = useState<PerfilUsuario>({
    nome: 'Gabriel Silva',
    cargo: 'Engenheiro Civil & Gestor',
    empresa: 'Gabriel Construções Ltda',
    iniciais: 'GS'
  })

  const [obras, setObras] = useState<Obra[]>([
    {
      id: '1',
      nome: 'Residencial Villa Verde',
      endereco: 'Av. das Flores, 450 - São Paulo, SP',
      progresso: 68,
      orcamentoTotal: 1250000,
      orcamentoGasto: 850000,
      dataInicio: '15/01/2025',
      dataFim: '20/12/2026',
      status: 'Andamento',
      responsavel: 'Eng. Marcos Silva'
    },
    {
      id: '2',
      nome: 'Edifício Belle Vue',
      endereco: 'Rua Bela Cintra, 1020 - São Paulo, SP',
      progresso: 35,
      orcamentoTotal: 3800000,
      orcamentoGasto: 1330000,
      dataInicio: '10/06/2025',
      dataFim: '15/08/2027',
      status: 'Andamento',
      responsavel: 'Engª. Sofia Costa'
    },
    {
      id: '3',
      nome: 'Galpão Logístico Express',
      endereco: 'Rodovia Anhanguera, Km 42 - Jundiaí, SP',
      progresso: 100,
      orcamentoTotal: 2200000,
      orcamentoGasto: 2150000,
      dataInicio: '03/02/2024',
      dataFim: '30/04/2026',
      status: 'Concluido',
      responsavel: 'Eng. Roberto Azevedo'
    },
    {
      id: '4',
      nome: 'Reforma Clínica Vanguarda',
      endereco: 'Av. Paulista, 1500 - São Paulo, SP',
      progresso: 12,
      orcamentoTotal: 450000,
      orcamentoGasto: 35000,
      dataInicio: '01/05/2026',
      dataFim: '15/10/2026',
      status: 'Planejamento',
      responsavel: 'Engª. Sofia Costa'
    }
  ])

  const [estoque, setEstoque] = useState<EstoqueItem[]>([
    { id: '1', item: 'Cimento CP II Votoran', quantidade: 280, unidade: 'sacos', estoqueMinimo: 100, categoria: 'Básico', status: 'Adequado' },
    { id: '2', item: 'Aço CA-50 10.0mm', quantidade: 45, unidade: 'barras', estoqueMinimo: 80, categoria: 'Estrutura', status: 'Crítico' },
    { id: '3', item: 'Areia Lavada Média', quantidade: 18, unidade: 'm³', estoqueMinimo: 10, categoria: 'Básico', status: 'Adequado' },
    { id: '4', item: 'Tijolo Cerâmico 8 Furos', quantidade: 0, unidade: 'milheiros', estoqueMinimo: 5, categoria: 'Básico', status: 'Esgotado' },
    { id: '5', item: 'Tinta Acrílica Premium Branca', quantidade: 32, unidade: 'galões', estoqueMinimo: 15, categoria: 'Acabamento', status: 'Adequado' },
    { id: '6', item: 'Argamassa AC-III 20kg', quantidade: 140, unidade: 'sacos', estoqueMinimo: 50, categoria: 'Acabamento', status: 'Adequado' }
  ])

  const [transacoes, setTransacoes] = useState<Transacao[]>([
    { id: 't1', descricao: 'Compra de 100 sacos de cimento', obraNome: 'Residencial Villa Verde', valor: 3200, tipo: 'Despesa', categoria: 'Material', data: '28/05/2026', status: 'Pago' },
    { id: 't2', descricao: 'Medição de Mão de Obra Alvenaria', obraNome: 'Edifício Belle Vue', valor: 45000, tipo: 'Despesa', categoria: 'Mão de Obra', data: '26/05/2026', status: 'Pago' },
    { id: 't3', descricao: 'Locação de Betoneira Mensal', obraNome: 'Residencial Villa Verde', valor: 1800, tipo: 'Despesa', categoria: 'Equipamentos', data: '25/05/2026', status: 'Pago' },
    { id: 't4', descricao: 'Aporte de Investidor Bloco A', obraNome: 'Edifício Belle Vue', valor: 150000, tipo: 'Receita', categoria: 'Administrativo', data: '22/05/2026', status: 'Pago' },
    { id: 't5', descricao: 'Compra de ferragens estruturais', obraNome: 'Reforma Clínica Vanguarda', valor: 12400, tipo: 'Despesa', categoria: 'Material', data: '20/05/2026', status: 'Pendente' },
    { id: 't6', descricao: 'Taxa de Alvará Prefeitura', obraNome: 'Reforma Clínica Vanguarda', valor: 4800, tipo: 'Despesa', categoria: 'Administrativo', data: '18/05/2026', status: 'Pago' }
  ])

  // Modais e Estados de Criação
  const [modalObraOpen, setModalObraOpen] = useState(false)
  const [novaObra, setNovaObra] = useState({
    nome: '', endereco: '', progresso: 0, orcamentoTotal: 0, responsavel: 'Eng. Marcos Silva', status: 'Planejamento' as Obra['status']
  })

  const [modalTransacaoOpen, setModalTransacaoOpen] = useState(false)
  const [novaTransacao, setNovaTransacao] = useState({
    descricao: '', obraNome: '', valor: 0, tipo: 'Despesa' as Transacao['tipo'], categoria: 'Material' as Transacao['categoria'], status: 'Pendente' as Transacao['status']
  })

  // Toasts de Notificação
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

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

  // Função para cadastrar nova Obra
  const handleCriarObra = (e: React.FormEvent) => {
    e.preventDefault()
    if (!novaObra.nome || !novaObra.endereco || novaObra.orcamentoTotal <= 0) {
      showToast('Por favor, preencha todos os campos obrigatórios.')
      return
    }

    const nova: Obra = {
      id: Date.now().toString(),
      nome: novaObra.nome,
      endereco: novaObra.endereco,
      progresso: Number(novaObra.progresso),
      orcamentoTotal: Number(novaObra.orcamentoTotal),
      orcamentoGasto: 0,
      dataInicio: new Date().toLocaleDateString('pt-BR'),
      dataFim: 'Sem previsão',
      status: novaObra.status,
      responsavel: novaObra.responsavel
    }

    setObras([nova, ...obras])
    setModalObraOpen(false)
    setNovaObra({
      nome: '', endereco: '', progresso: 0, orcamentoTotal: 0, responsavel: 'Eng. Marcos Silva', status: 'Planejamento'
    })
    showToast(`Obra "${nova.nome}" cadastrada com sucesso!`)
  }

  // Função para cadastrar lançamento financeiro
  const handleCriarTransacao = (e: React.FormEvent) => {
    e.preventDefault()
    if (!novaTransacao.descricao || !novaTransacao.obraNome || novaTransacao.valor <= 0) {
      showToast('Por favor, preencha todos os campos.')
      return
    }

    const nova: Transacao = {
      id: Date.now().toString(),
      descricao: novaTransacao.descricao,
      obraNome: novaTransacao.obraNome,
      valor: Number(novaTransacao.valor),
      tipo: novaTransacao.tipo,
      categoria: novaTransacao.categoria,
      data: new Date().toLocaleDateString('pt-BR'),
      status: novaTransacao.status
    }

    // Se for despesa, atualizar o orçamento gasto na obra correspondente
    if (nova.tipo === 'Despesa') {
      setObras(prevObras => prevObras.map(o => {
        if (o.nome === nova.obraNome) {
          return { ...o, orcamentoGasto: o.orcamentoGasto + nova.valor }
        }
        return o
      }))
    }

    setTransacoes([nova, ...transacoes])
    setModalTransacaoOpen(false)
    setNovaTransacao({
      descricao: '', obraNome: '', valor: 0, tipo: 'Despesa', categoria: 'Material', status: 'Pendente'
    })
    showToast('Lançamento financeiro registrado!')
  }

  // Função para solicitar materiais do estoque
  const handleSolicitarReposicao = (itemId: string, itemNome: string) => {
    setEstoque(prevEstoque => prevEstoque.map(item => {
      if (item.id === itemId) {
        // Simular a chegada do pedido somando 50 unidades e voltando status para Adequado
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

  // Lógica de Gravação de Áudio NATIVA (Microsserviço)
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

  // Simulação de chamada HTTP POST ao microsserviço
  const processarAudioComando = async (audioBlob: Blob | null, textPreset?: string) => {
    setRecordingStatus('sending')
    console.log("Arquivo de áudio gravado e enviado para o microsserviço de transcrição:", audioBlob)
    
    // Simula a requisição POST ao microsserviço (FormData contendo o arquivo de áudio)
    // Envio simulado de áudio para: POST /api/v1/voz/comando-estoque
    await new Promise(resolve => setTimeout(resolve, 2000)) // Atraso de rede de 2s

    let textoTranscrito = ""
    let mensagemAcao = ""
    let itemAfetadoId = ""
    let quantidadeAdicionar = 0

    if (textPreset) {
      textoTranscrito = textPreset
    } else {
      // Se gravou áudio real, escolhemos um comando padrão baseado na duração do áudio ou aleatório
      // (Já que o microsserviço real faria a transcrição no backend)
      const comandosPossiveis = [
        "Adicionar 50 sacos de cimento CP II Votoran",
        "Repor 100 barras de aço CA-50 10.0mm",
        "Adicionar 15 metros cúbicos de areia lavada média",
        "Repor 10 milheiros de tijolo cerâmico 8 furos"
      ]
      
      const randomIdx = Math.floor(Math.random() * comandosPossiveis.length)
      textoTranscrito = comandosPossiveis[randomIdx]
    }

    // O "backend" interpreta o comando transcrito e atualiza o banco de dados
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

    // O backend retorna o novo estado do estoque, e o front apenas consome
    setEstoque(prevEstoque => prevEstoque.map(item => {
      if (item.id === itemAfetadoId) {
        const novaQtd = item.quantidade + quantidadeAdicionar
        return {
          ...item,
          quantidade: novaQtd,
          status: novaQtd >= item.estoqueMinimo ? 'Adequado' : 'Crítico'
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

  // Métricas Consolidadas removidas (Dashboard indisponível)

  // Lista de navegação lateral
  const menuItens = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'projects', label: 'Obras & Projetos', icon: Briefcase },
    { id: 'budgets', label: 'Financeiro', icon: DollarSign },
    { id: 'inventory', label: 'Almoxarifado', icon: Package },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ]

  return (
    <div className="min-h-screen font-sans bg-brand-bg-light text-slate-800 dark:bg-brand-bg-dark dark:text-slate-100 flex flex-col md:flex-row relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-brand-green text-brand-green-dark font-medium px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 border border-brand-green-hover animate-bounce">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar - Menu Lateral (Mobile overlay & Desktop Fixo) */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-brand-border-light dark:bg-[#0e141a] dark:border-brand-border-dark transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen flex flex-col justify-between
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Header do Menu */}
          <div className="h-16 px-6 border-b border-brand-border-light dark:border-brand-border-dark flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-green flex items-center justify-center text-brand-green-dark font-bold text-lg">
                B
              </div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-brand-green to-emerald-600 dark:to-emerald-400 bg-clip-text text-transparent">
                smartBIIM
              </span>
            </div>
            {/* Fechar no mobile */}
            <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              <X size={20} />
            </button>
          </div>

          {/* Links do Menu */}
          <nav className="p-4 space-y-1">
            {menuItens.map((item) => {
              const Icon = item.icon
              const isActive = currentScreen === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentScreen(item.id as any)
                    setSidebarOpen(false)
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm transition-all duration-200 group
                    ${isActive 
                      ? 'bg-brand-green/10 text-brand-green-hover dark:text-brand-green font-semibold shadow-sm shadow-brand-green/5' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-white'}
                  `}
                >
                  <Icon size={18} className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-brand-green-hover dark:text-brand-green' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Info do Usuário no Rodapé do Menu */}
        <div className="p-4 border-t border-brand-border-light dark:border-brand-border-dark bg-slate-50/50 dark:bg-slate-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-green-dark border border-brand-green text-brand-green font-semibold flex items-center justify-center">
              {perfil.iniciais}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate text-slate-800 dark:text-slate-200">{perfil.nome}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{perfil.cargo}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop para mobile menu */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Área de Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Barra Superior / Header */}
        <header className="h-16 border-b border-brand-border-light dark:border-brand-border-dark px-6 flex items-center justify-between bg-white/70 dark:bg-brand-bg-dark/70 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Botão Hambúrguer Mobile */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white capitalize">
              {menuItens.find(item => item.id === currentScreen)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Indicador de Tema */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl border border-brand-border-light dark:border-brand-border-dark text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-all duration-300 shadow-sm"
              title={theme === 'dark' ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
            >
              {theme === 'dark' ? (
                <Sun size={18} className="text-brand-green hover:rotate-45 transition-transform" />
              ) : (
                <Moon size={18} className="text-emerald-700 hover:rotate-12 transition-transform" />
              )}
            </button>

            {/* Iniciais Perfil com Atalho para Tela Config */}
            <button 
              onClick={() => setCurrentScreen('settings')}
              className="w-8 h-8 rounded-full bg-brand-green text-brand-green-dark font-bold text-xs flex items-center justify-center border border-brand-green hover:opacity-90 transition-opacity"
            >
              {perfil.iniciais}
            </button>
          </div>
        </header>

        {/* Container das Telas */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-6 flex-1">
          
          {/* ==================== 1. TELA HOME / INÍCIO ==================== */}
          {currentScreen === 'home' && (
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
                <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-6 rounded-2xl shadow-sm lg:col-span-2 flex flex-col justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="p-1.5 bg-brand-green/10 text-brand-green-hover dark:text-brand-green rounded-lg">
                        <Mic size={18} />
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Entrada de Dados por Voz (Almoxarifado)</h3>
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
                    <div className="flex-1 px-4 text-center sm:text-left space-y-2 max-w-sm">
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
          )}

          {/* ==================== 2. TELA OBRAS & PROJETOS ==================== */}
          {currentScreen === 'projects' && (
            <div className="space-y-6 animate-fadeIn">

              {/* Barra de Filtros e Busca */}
              <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-4 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Pesquisar obras por nome..."
                    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green transition-colors"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-slate-500 flex items-center gap-1"><Filter size={12} /> Filtros:</span>
                  <button className="px-3 py-1.5 bg-brand-green/20 text-brand-green-hover dark:text-brand-green border border-brand-green/30 text-xs font-semibold rounded-lg">Todos</button>
                  <button className="px-3 py-1.5 bg-slate-50 border border-brand-border-light dark:bg-slate-900 dark:border-brand-border-dark text-xs text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">Ativos</button>
                  
                  <button 
                    onClick={() => setModalObraOpen(true)}
                    className="ml-auto md:ml-4 px-4 py-2 bg-brand-green hover:bg-brand-green-hover text-brand-green-dark font-bold text-xs md:text-sm rounded-xl flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Plus size={16} /> Cadastrar Obra
                  </button>
                </div>
              </div>

              {/* Grid de Obras */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {obras.map((obra) => {
                  const gastoPercent = obra.orcamentoTotal > 0 ? Math.round((obra.orcamentoGasto / obra.orcamentoTotal) * 100) : 0
                  
                  return (
                    <div 
                      key={obra.id}
                      className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-green/30 transition-all duration-300 flex flex-col justify-between gap-4"
                    >
                      {/* Topo do Card */}
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">{obra.nome}</h3>
                          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 truncate">
                            <MapPin size={12} className="shrink-0" /> {obra.endereco}
                          </span>
                        </div>
                        
                        {/* Badge de Status */}
                        <span className={`
                          px-2.5 py-1 rounded-full text-xxs font-bold uppercase
                          ${obra.status === 'Andamento' ? 'bg-blue-500/10 text-blue-500' : ''}
                          ${obra.status === 'Concluido' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : ''}
                          ${obra.status === 'Planejamento' ? 'bg-slate-500/10 text-slate-500 dark:text-slate-400' : ''}
                        `}>
                          {obra.status}
                        </span>
                      </div>

                      {/* Progresso de Obra */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                          <span>Progresso da Construção</span>
                          <span className="font-bold">{obra.progresso}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-brand-green rounded-full transition-all duration-500"
                            style={{ width: `${obra.progresso}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Progresso Financeiro da Obra */}
                      <div>
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                          <span>Orçamento Utilizado</span>
                          <span className={`font-semibold ${gastoPercent > 90 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-300'}`}>
                            R$ {obra.orcamentoGasto.toLocaleString('pt-BR')} ({gastoPercent}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              gastoPercent > 90 ? 'bg-rose-500' : gastoPercent > 70 ? 'bg-amber-500' : 'bg-slate-400'
                            }`}
                            style={{ width: `${Math.min(gastoPercent, 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                          <span>Total Alocado: R$ {obra.orcamentoTotal.toLocaleString('pt-BR')}</span>
                        </div>
                      </div>

                      {/* Rodapé do Card */}
                      <div className="pt-4 border-t border-brand-border-light dark:border-brand-border-dark flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={13} />
                          <span>{obra.dataInicio} - {obra.dataFim}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                          <User size={13} />
                          <span>{obra.responsavel}</span>
                        </div>
                      </div>

                    </div>
                  )
                })}
              </div>

            </div>
          )}

          {/* ==================== 3. TELA FINANCEIRO & ORÇAMENTOS ==================== */}
          {currentScreen === 'budgets' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Cards de Balanço */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-6 rounded-2xl shadow-sm">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Entradas / Receitas</span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="p-1 bg-emerald-500/10 rounded-lg text-emerald-600"><TrendingUp size={16} /></span>
                    <h3 className="text-2xl font-bold text-emerald-600">
                      R$ {transacoes.filter(t => t.tipo === 'Receita').reduce((a, b) => a + b.valor, 0).toLocaleString('pt-BR')}
                    </h3>
                  </div>
                </div>

                <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-6 rounded-2xl shadow-sm">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Saídas / Despesas</span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="p-1 bg-rose-500/10 rounded-lg text-rose-500"><TrendingDown size={16} /></span>
                    <h3 className="text-2xl font-bold text-rose-500">
                      R$ {transacoes.filter(t => t.tipo === 'Despesa').reduce((a, b) => a + b.valor, 0).toLocaleString('pt-BR')}
                    </h3>
                  </div>
                </div>

                <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-6 rounded-2xl shadow-sm">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Saldo Líquido</span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="p-1 bg-brand-green/10 rounded-lg text-brand-green-hover"><DollarSign size={16} /></span>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      R$ {(
                        transacoes.filter(t => t.tipo === 'Receita').reduce((a, b) => a + b.valor, 0) -
                        transacoes.filter(t => t.tipo === 'Despesa').reduce((a, b) => a + b.valor, 0)
                      ).toLocaleString('pt-BR')}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Tabela de Transações */}
              <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark rounded-2xl shadow-sm overflow-hidden">
                
                {/* Header da Tabela */}
                <div className="px-6 py-4 border-b border-brand-border-light dark:border-brand-border-dark flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Registro de Lançamentos</h3>
                  <button 
                    onClick={() => setModalTransacaoOpen(true)}
                    className="px-4 py-2 bg-brand-green hover:bg-brand-green-hover text-brand-green-dark font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all hover:scale-102 cursor-pointer"
                  >
                    <Plus size={14} /> Novo Lançamento
                  </button>
                </div>

                {/* Tabela Real */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/40 text-xs font-bold text-slate-500 dark:text-slate-400 border-b border-brand-border-light dark:border-brand-border-dark">
                        <th className="px-6 py-3.5">Descrição</th>
                        <th className="px-6 py-3.5">Obra / Projeto</th>
                        <th className="px-6 py-3.5">Categoria</th>
                        <th className="px-6 py-3.5">Data</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5 text-right">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border-light dark:divide-brand-border-dark text-sm">
                      {transacoes.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                          <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">{t.descricao}</td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{t.obraNome}</td>
                          <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{t.categoria}</td>
                          <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{t.data}</td>
                          <td className="px-6 py-4">
                            <span className={`
                              px-2 py-0.5 rounded-full text-xxs font-bold
                              ${t.status === 'Pago' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-500'}
                            `}>
                              {t.status === 'Pago' ? 'Liquidado' : 'Pendente'}
                            </span>
                          </td>
                          <td className={`px-6 py-4 text-right font-bold ${
                            t.tipo === 'Receita' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                          }`}>
                            {t.tipo === 'Receita' ? '+' : '-'} R$ {t.valor.toLocaleString('pt-BR')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          )}

          {/* ==================== 4. TELA ALMOXARIFADO (ESTOQUE) ==================== */}
          {currentScreen === 'inventory' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Métricas do Almoxarifado */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-5 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total de Itens</span>
                    <h3 className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{estoque.length}</h3>
                  </div>
                  <span className="p-3 bg-brand-green/10 rounded-2xl text-brand-green-hover dark:text-brand-green"><Package size={22} /></span>
                </div>

                <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-5 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Itens Críticos</span>
                    <h3 className="text-2xl font-bold mt-1 text-amber-500">{estoque.filter(i => i.status === 'Crítico').length}</h3>
                  </div>
                  <span className="p-3 bg-amber-500/10 rounded-2xl text-amber-500"><AlertTriangle size={22} /></span>
                </div>

                <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-5 rounded-2xl shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Items Esgotados</span>
                    <h3 className="text-2xl font-bold mt-1 text-rose-500">{estoque.filter(i => i.status === 'Esgotado').length}</h3>
                  </div>
                  <span className="p-3 bg-rose-500/10 rounded-2xl text-rose-500"><X size={22} /></span>
                </div>
              </div>

              {/* Tabela do Estoque */}
              <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark rounded-2xl shadow-sm overflow-hidden">
                
                <div className="px-6 py-4 border-b border-brand-border-light dark:border-brand-border-dark flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-semibold">Tabela de Almoxarifado</h3>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-brand-green/20 text-brand-green-hover dark:text-brand-green border border-brand-green/30 text-xs font-semibold rounded-lg">Todos</button>
                    <button className="px-3 py-1 bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark text-xs text-slate-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">Críticos/Esgotados</button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-900/40 text-xs font-bold text-slate-500 dark:text-slate-400 border-b border-brand-border-light dark:border-brand-border-dark">
                        <th className="px-6 py-3.5">Nome do Item</th>
                        <th className="px-6 py-3.5">Categoria</th>
                        <th className="px-6 py-3.5">Quantidade Atual</th>
                        <th className="px-6 py-3.5">Mínimo Recomendado</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border-light dark:divide-brand-border-dark text-sm">
                      {estoque.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                          <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">{item.item}</td>
                          <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{item.categoria}</td>
                          <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">
                            {item.quantidade} {item.unidade}
                          </td>
                          <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                            {item.estoqueMinimo} {item.unidade}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`
                              px-2 py-0.5 rounded-full text-xxs font-bold
                              ${item.status === 'Adequado' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : ''}
                              ${item.status === 'Crítico' ? 'bg-amber-500/10 text-amber-500' : ''}
                              ${item.status === 'Esgotado' ? 'bg-rose-500/10 text-rose-500' : ''}
                            `}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleSolicitarReposicao(item.id, item.item)}
                              disabled={item.status === 'Adequado'}
                              className={`
                                px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                                ${item.status === 'Adequado'
                                  ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                                  : 'bg-brand-green/20 text-brand-green-hover dark:text-brand-green hover:bg-brand-green/30 cursor-pointer'}
                              `}
                            >
                              Repor +50
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          )}

          {/* ==================== 5. TELA CONFIGURAÇÕES ==================== */}
          {currentScreen === 'settings' && (
            <div className="space-y-6 animate-fadeIn max-w-2xl">
              
              {/* Configurações do Perfil */}
              <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-6 rounded-2xl shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Perfil do Usuário</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Edite as informações pessoais exibidas na barra lateral.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-brand-border-light dark:border-brand-border-dark">
                  <div className="w-16 h-16 rounded-full bg-brand-green-dark border-2 border-brand-green text-brand-green font-bold text-xl flex items-center justify-center">
                    {perfil.iniciais}
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Foto / Avatar do Perfil</p>
                    <p className="text-xs text-slate-500">Avatar gerado automaticamente a partir das suas iniciais.</p>
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome Completo</label>
                    <input 
                      type="text" 
                      value={perfil.nome} 
                      onChange={(e) => {
                        const nome = e.target.value
                        const partes = nome.split(' ')
                        const iniciais = partes.map(p => p[0]).join('').substring(0, 2).toUpperCase()
                        setPerfil({ ...perfil, nome, iniciais })
                      }}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cargo / Função</label>
                    <input 
                      type="text" 
                      value={perfil.cargo} 
                      onChange={(e) => setPerfil({ ...perfil, cargo: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Empresa</label>
                    <input 
                      type="text" 
                      value={perfil.empresa} 
                      onChange={(e) => setPerfil({ ...perfil, empresa: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => showToast('Configurações de perfil salvas com sucesso!')}
                  className="px-5 py-2.5 bg-brand-green hover:bg-brand-green-hover text-brand-green-dark font-bold text-sm rounded-xl cursor-pointer shadow-md shadow-brand-green/10 transition-transform active:scale-95"
                >
                  Salvar Alterações
                </button>
              </div>

              {/* Escolha de Tema */}
              <div className="bg-white border border-brand-border-light dark:bg-brand-card-dark dark:border-brand-border-dark p-6 rounded-2xl shadow-sm space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Aparência do Sistema</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Escolha o seu visual preferido para a plataforma.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Tema Claro */}
                  <button 
                    onClick={() => setTheme('light')}
                    className={`
                      p-4 rounded-xl border text-left flex flex-col justify-between h-24 transition-all
                      ${theme === 'light' 
                        ? 'border-brand-green bg-brand-green/5 text-slate-950 shadow-sm' 
                        : 'border-brand-border-light dark:border-brand-border-dark bg-slate-50 dark:bg-slate-900 text-slate-500'}
                    `}
                  >
                    <Sun size={20} className={theme === 'light' ? 'text-brand-green-hover' : ''} />
                    <div>
                      <p className="text-sm font-semibold">Tema Claro</p>
                      <p className="text-[10px] text-slate-400">Verde menta & Fundo Branco</p>
                    </div>
                  </button>

                  {/* Tema Escuro */}
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`
                      p-4 rounded-xl border text-left flex flex-col justify-between h-24 transition-all
                      ${theme === 'dark' 
                        ? 'border-brand-green bg-[#121c17] text-white shadow-sm' 
                        : 'border-brand-border-light dark:border-brand-border-dark bg-slate-50 dark:bg-slate-900 text-slate-500'}
                    `}
                  >
                    <Moon size={20} className={theme === 'dark' ? 'text-brand-green' : ''} />
                    <div>
                      <p className="text-sm font-semibold">Tema Escuro</p>
                      <p className="text-[10px] text-slate-400">Fundo escuro profundo & Verde menta</p>
                    </div>
                  </button>
                </div>
              </div>

            </div>
          )}

        </main>

        {/* Rodapé institucional */}
        <footer className="py-6 border-t border-brand-border-light dark:border-brand-border-dark text-center text-xs text-slate-400 dark:text-slate-500 mt-auto bg-slate-50/20 dark:bg-slate-950/10">
          <p>&copy; {new Date().getFullYear()} smartBIIM IA - Engenharia & Eficiência. Todos os direitos reservados.</p>
        </footer>

      </div>

      {/* ==================== MODAL: NOVA OBRA ==================== */}
      {modalObraOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-card-dark border border-brand-border-light dark:border-brand-border-dark rounded-2xl w-full max-w-md shadow-2xl p-6 overflow-hidden animate-scaleIn">
            <div className="flex justify-between items-center pb-4 border-b border-brand-border-light dark:border-brand-border-dark">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HardHat className="text-brand-green" size={18} /> Cadastrar Nova Obra
              </h3>
              <button onClick={() => setModalObraOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCriarObra} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Nome do Projeto *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Edifício Green Tower"
                  value={novaObra.nome}
                  onChange={(e) => setNovaObra({ ...novaObra, nome: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Endereço *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Av. Atlântica, 100 - Balneário Camboriú, SC"
                  value={novaObra.endereco}
                  onChange={(e) => setNovaObra({ ...novaObra, endereco: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Orçamento Total (R$) *</label>
                  <input 
                    type="number" 
                    required
                    placeholder="Ex: 500000"
                    value={novaObra.orcamentoTotal || ''}
                    onChange={(e) => setNovaObra({ ...novaObra, orcamentoTotal: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Progresso Inicial (%)</label>
                  <input 
                    type="number" 
                    min="0"
                    max="100"
                    value={novaObra.progresso}
                    onChange={(e) => setNovaObra({ ...novaObra, progresso: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Status da Obra</label>
                  <select 
                    value={novaObra.status}
                    onChange={(e) => setNovaObra({ ...novaObra, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
                  >
                    <option value="Planejamento">Planejamento</option>
                    <option value="Andamento">Em Andamento</option>
                    <option value="Concluido">Concluído</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Responsável</label>
                  <select 
                    value={novaObra.responsavel}
                    onChange={(e) => setNovaObra({ ...novaObra, responsavel: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
                  >
                    <option value="Eng. Marcos Silva">Eng. Marcos Silva</option>
                    <option value="Engª. Sofia Costa">Engª. Sofia Costa</option>
                    <option value="Eng. Roberto Azevedo">Eng. Roberto Azevedo</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-brand-border-light dark:border-brand-border-dark justify-end">
                <button 
                  type="button"
                  onClick={() => setModalObraOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:opacity-90 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-brand-green hover:bg-brand-green-hover text-brand-green-dark font-bold rounded-xl text-xs cursor-pointer shadow-md shadow-brand-green/10"
                >
                  Salvar Obra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: NOVO LANÇAMENTO FINANCEIRO ==================== */}
      {modalTransacaoOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-card-dark border border-brand-border-light dark:border-brand-border-dark rounded-2xl w-full max-w-md shadow-2xl p-6 overflow-hidden animate-scaleIn">
            <div className="flex justify-between items-center pb-4 border-b border-brand-border-light dark:border-brand-border-dark">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <DollarSign className="text-brand-green" size={18} /> Registrar Lançamento
              </h3>
              <button onClick={() => setModalTransacaoOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCriarTransacao} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Descrição do Lançamento *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Compra de areia lavada grossa"
                  value={novaTransacao.descricao}
                  onChange={(e) => setNovaTransacao({ ...novaTransacao, descricao: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Vincular à Obra *</label>
                <select 
                  value={novaTransacao.obraNome}
                  required
                  onChange={(e) => setNovaTransacao({ ...novaTransacao, obraNome: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
                >
                  <option value="">Selecione uma obra...</option>
                  {obras.map(o => (
                    <option key={o.id} value={o.nome}>{o.nome}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Valor (R$) *</label>
                  <input 
                    type="number" 
                    required
                    placeholder="Ex: 1250"
                    value={novaTransacao.valor || ''}
                    onChange={(e) => setNovaTransacao({ ...novaTransacao, valor: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Tipo de Lançamento</label>
                  <select 
                    value={novaTransacao.tipo}
                    onChange={(e) => setNovaTransacao({ ...novaTransacao, tipo: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
                  >
                    <option value="Despesa">Saída (Despesa)</option>
                    <option value="Receita">Entrada (Receita)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Categoria de Custo</label>
                  <select 
                    value={novaTransacao.categoria}
                    onChange={(e) => setNovaTransacao({ ...novaTransacao, categoria: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
                  >
                    <option value="Material">Material</option>
                    <option value="Mão de Obra">Mão de Obra</option>
                    <option value="Equipamentos">Equipamentos</option>
                    <option value="Administrativo">Administrativo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Status Pagamento</label>
                  <select 
                    value={novaTransacao.status}
                    onChange={(e) => setNovaTransacao({ ...novaTransacao, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-brand-border-light dark:border-brand-border-dark rounded-xl focus:outline-none focus:border-brand-green text-slate-800 dark:text-slate-100"
                  >
                    <option value="Pago">Liquidado (Pago)</option>
                    <option value="Pendente">Pendente</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-brand-border-light dark:border-brand-border-dark justify-end">
                <button 
                  type="button"
                  onClick={() => setModalTransacaoOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:opacity-90 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-brand-green hover:bg-brand-green-hover text-brand-green-dark font-bold rounded-xl text-xs cursor-pointer shadow-md shadow-brand-green/10"
                >
                  Confirmar Lançamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Animações CSS embutidas de fade-in e scale-in */}
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
        .text-xxs {
          font-size: 0.68rem;
        }
        .text-xxs {
          font-size: 0.7rem;
        }
      `}</style>
    </div>
  )
}
