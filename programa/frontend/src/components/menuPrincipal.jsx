import { useEffect, useState } from 'react'
import {
  AccessTimeOutlined,
  ArrowBackOutlined,
  GroupsOutlined,
  InfoOutlined,
  LightbulbOutlined,
  LogoutOutlined,
  PersonSearchOutlined,
  GavelOutlined,
  HistoryToggleOffOutlined,
} from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'
import { AnimatePresence, motion } from 'motion/react'
import detectiveImg from '../assets/detective-1.png'
import detectiveResultadoImg from '../assets/detective-2.png'
import {
  consultarInformacionCaso,
  consultarEvidenciasCaso,
  consultarLugaresCaso,
  consultarObjetosCaso,
} from '../api/investigacion.api.js'
import { consultarPersonasCaso } from '../api/personas.api.js'
import PanelDatos from './panelDatos.jsx'
import ResultadoConsulta from './resultadoConsultaTexto.jsx'
import ResultadoEvidencias from './resultadoEvidencias.jsx'
import ResultadoLugares from './resultadoLugares.jsx'
import ResultadoObjetos from './resultadoObjetos.jsx'
import ResultadoPersonas from './resultadoPersonas.jsx'
import './menuPrincipal.css'

const opcionesMenu = [
  { texto: 'Consultar información del caso', icono: InfoOutlined },
  { texto: 'Investigar a una persona', icono: PersonSearchOutlined },
  { texto: 'Obtener posibles responsables', icono: GroupsOutlined },
  { texto: 'Generar explicaciones', icono: LightbulbOutlined },
  { texto: 'Resolver el caso', icono: GavelOutlined },
  { texto: 'Consultar movimiento por hora', icono: AccessTimeOutlined },
  { texto: 'Consultar movimientos por intervalo', icono: HistoryToggleOffOutlined },
]

/**
 * Entradas: datosCaso opcionales y función onSalir del componente padre.
 * Salidas: JSX del menú principal y panel de resultados.
 * Restricciones: la consulta de personas se realiza al montar el menú; la opción indexada 0
 * abre información del caso y el resumen de personas depende de la respuesta del backend.
 * Objetivo: coordinar las consultas de la pantalla principal y presentar sus resultados.
 */
