import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import type { PerfilUsuario } from './types'

// Hooks
import { useVoiceRecording } from './hooks/useVoiceRecording'

// Layout & Auth
import { MainLayout } from './components/layout/MainLayout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

// Telas
import { LoginScreen } from './components/screens/LoginScreen'
import { HomeScreen } from './components/screens/HomeScreen'
import { ProjectsScreen } from './components/screens/ProjectsScreen'
import { InventoryScreen } from './components/screens/InventoryScreen'
import { FornecedoresScreen } from './components/screens/FornecedoresScreen'
import { SettingsScreen } from './components/screens/SettingsScreen'

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))

  const [perfil, setPerfil] = useState<PerfilUsuario>(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payload = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
        const nome = payload.nome || 'Usuário Logado';
        const cargo = payload.cargo || 'Engenheiro';
        const partes = nome.split(' ');
        const iniciais = partes.length > 1 
          ? (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
          : nome.slice(0, 2).toUpperCase();
        return { nome, cargo, empresa: 'Gestão de Obras', iniciais };
      } catch (e) {
        console.error('Erro ao decodificar token inicial', e);
      }
    }
    return { nome: 'Usuário Logado', cargo: 'Engenheiro', empresa: 'Gestão de Obras', iniciais: 'UL' };
  });

  // Estado do Tema (Light / Dark)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme')
    return (saved as 'light' | 'dark') || 'dark'
  })

  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Hook para gravação de voz (MOCK - Não mexer no microsserviço ainda)
  const {
    recordingStatus,
    recordingTime,
    transcriptionResult,
    previewAudioUrl,
    startRecording,
    stopRecording,
    retryRecording,
    confirmSend,
    errorMessage
  } = useVoiceRecording({ setEstoque: () => {}, showToast })

  const cargoNorm = perfil.cargo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
  const isOperador = cargoNorm.includes('pedreiro') || cargoNorm.includes('operador') || cargoNorm.includes('operario')

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública de Login */}
        <Route 
          path="/login" 
          element={
            !token ? (
              <LoginScreen onLogin={(t) => {
                localStorage.setItem('token', t)
                setToken(t)
                try {
                  const payload = JSON.parse(decodeURIComponent(escape(atob(t.split('.')[1]))));
                  const nome = payload.nome || 'Usuário Logado';
                  const cargo = payload.cargo || 'Engenheiro';
                  const partes = nome.split(' ');
                  const iniciais = partes.length > 1 
                    ? (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
                    : nome.slice(0, 2).toUpperCase();
                  setPerfil({ nome, cargo, empresa: 'Gestão de Obras', iniciais });
                } catch (e) {
                  console.error('Erro ao decodificar token de login', e);
                }
              }} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        {/* Rotas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout theme={theme} setTheme={setTheme} toastMessage={toastMessage} perfil={perfil} />}>
            <Route path="/" element={
              <HomeScreen 
                perfil={perfil}
                estoque={[]} 
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
            } />
            
            {/* Rotas restritas para administradores/engenheiros */}
            {!isOperador && (
              <>
                <Route path="/projetos" element={<ProjectsScreen showToast={showToast} />} />
                <Route path="/almoxarifado" element={<InventoryScreen showToast={showToast} />} />
                <Route path="/fornecedores" element={<FornecedoresScreen />} />
              </>
            )}

            {/* Configurações (Acessível a todos, incluindo operários) */}
            <Route path="/configuracoes" element={
              <SettingsScreen 
                perfil={perfil} 
                setPerfil={setPerfil} 
                theme={theme} 
                setTheme={setTheme} 
                showToast={showToast} 
              />
            } />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
