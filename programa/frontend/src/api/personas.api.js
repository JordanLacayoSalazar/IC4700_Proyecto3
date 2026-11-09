const URL_API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

/**
 * Entradas: ninguna.
 * Salidas: objeto con la cantidad de personas y su lista de nombres e imágenes.
 * Restricciones: requiere que el endpoint responda en formato JSON; el servicio valida la salida de Prolog.
 * Objetivo: consultar GET api/caso/personas para mostrar las personas registradas en el caso.
 */
export async function consultarPersonasCaso() {
  const respuesta = await fetch(`${URL_API}/caso/personas`)
  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(resultado.error || 'No se pudo consultar la lista de personas.')
  }

  return resultado
}