function MenuPrincipal({ datosCaso, onSalir }) {
  const [tipoResultado, setTipoResultado] = useState(null)
  const [textoResultado, setTextoResultado] = useState('')
  const [cargandoResultado, setCargandoResultado] = useState(false)
  const [errorResultado, setErrorResultado] = useState('')
  const [datosPersonas, setDatosPersonas] = useState(null)
  const [cargandoPersonas, setCargandoPersonas] = useState(true)
  const [errorPersonas, setErrorPersonas] = useState('')
  const [lugares, setLugares] = useState([])
  const [cantidadLugares, setCantidadLugares] = useState(null)
  const [cargandoLugares, setCargandoLugares] = useState(true)
  const [errorLugares, setErrorLugares] = useState('')
  const [objetos, setObjetos] = useState([])
  const [cantidadObjetos, setCantidadObjetos] = useState(null)
  const [cargandoObjetos, setCargandoObjetos] = useState(true)
  const [errorObjetos, setErrorObjetos] = useState('')
  const [evidencias, setEvidencias] = useState([])
  const [cantidadEvidencias, setCantidadEvidencias] = useState(null)
  const [cargandoEvidencias, setCargandoEvidencias] = useState(true)
  const [errorEvidencias, setErrorEvidencias] = useState('')

  /**
   * Entradas: ninguna.
   * Salidas: inicia la carga asíncrona de personas y entrega a React la función de limpieza.
   * Restricciones: se ejecuta una vez al montar el menú; invalida actualizaciones al desmontarlo.
   * Objetivo: conectar la carga inicial de personas al ciclo de vida del componente.
   */
  function iniciarCargaPersonas() {
    let estaMenuMontado = true

    /**
     * Entradas: ninguna.
     * Salidas: actualiza los estados de datos, error y carga con la respuesta de la API.
     * Restricciones: solo actualiza el componente si sigue montado.
     * Objetivo: consultar y conservar los datos de personas para el conteo y el detalle.
     */
    async function cargarPersonas() {
      try {
        const resultado = await consultarPersonasCaso()
        if (estaMenuMontado) setDatosPersonas(resultado)
      } catch (error) {
        if (estaMenuMontado) {
          setErrorPersonas(
            error instanceof Error ? error.message : 'Ocurrió un error al consultar las personas.',
          )
        }
      } finally {
        if (estaMenuMontado) setCargandoPersonas(false)
      }
    }

    cargarPersonas()

    /**
     * Entradas: ninguna.
     * Salidas: marca como desmontado el menú.
     * Restricciones: la función se ejecuta al desmontar el componente o limpiar el efecto.
     * Objetivo: impedir actualizaciones de estado después de desmontar el menú.
     */
    return function limpiarCargaPersonas() {
      estaMenuMontado = false
    }
  }

  useEffect(iniciarCargaPersonas, [])

  /**
   * Entradas: ninguna.
   * Salidas: carga cantidad y lugares desde el backend y entrega la función de limpieza.
   * Restricciones: actualiza el estado solo mientras el menú permanece montado.
   * Objetivo: mostrar la cantidad de lugares en el resumen y reutilizar el resultado al abrirlo.
   */
  function iniciarCargaLugares() {
    let estaMenuMontado = true

    async function cargarLugares() {
      try {
        const resultado = await consultarLugaresCaso()
        if (estaMenuMontado) {
          setCantidadLugares(resultado.cantidad)
          setLugares(resultado.lugares)
        }
      } catch (error) {
        if (estaMenuMontado) {
          setErrorLugares(
            error instanceof Error ? error.message : 'Ocurrió un error al consultar los lugares.',
          )
        }
      } finally {
        if (estaMenuMontado) setCargandoLugares(false)
      }
    }

    cargarLugares()

    return function limpiarCargaLugares() {
      estaMenuMontado = false
    }
  }

  useEffect(iniciarCargaLugares, [])

  /**
   * Entradas: ninguna.
   * Salidas: carga el conteo y el detalle de objetos y entrega la función de limpieza.
   * Restricciones: actualiza el estado solo mientras el menú permanece montado.
   * Objetivo: mostrar el conteo de objetos en el resumen y preparar su detalle.
   */
  function iniciarCargaObjetos() {
    let estaMenuMontado = true

    async function cargarObjetos() {
      try {
        const resultado = await consultarObjetosCaso()
        if (estaMenuMontado) {
          setCantidadObjetos(resultado.cantidad)
          setObjetos(resultado.objetos)
        }
      } catch (error) {
        if (estaMenuMontado) {
          setErrorObjetos(
            error instanceof Error ? error.message : 'Ocurrió un error al consultar los objetos.',
          )
        }
      } finally {
        if (estaMenuMontado) setCargandoObjetos(false)
      }
    }

    cargarObjetos()

    return function limpiarCargaObjetos() {
      estaMenuMontado = false
    }
  }

  useEffect(iniciarCargaObjetos, [])

  /**
   * Entradas: ninguna.
   * Salidas: carga el conteo y el detalle de evidencias y entrega la función de limpieza.
   * Restricciones: actualiza el estado solo mientras el menú permanece montado.
   * Objetivo: obtener las evidencias del backend para el resumen y su vista gráfica.
   */
  function iniciarCargaEvidencias() {
    let estaMenuMontado = true

    async function cargarEvidencias() {
      try {
        const resultado = await consultarEvidenciasCaso()
        if (estaMenuMontado) {
          setCantidadEvidencias(resultado.cantidad)
          setEvidencias(resultado.evidencias)
        }
      } catch (error) {
        if (estaMenuMontado) {
          setErrorEvidencias(
            error instanceof Error ? error.message : 'Ocurrió un error al consultar las evidencias.',
          )
        }
      } finally {
        if (estaMenuMontado) setCargandoEvidencias(false)
      }
    }

    cargarEvidencias()

    return function limpiarCargaEvidencias() {
      estaMenuMontado = false
    }
  }

  useEffect(iniciarCargaEvidencias, [])

  /**
   * Entradas: índice de la opción seleccionada en opcionesMenu.
   * Salidas: abre una vista y actualiza los estados de carga, texto o error de la consulta.
   * Restricciones: por ahora solo el índice 0 tiene una consulta implementada.
   * Objetivo: ejecutar la consulta de información del caso seleccionada en el menú lateral.
   */
  async function manejarOpcion(indice) {
    if (indice !== 0) return

    setTipoResultado('informacion')
    setCargandoResultado(true)
    setTextoResultado('')
    setErrorResultado('')

    try {
      const texto = await consultarInformacionCaso()
      setTextoResultado(texto)
    } catch (error) {
      setErrorResultado(
        error instanceof Error ? error.message : 'Ocurrió un error al consultar el caso.',
      )
    } finally {
      setCargandoResultado(false)
    }
  }

  /**
   * Entradas: opción con texto e icono e índice en opcionesMenu.
   * Salidas: botón JSX con su texto, icono, estilo y manejador.
   * Restricciones: la opción debe contener texto e icono válidos.
   * Objetivo: representar una opción del menú lateral.
   */
  function renderizarOpcion({ texto, icono: Icono }, indice) {
    return (
      <Button
        className={`boton-opcion color-boton-${indice + 1}`}
        key={texto}
        onClick={() => manejarOpcion(indice)}
        startIcon={<Icono />}
        type="button"
      >
        {texto}
      </Button>
    )
  }

  /**
   * Entradas: ninguna.
   * Salidas: cambia la vista activa al detalle de personas.
   * Restricciones: ninguna.
   * Objetivo: abrir la lista de personas desde la tarjeta del resumen.
   */
  function mostrarPersonas() {
    setTipoResultado('personas')
  }

  /**
   * Entradas: ninguna.
   * Salidas: abre el resultado de lugares y actualiza sus datos, carga o error.
   * Restricciones: requiere que el backend exponga la consulta de lugares en Prolog.
   * Objetivo: cargar los lugares y sus personas con acceso al seleccionar Ver detalles.
   */
  function mostrarLugares() {
    setTipoResultado('lugares')
  }

  /**
   * Entradas: ninguna.
   * Salidas: oculta la capa de resultado y restaura el panel de datos.
   * Restricciones: ninguna.
   * Objetivo: regresar desde un resultado al panel de datos del caso.
   */
  function volverAlPanelDatos() {
    setTipoResultado(null)
  }

  return (
    <Box component="main" className="menu-principal">
      <Box className="cabecera-menu">
        <Box className="marca-menu">
          <Box
            component="img"
            className="imagen-detective-menu"
            src={detectiveImg}
            alt=""
            aria-hidden="true"
          />
          <Typography className="titulo-menu" component="h1" variant="h4">
            Menú de investigación
          </Typography>
        </Box>
        <Button
          className="boton-salir"
          onClick={onSalir}
          startIcon={<LogoutOutlined />}
          type="button"
        >
          Salir
        </Button>
      </Box>

      <Box className="cuerpo-menu-principal">
        <Box component="nav" className="menu-opciones-lateral" aria-label="Opciones de investigación">
          <Box className="lista-opciones">
            {opcionesMenu.map(renderizarOpcion)}
          </Box>
        </Box>

        <Box component="section" className="panel-caso" aria-labelledby="titulo-caso">
          <Box className="panel-datos-base">
            <PanelDatos
              datosCaso={datosCaso}
              cantidadPersonas={datosPersonas?.cantidad}
              cantidadLugares={cantidadLugares}
              cantidadObjetos={cantidadObjetos}
              cantidadEvidencias={cantidadEvidencias}
              onVerPersonas={mostrarPersonas}
              onVerLugares={mostrarLugares}
              onVerObjetos={() => setTipoResultado('objetos')}
              onVerEvidencias={() => setTipoResultado('evidencias')}
            />
          </Box>
          <AnimatePresence>
            {tipoResultado && (
              <motion.div
                className="panel-animado"
                key="resultado"
                initial={{ y: '-100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-100%' }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <Box className="contenido-caso vista-resultado">
                  <Box className="cabecera-resultado">
                    <Button
                      className="boton-volver-resultado"
                      onClick={volverAlPanelDatos}
                      startIcon={<ArrowBackOutlined />}
                      type="button"
                    >
                      Volver
                    </Button>
                    <Typography component="h2" variant="h3" className="titulo-resultado">
                      {tipoResultado === 'personas'
                        ? 'Personas del caso'
                        : tipoResultado === 'lugares'
                          ? 'Lugares y accesos'
                          : tipoResultado === 'objetos'
                            ? 'Objetos'
                            : tipoResultado === 'evidencias'
                              ? 'Evidencias'
                          : 'Información del caso'}
                    </Typography>
                    <Box className="marco-detective-resultado">
                      <Box
                        component="img"
                        className="imagen-detective-resultado"
                        src={detectiveResultadoImg}
                        alt="Detective"
                      />
                    </Box>
                  </Box>
                  {tipoResultado === 'personas' ? (
                    <ResultadoPersonas
                      cantidad={datosPersonas.cantidad}
                      personas={datosPersonas.personas}
                      cargando={cargandoPersonas}
                      error={errorPersonas}
                    />
                  ) : tipoResultado === 'lugares' ? (
                    <ResultadoLugares
                      lugares={lugares}
                      cargandoLugares={cargandoLugares}
                      cargandoPersonas={cargandoPersonas}
                      errorLugares={errorLugares}
                      errorPersonas={errorPersonas}
                    />
                  ) : tipoResultado === 'objetos' ? (
                    <ResultadoObjetos
                      cantidad={cantidadObjetos}
                      objetos={objetos}
                      cargando={cargandoObjetos}
                      error={errorObjetos}
                    />
                  ) : tipoResultado === 'evidencias' ? (
                    <ResultadoEvidencias
                      cantidad={cantidadEvidencias}
                      evidencias={evidencias}
                      cargando={cargandoEvidencias}
                      error={errorEvidencias}
                    />
                  ) : (
                    <ResultadoConsulta
                      texto={textoResultado}
                      cargando={cargandoResultado}
                      error={errorResultado}
                    />
                  )}
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  )
}

export default MenuPrincipal
