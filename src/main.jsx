import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/common/ErrorBoundary.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { applyBrandTheme } from './lib/brand.js'
import './styles/index.css'

// Apply brand theme from config/brand.json before render
applyBrandTheme()

// ═══ CHUNK LOAD ERROR RECOVERY ═══
// After a deploy, old JS chunk hashes no longer exist on the server.
// If a lazy-loaded chunk fails, auto-reload to get the new HTML
// that references the correct new chunk hashes.
// Uses sessionStorage to prevent infinite reload loops.
window.addEventListener('error', (event) => {
  const msg = event?.message || ''
  if (
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Loading chunk') ||
    msg.includes('Loading CSS chunk') ||
    msg.includes('Importing a module script failed')
  ) {
    const reloadKey = 'ew-chunk-reload'
    const lastReload = sessionStorage.getItem(reloadKey)
    const now = Date.now()
    // Only auto-reload once per 30 seconds to prevent loops
    if (!lastReload || now - Number(lastReload) > 30000) {
      sessionStorage.setItem(reloadKey, String(now))
      console.warn('[English for Work] Chunk load failed, reloading for latest version...')
      window.location.reload()
    }
  }
})

// Same for unhandled promise rejections (dynamic import() returns a promise)
window.addEventListener('unhandledrejection', (event) => {
  const msg = event?.reason?.message || ''
  if (
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Importing a module script failed')
  ) {
    const reloadKey = 'ew-chunk-reload'
    const lastReload = sessionStorage.getItem(reloadKey)
    const now = Date.now()
    if (!lastReload || now - Number(lastReload) > 30000) {
      sessionStorage.setItem(reloadKey, String(now))
      console.warn('[English for Work] Dynamic import failed, reloading for latest version...')
      window.location.reload()
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
