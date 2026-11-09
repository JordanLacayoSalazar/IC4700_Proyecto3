const URL_API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

/**
 * Entradas: ninguna.
 * Salidas: texto de la información del caso obtenido desde la API.
 * Restricciones: el endpoint debe responder en formato JSON. investigacion.services.js valida la salida de Prolog.
 * Objetivo: consultar GET api/caso/informacion y entregar su resultado al frontend.
 */
export async function consultarInformacionCaso() {
  const respuesta = await fetch(`${URL_API}/caso/informacion`)
  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(resultado.error || 'No se pudo consultar la información del caso.')
  }

  return resultado.texto
}

/**
 * Entradas: ninguna.
 * Salidas: objeto con la cantidad de lugares y el arreglo de lugares con nombre, descripción y personas con acceso.
 * Restricciones: el endpoint debe responder en formato JSON. investigacion.services.js valida la salida de Prolog.
 * Objetivo: consultar GET api/caso/lugares para presentar los lugares y sus accesos.
 */
export async function consultarLugaresCaso() {
  const respuesta = await fetch(`${URL_API}/caso/lugares`)
  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(resultado.error || 'No se pudo consultar los lugares del caso.')
  }

  return resultado
}

/**
 * Entradas: ninguna.
 * Salidas: objeto con la cantidad de objetos y sus accesos condicionados y ubicaciones.
 * Restricciones: requiere una respuesta JSON del endpoint de objetos.
 * Objetivo: consultar GET api/caso/objetos para presentar objetos y relaciones.
 */
export async function consultarObjetosCaso() {
  const respuesta = await fetch(`${URL_API}/caso/objetos`)
  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(resultado.error || 'No se pudo consultar los objetos del caso.')
  }

  return resultado
}

/**
 * Entradas: ninguna.
 * Salidas: objeto con cantidad de evidencias y su ubicación y personas relacionadas.
 * Restricciones: requiere una respuesta JSON del endpoint de evidencias.
 * Objetivo: consultar GET api/caso/evidencias para presentar las evidencias y correspondencias.
 */
export async function consultarEvidenciasCaso() {
  const respuesta = await fetch(`${URL_API}/caso/evidencias`)
  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(resultado.error || 'No se pudo consultar las evidencias del caso.')
  }

  return resultado
}
