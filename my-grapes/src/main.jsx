import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "grapesjs/dist/css/grapes.min.css"
import App from './App.jsx'
import 'primereact/resources/themes/lara-light-indigo/theme.css';  // Thème de PrimeReact
import 'primereact/resources/primereact.min.css';                  // Styles de base de PrimeReact
import 'primeicons/primeicons.css';                                // Icônes de PrimeIcons


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
