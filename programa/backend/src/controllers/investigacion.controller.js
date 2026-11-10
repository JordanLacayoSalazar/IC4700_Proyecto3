import {
  obtenerEventoCaso,
  obtenerExplicacionesCaso,
  obtenerInformacionCaso,
  investigarPersonaCaso,
  consultarMovimientoPorHora,
  consultarMovimientosPorIntervalo,
  obtenerPosiblesResponsablesCaso,
  obtenerResolucionCaso,
  obtenerEvidenciasCaso,
  obtenerLugaresCaso,
  obtenerMovimientosCaso,
  obtenerObjetosCaso,
  obtenerTestimoniosCaso,
} from '../services/investigacion.services.js'

export async function consultarEventoCaso(_req, res) {
  try {
    const evento = await obtenerEventoCaso()
    return res.json({ evento })
  } catch (error) {
    console.error('Error al consultar el evento central:', error)
    return res.status(500).json({ error: 'No se pudo consultar el evento central en Prolog.' })
  }
}

export async function consultarPosiblesResponsablesCaso(_req, res) {
  try {
    const texto = await obtenerPosiblesResponsablesCaso()
    return res.json({ texto })
  } catch (error) {
    console.error('Error al consultar posibles responsables:', error)
    return res.status(500).json({ error: 'No se pudieron consultar posibles responsables en Prolog.' })
  }
}

export async function consultarExplicacionesCaso(req, res) {
  const { persona } = req.body ?? {}
  try {
    const texto = await obtenerExplicacionesCaso(persona)
    return res.json({ texto })
  } catch (error) {
    console.error('Error al generar explicaciones:', error)
    return res.status(500).json({ error: 'No se pudieron generar explicaciones en Prolog.' })
  }
}

export async function investigarPersona(req, res) {
  const { persona } = req.body ?? {}
  try {
    const texto = await investigarPersonaCaso(persona)
    return res.json({ texto })
  } catch (error) {
    console.error('Error al investigar a una persona:', error)
    return res.status(500).json({ error: 'No se pudo investigar a la persona en Prolog.' })
  }
}

export async function consultarMovimientoPuntual(req, res) {
  const { persona, lugar, hora } = req.body ?? {}
  try {
    const texto = await consultarMovimientoPorHora(persona, lugar, hora)
    return res.json({ texto })
  } catch (error) {
    console.error('Error al consultar el movimiento por hora:', error)
    return res.status(500).json({ error: 'No se pudo consultar el movimiento en Prolog.' })
  }
}

export async function consultarIntervaloMovimientos(req, res) {
  const { persona, lugar, inicio, fin } = req.body ?? {}
  try {
    const texto = await consultarMovimientosPorIntervalo(persona, lugar, inicio, fin)
    return res.json({ texto })
  } catch (error) {
    console.error('Error al consultar movimientos por intervalo:', error)
    return res.status(500).json({ error: 'No se pudieron consultar los movimientos en Prolog.' })
  }
}

export async function resolverCaso(_req, res) {
  try {
    const texto = await obtenerResolucionCaso()
    return res.json({ texto })
  } catch (error) {
    console.error('Error al resolver el caso:', error)
    return res.status(500).json({ error: 'No se pudo resolver el caso en Prolog.' })
  }
}

/**
 * Entradas: solicitud HTTP sin parámetros y respuesta de Express.
 * Salidas: JSON con propiedad "texto" con la información del caso, o estado HTTP 500 con un error.
 * Restricciones: requiere que SWI-Prolog esté instalado y que ejecute opcion_consultar_caso correctamente.
 * Objetivo: atender GET /api/caso/informacion y traducir el resultado del servicio a HTTP.
 */
export async function consultarInformacionCaso(_req, res) {
  try {
    const texto = await obtenerInformacionCaso()
    return res.json({ texto })
  } catch (error) {
    console.error('Error al consultar la información del caso:', error)
    return res.status(500).json({
      error: 'No se pudo consultar la información del caso en Prolog.',
    })
  }
}

