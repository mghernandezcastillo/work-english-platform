import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { applyBrandTheme } from './lib/brand.js'
import './styles/index.css'

// Apply brand theme from config/brand.json before render
applyBrandTheme()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
