// Configuración de Vite para que funcione con React.
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()], // Agrega el plugin de React para Vite, que permite el soporte de JSX y otras características de React.
})
