import { Menu, Sun, Moon } from 'lucide-react'
import type { PerfilUsuario } from '../../types'

interface HeaderProps {
  currentScreen: 'home' | 'projects' | 'budgets' | 'inventory' | 'settings'
  setCurrentScreen: (screen: 'home' | 'projects' | 'budgets' | 'inventory' | 'settings') => void
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  setSidebarOpen: (open: boolean) => void
  perfil: PerfilUsuario
}

export function Header({
  currentScreen,
  setCurrentScreen,
  theme,
  setTheme,
  setSidebarOpen,
  perfil
}: HeaderProps) {
  
  const screenLabels = {
    home: 'Início',
    projects: 'Obras & Projetos',
    budgets: 'Financeiro',
    inventory: 'Almoxarifado',
    settings: 'Configurações'
  } as const

  return (
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
          {screenLabels[currentScreen]}
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
  )
}


