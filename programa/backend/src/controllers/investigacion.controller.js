import {
  obtenerInformacionCaso,
  obtenerEvidenciasCaso,
  obtenerLugaresCaso,
  obtenerObjetosCaso,
} from '../services/investigacion.services.js'

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
