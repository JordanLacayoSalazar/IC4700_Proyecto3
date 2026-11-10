import { useEffect, useState } from 'react'
import {
  AccessTimeOutlined,
  ArrowBackOutlined,
  ExpandMoreOutlined,
  GroupsOutlined,
  InfoOutlined,
  LightbulbOutlined,
  LogoutOutlined,
  PersonSearchOutlined,
  GavelOutlined,
  HistoryToggleOffOutlined,
  PlaceOutlined,
  VpnKeyOutlined,
} from '@mui/icons-material'
import { Autocomplete, Box, Button, TextField, Typography } from '@mui/material'
import { AnimatePresence, motion } from 'motion/react'
import detectiveImg from '../assets/detective-1.png'
import detectiveResultadoImg from '../assets/detective-2.png'
import {
  consultarInformacionCaso,
  consultarEventoCaso,
  consultarExplicacionesCaso,
  investigarPersonaCaso,
  consultarMovimientoPorHoraCaso,
  consultarMovimientosPorIntervaloCaso,
  consultarEvidenciasCaso,
  consultarLugaresCaso,
  consultarMovimientosCaso,
  consultarObjetosCaso,
  consultarPosiblesResponsablesCaso,
  consultarTestimoniosCaso,
  resolverCaso,
} from '../api/investigacion.api.js'
import { consultarPersonasCaso } from '../api/personas.api.js'
import ResumenHechos from './resumenHechos.jsx'
import PanelTexto from '../components/panelTexto.jsx'
import PanelRegistros from '../components/panelRegistros.jsx'
import ModalBase from '../components/ModalBase.jsx'
import TarjetaRegistroPersona from '../components/tarjetaRegistroPersona.jsx'
import TarjetaPersona from '../components/tarjetaPersona.jsx'
import '../components/components.css'
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

const titulosResultado = {
  personas: 'Personas del caso',
  lugares: 'Lugares y accesos',
  objetos: 'Objetos',
  evidencias: 'Evidencias',
  movimientos: 'Movimientos',
  testimonios: 'Testimonios',
  informacion: 'Información del caso',
  responsables: 'Posibles responsables',
  explicaciones: 'Explicaciones',
  investigacion: 'Investigar a una persona',
  movimientoHora: 'Consultar movimiento por hora',
  movimientosIntervalo: 'Consultar movimientos por intervalo',
  resolucion: 'Resolver el caso',
}

const configuracionesModal = {
  explicaciones: {
    titulo: 'Ingrese la persona para obtener su explicación',
    boton: 'Generar',
    resultado: 'explicaciones',
  },
  investigar: {
    titulo: 'Ingrese la persona que desea investigar',
    boton: 'Investigar',
    resultado: 'investigacion',
  },
  movimientoHora: {
    titulo: 'Consulte el movimiento de una persona por hora',
    boton: 'Consultar',
    resultado: 'movimientoHora',
  },
  movimientosIntervalo: {
    titulo: 'Consulte los movimientos por intervalo',
    boton: 'Consultar',
    resultado: 'movimientosIntervalo',
  },
}

/**
 * Entradas: función de consulta, callback de actualización, callback de error, callback de carga y mensaje de error.
 * Salidas: función para iniciar la carga de datos al montarse el menu principal y limpiar la carga al desmontarse.
 * Restricciones: ninguna.
 * Objetivo: cargar los datos de personas, objetos, lugares, evidencias, testimonios y movimientos una unica vez.
 */
function iniciarCarga(consultar, actualizar, setError, setCargando, mensajeError) {
  let estaMontado = true

  async function cargar() {
    try {
      const resultado = await consultar()
      if (estaMontado) actualizar(resultado)
    } catch (error) {
      if (estaMontado) {
        setError(error instanceof Error ? error.message : mensajeError)
      }
    } finally {
      if (estaMontado) setCargando(false)
    }
  }

  cargar()

  return function limpiarCarga() {
    estaMontado = false
  }
}

/**
 * Entradas: función onSalir del componente padre.
 * Salidas: JSX del menú principal y panel de resultados.
 * Restricciones: la consulta de personas se realiza al montar el menú.
 * Objetivo: coordinar las consultas de la pantalla principal y presentar sus resultados.
 */
