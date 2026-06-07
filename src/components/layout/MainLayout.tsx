import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Footer } from './Footer';
import { Toast } from '../common/Toast';
import type { PerfilUsuario } from '../../types';

interface MainLayoutProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toastMessage: string | null;
  perfil: PerfilUsuario;
}

export function MainLayout({ theme, setTheme, toastMessage, perfil }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Efeito para injetar a classe Dark no HTML
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="min-h-screen font-sans bg-brand-bg-light text-slate-800 dark:bg-brand-bg-dark dark:text-slate-100 flex flex-col md:flex-row relative overflow-x-hidden">
      
      {toastMessage && <Toast message={toastMessage} />}

      <Sidebar 
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

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-scroll overflow-x-hidden">
        <Header 
          theme={theme} 
          setTheme={setTheme} 
          setSidebarOpen={setSidebarOpen} 
          perfil={perfil} 
        />

        <main className="p-6 max-w-7xl w-full mx-auto space-y-6 flex-1">
          <Outlet />
        </main>

        <Footer />
      </div>

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
  );
}
