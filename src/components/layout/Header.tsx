import { Menu, Sun, Moon } from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'
import type { PerfilUsuario } from '../../types'

interface HeaderProps {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  setSidebarOpen: (open: boolean) => void
  perfil: PerfilUsuario
}

export function Header({
  theme,
  setTheme,
  setSidebarOpen,
  perfil
}: HeaderProps) {
  const location = useLocation()

  const getScreenName = (path: string) => {
    switch(path) {
      case '/': return 'Início'
      case '/projetos': return 'Obras & Projetos'
      case '/almoxarifado': return 'Almoxarifado'
      case '/configuracoes': return 'Configurações'
      default: return 'Sistema'
    }
  }

  return (
    <header className="h-16 border-b border-brand-border-light dark:border-brand-border-dark bg-white/70 dark:bg-brand-bg-dark/70 backdrop-blur-md sticky top-0 z-20">
      <div className="h-full px-6 max-w-7xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white capitalize truncate">
            {getScreenName(location.pathname)}
          </h1>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl border border-brand-border-light dark:border-brand-border-dark text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-all duration-300 shadow-sm cursor-pointer"
            title={theme === 'dark' ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
          >
            {theme === 'dark' ? (
              <Sun size={18} className="text-brand-green hover:rotate-45 transition-transform" />
            ) : (
              <Moon size={18} className="text-emerald-700 hover:rotate-12 transition-transform" />
            )}
          </button>

          <Link
            to="/configuracoes"
            className="w-8 h-8 rounded-full bg-brand-green text-brand-green-dark font-bold text-xs flex items-center justify-center border border-brand-green hover:opacity-90 transition-opacity cursor-pointer"
          >
            {perfil.iniciais}
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem('token')
              window.location.href = '/login'
            }}
            className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors ml-2 cursor-pointer"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  )
}
