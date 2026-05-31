import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-6 md:p-12 relative overflow-hidden font-sans">
      {/* Decorative gradient backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-brand-purple/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-blue/10 blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="w-full max-w-5xl flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-lg tracking-wider bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent">PROJ-OBRA</span>
        </div>
        <span className="text-xs text-slate-400 bg-slate-900/80 border border-slate-800 rounded-full px-3 py-1 backdrop-blur-md">Vite + React + TS + Tailwind v4</span>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl flex flex-col items-center justify-center my-12 z-10 text-center gap-8">
        
        {/* Logo and Hero Showcase */}
        <div className="relative flex items-center justify-center gap-6 md:gap-8 bg-slate-900/40 p-8 rounded-3xl border border-slate-800/80 backdrop-blur-xl shadow-2xl">
          <div className="relative group">
            <img 
              src={heroImg} 
              className="w-32 md:w-40 filter drop-shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-transform duration-500 group-hover:scale-105" 
              alt="Hero graphic" 
            />
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-center gap-4">
              <a href="https://vite.dev" target="_blank" rel="noreferrer" className="hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all">
                <img src={viteLogo} className="w-12 h-12 md:w-16 md:h-16 animate-pulse" alt="Vite logo" />
              </a>
              <a href="https://react.dev" target="_blank" rel="noreferrer" className="hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all">
                <img src={reactLogo} className="w-12 h-12 md:w-16 md:h-16 spin-slow" alt="React logo" />
              </a>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-4 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            Pronto para Iniciar
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            Edite o arquivo <code className="bg-slate-900 px-2 py-1 rounded text-brand-purple text-xs md:text-sm font-mono border border-slate-800/60">src/App.tsx</code> para testar a atualização rápida (HMR).
          </p>
        </div>

        {/* Interactive Button */}
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => setCount((count) => count + 1)}
            className="px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-purple hover:from-brand-blue/90 hover:to-brand-purple/90 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.03] shadow-lg shadow-brand-blue/20 hover:shadow-brand-purple/30 cursor-pointer text-sm md:text-base"
          >
            Contador: {count}
          </button>
        </div>

        {/* Links Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 text-left">
          {/* Card 1: Documentation */}
          <div className="bg-slate-900/30 hover:bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-slate-800/80 backdrop-blur-md transition-all duration-300 hover:border-brand-blue/40 flex flex-col gap-4">
            <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2 text-brand-blue">
              <span>📚</span> Documentação
            </h2>
            <p className="text-slate-400 text-xs md:text-sm">
              Explore os guias oficiais e APIs para construir interfaces incríveis com Vite e React.
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <a 
                href="https://vite.dev/" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 hover:border-brand-blue text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                Vite Docs
              </a>
              <a 
                href="https://react.dev/" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 hover:border-brand-purple text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                React Docs
              </a>
            </div>
          </div>

          {/* Card 2: Community */}
          <div className="bg-slate-900/30 hover:bg-slate-900/60 p-6 md:p-8 rounded-2xl border border-slate-800/80 backdrop-blur-md transition-all duration-300 hover:border-brand-purple/40 flex flex-col gap-4">
            <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2 text-brand-purple">
              <span>🌐</span> Conecte-se
            </h2>
            <p className="text-slate-400 text-xs md:text-sm">
              Participe da comunidade oficial do ecossistema e acompanhe as atualizações mais recentes.
            </p>
            <div className="flex flex-wrap gap-3 mt-2">
              <a 
                href="https://github.com/vitejs/vite" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs flex items-center gap-1 bg-slate-950/80 border border-slate-800 hover:border-slate-600 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                GitHub
              </a>
              <a 
                href="https://chat.vite.dev/" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs flex items-center gap-1 bg-slate-950/80 border border-slate-800 hover:border-indigo-500 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                Discord
              </a>
              <a 
                href="https://x.com/vite_js" 
                target="_blank" 
                rel="noreferrer"
                className="text-xs flex items-center gap-1 bg-slate-950/80 border border-slate-800 hover:border-sky-500 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                X.com
              </a>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl flex justify-center items-center pt-8 border-t border-slate-900 text-slate-500 text-xs z-10">
        <p>&copy; {new Date().getFullYear()} PROJ-OBRA. Todos os direitos reservados.</p>
      </footer>

      {/* Spin custom css animation */}
      <style>{`
        .spin-slow {
          animation: spin 15s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}

export default App
