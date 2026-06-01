import { 
  Home, 
  Briefcase, 
  DollarSign, 
  Package, 
  Settings, 
  X 
} from 'lucide-react'
import type { PerfilUsuario } from '../../types'

interface SidebarProps {
  currentScreen: 'home' | 'projects' | 'budgets' | 'inventory' | 'settings'
  setCurrentScreen: (screen: 'home' | 'projects' | 'budgets' | 'inventory' | 'settings') => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  perfil: PerfilUsuario
}

export function Sidebar({ 
  currentScreen, 
  setCurrentScreen, 
  sidebarOpen, 
  setSidebarOpen, 
  perfil 
}: SidebarProps) {
  
  const menuItens = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'projects', label: 'Obras & Projetos', icon: Briefcase },
    { id: 'budgets', label: 'Financeiro', icon: DollarSign },
    { id: 'inventory', label: 'Almoxarifado', icon: Package },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ] as const

  return (
    <>
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
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
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
                    setCurrentScreen(item.id)
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
    </>
  )
}


