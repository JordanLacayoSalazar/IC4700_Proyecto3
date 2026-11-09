/* 
    Este archivo inicia el motor de React, importa los estilos CSS globales 
    e inyecta el componente principal <App /> dentro del archivo index.html
*/

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