function MenuPrincipal({ onSalir }) {
  const [tipoResultado, setTipoResultado] = useState(null)
  const [textoResultado, setTextoResultado] = useState('')
  const [cargandoResultado, setCargandoResultado] = useState(false)
  const [errorResultado, setErrorResultado] = useState('')
  const [tipoModal, setTipoModal] = useState(null)
  const [personaConsulta, setPersonaConsulta] = useState('')
  const [lugarConsulta, setLugarConsulta] = useState('')
  const [horaConsulta, setHoraConsulta] = useState('')
  const [horaInicioConsulta, setHoraInicioConsulta] = useState('')
  const [horaFinConsulta, setHoraFinConsulta] = useState('')
  const [eventoCentral, setEventoCentral] = useState('')
  const [cargandoEvento, setCargandoEvento] = useState(true)
  const [errorEvento, setErrorEvento] = useState('')
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
  const [movimientos, setMovimientos] = useState([])
  const [cantidadMovimientos, setCantidadMovimientos] = useState(null)
  const [cargandoMovimientos, setCargandoMovimientos] = useState(true)
  const [errorMovimientos, setErrorMovimientos] = useState('')
  const [testimonios, setTestimonios] = useState([])
  const [cantidadTestimonios, setCantidadTestimonios] = useState(null)
  const [cargandoTestimonios, setCargandoTestimonios] = useState(true)
  const [errorTestimonios, setErrorTestimonios] = useState('')

  useEffect(
    () =>
      iniciarCarga(
        consultarPersonasCaso,
        setDatosPersonas,
        setErrorPersonas,
        setCargandoPersonas,
        'Ocurrió un error al consultar las personas.',
      ),
    [],
  )

  useEffect(
    () =>
      iniciarCarga(
        consultarEventoCaso,
        setEventoCentral,
        setErrorEvento,
        setCargandoEvento,
        'Ocurrió un error al consultar el evento central.',
      ),
    [],
  )

  useEffect(
    () =>
      iniciarCarga(
        consultarMovimientosCaso,
        (resultado) => {
          setCantidadMovimientos(resultado.cantidad)
          setMovimientos(resultado.registros)
        },
        setErrorMovimientos,
        setCargandoMovimientos,
        'Ocurrió un error al consultar los movimientos.',
      ),
    [],
  )

  useEffect(
    () =>
      iniciarCarga(
        consultarTestimoniosCaso,
        (resultado) => {
          setCantidadTestimonios(resultado.cantidad)
          setTestimonios(resultado.registros)
        },
        setErrorTestimonios,
        setCargandoTestimonios,
        'Ocurrió un error al consultar los testimonios.',
      ),
    [],
  )

  useEffect(
    () =>
      iniciarCarga(
        consultarLugaresCaso,
        (resultado) => {
          setCantidadLugares(resultado.cantidad)
          setLugares(resultado.lugares)
        },
        setErrorLugares,
        setCargandoLugares,
        'Ocurrió un error al consultar los lugares.',
      ),
    [],
  )

  useEffect(
    () =>
      iniciarCarga(
        consultarObjetosCaso,
        (resultado) => {
          setCantidadObjetos(resultado.cantidad)
          setObjetos(resultado.objetos)
        },
        setErrorObjetos,
        setCargandoObjetos,
        'Ocurrió un error al consultar los objetos.',
      ),
    [],
  )

  useEffect(
    () =>
      iniciarCarga(
        consultarEvidenciasCaso,
        (resultado) => {
          setCantidadEvidencias(resultado.cantidad)
          setEvidencias(resultado.evidencias)
        },
        setErrorEvidencias,
        setCargandoEvidencias,
        'Ocurrió un error al consultar las evidencias.',
      ),
    [],
  )

  /**
   * Entradas: índice de la opción seleccionada en opcionesMenu.
   * Salidas: abre una vista y actualiza los estados de carga, texto o error de la consulta.
   * Restricciones: solo se ejecutan las opciones implementadas en consultasPorOpcion.
   * Objetivo: ejecutar la consulta seleccionada en el menú lateral.
   */
  async function manejarOpcion(indice) {
    const tipoModalPorOpcion = {
      1: 'investigar',
      3: 'explicaciones',
      5: 'movimientoHora',
      6: 'movimientosIntervalo',
    }

    if (tipoModalPorOpcion[indice]) {
      setPersonaConsulta('')
      setLugarConsulta('')
      setHoraConsulta('')
      setHoraInicioConsulta('')
      setHoraFinConsulta('')
      setTipoModal(tipoModalPorOpcion[indice])
      return
    }

    const consultasPorOpcion = {
      0: { tipo: 'informacion', consultar: consultarInformacionCaso },
      2: { tipo: 'responsables', consultar: consultarPosiblesResponsablesCaso },
      4: { tipo: 'resolucion', consultar: resolverCaso },
    }
    const consulta = consultasPorOpcion[indice]
    if (!consulta) return

    setTipoResultado(consulta.tipo)
    setCargandoResultado(true)
    setTextoResultado('')
    setErrorResultado('')

    try {
      const texto = await consulta.consultar()
      setTextoResultado(texto)
    } catch (error) {
      setErrorResultado(
        error instanceof Error ? error.message : 'Ocurrió un error al consultar Prolog.',
      )
    } finally {
      setCargandoResultado(false)
    }
  }

  function renderizarAutocompletado(label, value, setValue, options) {
    return (
      <Autocomplete
        disablePortal
        freeSolo
        options={options}
        inputValue={value}
        onInputChange={(_event, valor) => setValue(valor)}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
    )
  }

  async function ejecutarConsultaModal() {
    const configuracion = configuracionesModal[tipoModal]
    setTipoModal(null)
    setTipoResultado(configuracion.resultado)
    setCargandoResultado(true)
    setTextoResultado('')
    setErrorResultado('')

    try {
      const consultas = {
        explicaciones: () => consultarExplicacionesCaso(personaConsulta),
        investigar: () => investigarPersonaCaso(personaConsulta),
        movimientoHora: () =>
          consultarMovimientoPorHoraCaso(
            personaConsulta,
            lugarConsulta,
            horaConsulta === '' ? '' : Number(horaConsulta),
          ),
        movimientosIntervalo: () =>
          consultarMovimientosPorIntervaloCaso(
            personaConsulta,
            lugarConsulta,
            horaInicioConsulta === '' ? '' : Number(horaInicioConsulta),
            horaFinConsulta === '' ? '' : Number(horaFinConsulta),
          ),
      }
      const texto = await consultas[tipoModal]()
      setTextoResultado(texto)
    } catch (error) {
      setErrorResultado(
        error instanceof Error ? error.message : 'Ocurrió un error al consultar Prolog.',
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

  function mostrarRegistros(tipo) {
    setTipoResultado(tipo)
  }

  /**
   * Entradas: ninguna.
   * Salidas: oculta la capa de resultado y restaura el panel de datos.
   * Restricciones: ninguna.
   * Objetivo: regresar desde un resultado al panel de datos del caso.
   */
  function volverAlResumenHechos() {
    setTipoResultado(null)
  }


  // --------- Renderizado de paneles de los 6 botones del submenú de datos ---------

  /**
   * Entradas: objeto de un lugar con nombre, descripción y personas.
   * Salidas: tarjeta JSX con información del lugar.
   * Restricciones: ninguna.
   * Objetivo: enviarla como callback a PanelRegistros para renderizar cada lugar del caso.
   */
  function renderizarLugar({ nombre, descripcion, personas }) {
    return (
      <Box component="article" className="tarjeta-lugar" key={nombre}>
        <Typography component="h3" className="nombre-lugar">
          {nombre}
        </Typography>
        <Typography className="descripcion-lugar">{descripcion}</Typography>
        <details className="detalles-accesos-lugar">
          <summary>
            <span>Ver personas con acceso</span>
            <ExpandMoreOutlined aria-hidden="true" />
          </summary>
          {personas.length === 0 ? (
            <Typography className="mensaje-accesos-lugar">
              No hay personas con acceso registrado.
            </Typography>
          ) : (
            <Box className="lista-accesos-lugar">
              {personas.map(({ nombre: nombrePersona, imagen }) => (
                <TarjetaPersona
                  key={nombrePersona}
                  nombre={nombrePersona}
                  imagen={imagen}
                  className="persona-con-acceso"
                />
              ))}
            </Box>
          )}
        </details>
      </Box>
    )
  }

  /**
   * Entradas: lista de lugares.
   * Salidas: cadena con los nombres de los lugares separados por comas.
   * Restricciones: ninguna.
   * Objetivo: formatear la lista de lugares para su visualización.
   */
  function formatearLugaresObjeto(lugares) {
    return lugares.join(', ') || 'No registrado'
  }

  /**
   * Entradas: objeto de un objeto del caso con nombre, lugares a los que permite acceder y lugares donde se encontraba.
   * Salidas: tarjeta JSX con información del objeto.
   * Restricciones: ninguna.
   * Objetivo: enviarla como callback a PanelRegistros para renderizar cada objeto del caso.
   */
  function renderizarObjeto({ nombre, permiteAccederA, seEncontrabaEn }) {
    return (
      <Box component="article" className="tarjeta-lugar tarjeta-objeto" key={nombre}>
        <Typography component="h3" className="nombre-lugar">
          {nombre}
        </Typography>
        <Box className="detalles-objeto">
          <Box className="dato-objeto">
            <Typography component="h4">
              <VpnKeyOutlined aria-hidden="true" />
              Permite acceder a:
            </Typography>
            <Typography>{formatearLugaresObjeto(permiteAccederA)}</Typography>
          </Box>
          <Box className="dato-objeto">
            <Typography component="h4">
              <PlaceOutlined aria-hidden="true" />
              Se encontraba en:
            </Typography>
            <Typography>{formatearLugaresObjeto(seEncontrabaEn)}</Typography>
          </Box>
        </Box>
      </Box>
    )
  }

  /**
   * Entradas: objeto de evidencia con nombre, lugar, hora y lista de personas relacionadas con la evidencia.
   * Salidas: tarjeta JSX con información de la evidencia.
   * Restricciones: ninguna.
   * Objetivo: enviarla como callback a PanelRegistros para renderizar cada evidencia del caso.
   */
  function renderizarEvidencia({ nombre, lugar, hora, personas }) {
    return (
      <Box component="article" className="tarjeta-lugar tarjeta-evidencia" key={nombre}>
        <Typography component="h3" className="nombre-lugar">
          {nombre}
        </Typography>
        <Typography className="descripcion-evidencia">
          Encontrada en {lugar} a las {hora}
        </Typography>
        <Box className="subcuadro-evidencia">
          <Typography component="h4">Corresponde a:</Typography>
          {personas.length === 0 ? (
            <Typography>No hay una persona relacionada.</Typography>
          ) : (
            <Box className="lista-accesos-lugar">
              {personas.map(({ nombre: nombrePersona, imagen }) => (
                <TarjetaPersona
                  key={nombrePersona}
                  nombre={nombrePersona}
                  imagen={imagen}
                  className="persona-con-acceso"
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    )
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
            <ResumenHechos
              eventoCentral={eventoCentral}
              cargandoEvento={cargandoEvento}
              errorEvento={errorEvento}
              cantidadPersonas={datosPersonas?.cantidad}
              cantidadLugares={cantidadLugares}
              cantidadObjetos={cantidadObjetos}
              cantidadEvidencias={cantidadEvidencias}
              cantidadMovimientos={cantidadMovimientos}
              cantidadTestimonios={cantidadTestimonios}
              cargandoPersonas={cargandoPersonas}
              cargandoLugares={cargandoLugares}
              cargandoObjetos={cargandoObjetos}
              cargandoEvidencias={cargandoEvidencias}
              cargandoMovimientos={cargandoMovimientos}
              cargandoTestimonios={cargandoTestimonios}
              onVerPersonas={mostrarPersonas}
              onVerLugares={mostrarLugares}
              onVerObjetos={() => setTipoResultado('objetos')}
              onVerEvidencias={() => setTipoResultado('evidencias')}
              onVerMovimientos={() => mostrarRegistros('movimientos')}
              onVerTestimonios={() => mostrarRegistros('testimonios')}
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
                      onClick={volverAlResumenHechos}
                      startIcon={<ArrowBackOutlined />}
                      type="button"
                    >
                      Volver
                    </Button>
                    <Typography component="h2" variant="h3" className="titulo-resultado">
                      {titulosResultado[tipoResultado]}
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
                    <PanelRegistros
                      registros={datosPersonas?.personas ?? []}
                      cantidad={datosPersonas?.cantidad}
                      cargando={cargandoPersonas}
                      error={errorPersonas}
                      mensajeCarga="Consultando personas..."
                      mensajeVacio="No hay personas registradas en el caso."
                      classNameLista="lista-personas"
                      renderizarRegistro={({ nombre, imagen }) => (
                        <TarjetaPersona key={nombre} nombre={nombre} imagen={imagen} />
                      )}
                    />
                  ) : tipoResultado === 'lugares' ? (
                    <PanelRegistros
                      registros={lugares}
                      cantidad={cantidadLugares}
                      cargando={cargandoLugares || cargandoPersonas}
                      error={errorLugares || errorPersonas}
                      mensajeCarga="Consultando lugares y personas..."
                      mensajeVacio="No hay lugares registrados en el caso."
                      classNameLista="lista-lugares"
                      renderizarRegistro={renderizarLugar}
                    />
                  ) : tipoResultado === 'objetos' ? (
                    <PanelRegistros
                      registros={objetos}
                      cantidad={cantidadObjetos}
                      cargando={cargandoObjetos}
                      error={errorObjetos}
                      mensajeCarga="Consultando objetos..."
                      mensajeVacio="No hay objetos registrados en el caso."
                      classNameLista="lista-lugares"
                      renderizarRegistro={renderizarObjeto}
                    />
                  ) : tipoResultado === 'evidencias' ? (
                    <PanelRegistros
                      registros={evidencias}
                      cantidad={cantidadEvidencias}
                      cargando={cargandoEvidencias}
                      error={errorEvidencias}
                      mensajeCarga="Consultando evidencias..."
                      mensajeVacio="No hay evidencias registradas en el caso."
                      classNameLista="lista-lugares"
                      renderizarRegistro={renderizarEvidencia}
                    />
                  ) : tipoResultado === 'movimientos' || tipoResultado === 'testimonios' ? (
                    <PanelRegistros
                      registros={tipoResultado === 'movimientos' ? movimientos : testimonios}
                      cantidad={
                        tipoResultado === 'movimientos'
                          ? cantidadMovimientos
                          : cantidadTestimonios
                      }
                      cargando={
                        tipoResultado === 'movimientos'
                          ? cargandoMovimientos
                          : cargandoTestimonios
                      }
                      error={
                        tipoResultado === 'movimientos' ? errorMovimientos : errorTestimonios
                      }
                      mensajeCarga={`Consultando ${tipoResultado}...`}
                      mensajeVacio={`No hay ${tipoResultado} registrados en el caso.`}
                      classNameLista="lista-registros-persona"
                      renderizarRegistro={({ nombre, imagen, texto }, indice) => (
                        <TarjetaRegistroPersona
                          key={`${nombre}-${indice}`}
                          nombre={nombre}
                          imagen={imagen}
                          texto={texto}
                        />
                      )}
                    />
                  ) : (
                    <>
                      <PanelTexto
                        texto={textoResultado}
                        cargando={cargandoResultado}
                        error={errorResultado}
                      />
                    </>
                  )}
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>
      <ModalBase
        abierto={Boolean(tipoModal)}
        titulo={tipoModal ? configuracionesModal[tipoModal].titulo : ''}
        textoBotonAfirmativo={tipoModal ? configuracionesModal[tipoModal].boton : ''}
        onCancelar={() => setTipoModal(null)}
        onAceptar={ejecutarConsultaModal}
      >
        {renderizarAutocompletado(
          'Persona',
          personaConsulta,
          setPersonaConsulta,
          datosPersonas?.personas.map(({ nombre }) => nombre) ?? [],
        )}
        {['movimientoHora', 'movimientosIntervalo'].includes(tipoModal) && (
          <>
            {renderizarAutocompletado(
              'Lugar',
              lugarConsulta,
              setLugarConsulta,
              lugares.map(({ nombre }) => nombre),
            )}
            {tipoModal === 'movimientoHora' ? (
              <TextField
                label="Hora (HHMM)"
                type="number"
                value={horaConsulta}
                onChange={(event) => setHoraConsulta(event.target.value)}
              />
            ) : (
              <>
                <TextField
                  label="Hora inicial (HHMM)"
                  type="number"
                  value={horaInicioConsulta}
                  onChange={(event) => setHoraInicioConsulta(event.target.value)}
                />
                <TextField
                  label="Hora final (HHMM)"
                  type="number"
                  value={horaFinConsulta}
                  onChange={(event) => setHoraFinConsulta(event.target.value)}
                />
              </>
            )}
          </>
        )}
      </ModalBase>
    </Box>
  )
}

export default MenuPrincipal
