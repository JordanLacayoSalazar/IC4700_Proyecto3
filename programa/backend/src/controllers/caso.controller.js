import {
  obtenerInformacionCaso,
  obtenerPersonasCaso,
} from '../services/caso.services.js'

/**
 * Entradas: solicitud HTTP sin parámetros y respuesta de Express.
 * Salidas: JSON con propiedad "texto" con la información del caso, o estado HTTP 500 con un error.
 * Restricciones: requiere que SWI-Prolog esté instalado y que sus archivos puedan ejecutarse.
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
 * Salidas: JSON con propiedades "cantidad" y "personas", o estado HTTP 500 si falla la consulta.
 * Restricciones: requiere que SWI-Prolog esté instalado y que sus archivos puedan ejecutarse.
 * Objetivo: atender GET /api/caso/personas y exponer los datos de personas al frontend.
 */
export async function consultarPersonasCaso(_req, res) {
  try {
    const resultado = await obtenerPersonasCaso()
    return res.json(resultado)
  } catch (error) {
    console.error('Error al consultar las personas del caso:', error)
    return res.status(500).json({
      error: 'No se pudo consultar la lista de personas en Prolog.',
    })
  }
}
