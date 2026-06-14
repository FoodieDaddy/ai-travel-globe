import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import ChinaMemoryPage from './pages/ChinaMemoryPage.tsx'
import './index.css'
import { LanguageProvider } from './i18n/LanguageContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/china" element={<ChinaMemoryPage />} />
          <Route path="/china-memory" element={<ChinaMemoryPage />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>,
)
