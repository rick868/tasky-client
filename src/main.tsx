import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppWrapper from './App.tsx'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppWrapper />
    </AuthProvider>
  </StrictMode>,
)
