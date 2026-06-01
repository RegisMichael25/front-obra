
import { Sun, Moon } from 'lucide-react';
import type { PerfilUsuario } from '../../types';

interface SettingsScreenProps {
  perfil: PerfilUsuario;
  setPerfil: (perfil: PerfilUsuario) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  showToast: (msg: string) => void;
}

export function SettingsScreen({ perfil, setPerfil, theme, setTheme, showToast }: SettingsScreenProps) {
  return (
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
              p-4 rounded-xl border text-left flex flex-col justify-between h-24 transition-all cursor-pointer
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
              p-4 rounded-xl border text-left flex flex-col justify-between h-24 transition-all cursor-pointer
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
  );
}