/**
 * Entradas: solicitud HTTP sin parámetros y respuesta de Express.
 * Salidas: JSON con cantidad de lugares, descripciones y personas con acceso, o estado HTTP 500 ante un error.
 * Restricciones: requiere que SWI-Prolog esté instalado y que ejecute interfaz_consultar_lugares correctamente.
 * Objetivo: atender GET /api/caso/lugares y exponer los lugares y sus accesos al frontend.
 */
export async function consultarLugaresCaso(_req, res) {
  try {
    const resultado = await obtenerLugaresCaso()
    return res.json(resultado)
  } catch (error) {
    console.error('Error al consultar los lugares del caso:', error)
    return res.status(500).json({
      error: 'No se pudo consultar los lugares y sus accesos en Prolog.',
    })
  }
}

/**
 * Entradas: solicitud HTTP sin parámetros y respuesta de Express.
 * Salidas: JSON con la cantidad de objetos y sus accesos y ubicaciones, o estado HTTP 500 ante un error.
 * Restricciones: requiere que SWI-Prolog ejecute interfaz_consultar_objetos correctamente.
 * Objetivo: atender GET /api/caso/objetos y exponer los objetos del caso.
 */
export async function consultarObjetosCaso(_req, res) {
  try {
    const resultado = await obtenerObjetosCaso()
    return res.json(resultado)
  } catch (error) {
    console.error('Error al consultar los objetos del caso:', error)
    return res.status(500).json({
      error: 'No se pudo consultar los objetos y sus relaciones en Prolog.',
    })
  }
}

/**
 * Entradas: solicitud HTTP sin parámetros y respuesta de Express.
 * Salidas: JSON con la cantidad de evidencias y sus personas relacionadas, o estado HTTP 500 ante un error.
 * Restricciones: requiere que SWI-Prolog ejecute interfaz_consultar_evidencias correctamente.
 * Objetivo: atender GET /api/caso/evidencias y exponer las evidencias del caso.
 */
export async function consultarEvidenciasCaso(_req, res) {
  try {
    const resultado = await obtenerEvidenciasCaso()
    return res.json(resultado)
  } catch (error) {
    console.error('Error al consultar las evidencias del caso:', error)
    return res.status(500).json({
      error: 'No se pudo consultar las evidencias y sus correspondencias en Prolog.',
    })
  }
}

/**
 * Entradas: solicitud HTTP sin parámetros y respuesta de Express.
 * Salidas: JSON con cantidad y movimientos individuales, o estado HTTP 500 ante un error.
 * Restricciones: requiere que SWI-Prolog ejecute interfaz_consultar_movimientos correctamente.
 * Objetivo: atender GET /api/caso/movimientos y exponer cada movimiento del caso.
 */
export async function consultarMovimientosCaso(_req, res) {
  try {
    const resultado = await obtenerMovimientosCaso()
    return res.json(resultado)
  } catch (error) {
    console.error('Error al consultar los movimientos del caso:', error)
    return res.status(500).json({
      error: 'No se pudieron consultar los movimientos en Prolog.',
    })
  }
}

/**
 * Entradas: solicitud HTTP sin parámetros y respuesta de Express.
 * Salidas: JSON con cantidad y testimonios individuales, o estado HTTP 500 ante un error.
 * Restricciones: requiere que SWI-Prolog ejecute interfaz_consultar_testimonios correctamente.
 * Objetivo: atender GET /api/caso/testimonios y exponer cada testimonio del caso.
 */
export async function consultarTestimoniosCaso(_req, res) {
  try {
    const resultado = await obtenerTestimoniosCaso()
    return res.json(resultado)
  } catch (error) {
    console.error('Error al consultar los testimonios del caso:', error)
    return res.status(500).json({
      error: 'No se pudieron consultar los testimonios en Prolog.',
    })
  }
}
