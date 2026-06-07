import { 
  Home, 
  Briefcase, 
  Package, 
  Settings, 
  X,
  Truck
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import type { PerfilUsuario } from '../../types'

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  perfil: PerfilUsuario
}

export function Sidebar({ 
  sidebarOpen, 
  setSidebarOpen, 
  perfil 
}: SidebarProps) {
  
  const menuItensFull = [
    { to: '/', label: 'Início', icon: Home },
    { to: '/projetos', label: 'Obras & Projetos', icon: Briefcase },
    { to: '/almoxarifado', label: 'Almoxarifado', icon: Package },
    { to: '/fornecedores', label: 'Fornecedores', icon: Truck },
    { to: '/configuracoes', label: 'Configurações', icon: Settings },
  ] as const

  const cargoNorm = perfil.cargo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
  const isOperador = cargoNorm.includes('pedreiro') || cargoNorm.includes('operador') || cargoNorm.includes('operario')
  const menuItens = isOperador ? menuItensFull.filter(item => item.to === '/' || item.to === '/configuracoes') : menuItensFull

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
                Gestão de Obras
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
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => `
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm transition-all duration-200 group
                    ${isActive 
                      ? 'bg-brand-green/10 text-brand-green-hover dark:text-brand-green font-semibold shadow-sm shadow-brand-green/5' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-white'}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={18} className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-brand-green-hover dark:text-brand-green' : 'text-slate-400 dark:text-slate-500'}`} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
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
