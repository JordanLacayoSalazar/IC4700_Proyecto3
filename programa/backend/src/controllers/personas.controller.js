import { obtenerPersonasCaso } from '../services/personas.services.js'

/**
 * Entradas: solicitud HTTP sin parámetros y respuesta de Express.
 * Salidas: JSON con la cantidad y lista de personas, o estado HTTP 500 si falla la consulta.
 * Restricciones: requiere que SWI-Prolog esté instalado y que ejecute interfaz_consultar_personas correctamente.
 * Objetivo: atender GET /api/caso/personas y exponer los datos consultados por el servicio.
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
