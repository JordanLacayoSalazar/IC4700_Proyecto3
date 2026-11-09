// Archivo principal de la aplicación React.
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import rolDetectiveImg from './assets/rol_detective.png'
import Bienvenida from './components/bienvenida.jsx'
import MenuPrincipal from './components/menuPrincipal.jsx'

/**
 * Entradas: ninguna.
 * Salidas: JSX de la pantalla activa de la aplicación.
 * Restricciones: ninguna.
 * Objetivo: coordina la navegación principal, controla qué interfaces se muestran y las transiciones entre pantallas.
 */
function App() {
  const [pantalla, setPantalla] = useState('bienvenida')
  const [rolMostrado, setRolMostrado] = useState(false)

  /**
   * Entradas: ninguna.
   * Salidas: actualiza la pantalla activa.
   * Restricciones: la animación de rol solo se muestra la primera vez que se inicia la investigación.
   * Objetivo: iniciar la investigación y mostrar el menú después de la animación inicial.
   */
  function empezarInvestigacion() {
    if (rolMostrado) {
      setPantalla('menu')
      return
    }
    setPantalla('rol')
    setRolMostrado(true)
  }

  /**
   * Entradas: ninguna.
   * Salidas: cambia la pantalla activa a bienvenida.
   * Restricciones: se invoca desde la acción Salir del menú.
   * Objetivo: regresar a la pantalla de bienvenida.
   */
  function salirInvestigacion() {
    setPantalla('bienvenida')
  }

  /**
   * Entradas: ninguna.
   * Salidas: JSX correspondiente a bienvenida, rol o menú.
   * Restricciones: el contenido depende del valor actual de pantalla.
   * Objetivo: seleccionar y renderizar el contenido de la pantalla activa.
   */
  function renderizarContenidoPantalla() {
    if (pantalla === 'rol') {
      return (
        <motion.main className="pantalla-rol">
          <motion.img
            className="imagen-rol"
            src={rolDetectiveImg}
            alt="Tu rol es detective"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2, times: [0, 0.25, 0.7, 1], ease: 'linear' }}
            onAnimationComplete={terminarAnimacionRol}
          />
        </motion.main>
      );
    } else if (pantalla === 'menu') {
      return <MenuPrincipal onSalir={salirInvestigacion} />;
    } else {
      return <Bienvenida onEmpezar={empezarInvestigacion} />;
    }
  }

  /**
   * Entradas: notificación de Motion al completar la animación (no se utiliza su valor).
   * Salidas: cambia la pantalla activa al menú.
   * Restricciones: se utiliza al completar la animación del rol.
   * Objetivo: continuar al menú una vez concluida la animación inicial.
   */
  function terminarAnimacionRol() {
    setPantalla('menu')
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="transicion-pantalla"
        key={pantalla}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        {renderizarContenidoPantalla()}
      </motion.div>
    </AnimatePresence>
  );
}

export default App
