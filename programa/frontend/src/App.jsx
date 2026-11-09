// Archivo principal de la aplicación React.
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Bienvenida from './components/bienvenida.jsx'
import MenuPrincipal from './components/menuPrincipal.jsx'

// Punto de entrada de la aplicación React. Renderiza la interfaz de usuario y se comunica con el backend.
function App() {
  const [mostrarMenu, setMostrarMenu] = useState(false)

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        className="transicion-pantalla"
        key={mostrarMenu ? 'menu-principal' : 'bienvenida'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        {mostrarMenu ? (
          <MenuPrincipal onSalir={() => setMostrarMenu(false)} />
        ) : (
          <Bienvenida onEmpezar={() => setMostrarMenu(true)} />
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default App
