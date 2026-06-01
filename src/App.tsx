import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

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
import { SettingsScreen } from './components/screens/SettingsScreen'

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))

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
    startRecording,
    stopRecording,
    processarAudioComando
  } = useVoiceRecording({ setEstoque: () => {}, showToast })

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
              }} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        {/* Rotas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout theme={theme} setTheme={setTheme} toastMessage={toastMessage} />}>
            <Route path="/" element={
              <HomeScreen 
                estoque={[]} 
                recordingStatus={recordingStatus}
                recordingTime={recordingTime}
                transcriptionResult={transcriptionResult}
                startRecording={startRecording}
                stopRecording={stopRecording}
                processarAudioComando={processarAudioComando}
              />
            } />
            <Route path="/projetos" element={<ProjectsScreen showToast={showToast} />} />
            <Route path="/almoxarifado" element={<InventoryScreen showToast={showToast} />} />
            <Route path="/configuracoes" element={
              <SettingsScreen 
                perfil={{ nome: 'Usuário Logado', cargo: 'Engenheiro', empresa: 'Gestão de Obras', iniciais: 'UL' }} 
                setPerfil={() => {}} 
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
