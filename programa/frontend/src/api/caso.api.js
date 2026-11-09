const URL_API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

/**
 * Entradas: ninguna.
 * Salidas: texto de la información del caso obtenido desde la API.
 * Restricciones: requiere que el endpoint responda en formato JSON con una propiedad llamada 'texto'.
 * Objetivo: consultar GET /caso/informacion y entregar su resultado al frontend.
 */
export async function consultarInformacionCaso() {
  const respuesta = await fetch(`${URL_API}/caso/informacion`)
  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(resultado.error || 'No se pudo consultar la información del caso.')
  }

  if (typeof resultado.texto !== 'string') {
    throw new Error('El servidor no devolvió información válida del caso.')
  }

  return resultado.texto
}

/**
 * Entradas: ninguna.
 * Salidas: objeto JSON con propiedades cantidad (entero) y personas (arreglo de cadenas).
 * Restricciones: la cantidad debe ser un entero no negativo y cada persona debe ser una cadena,
 *                y toda la respuesta debe ser en formato JSON.
 * Objetivo: consultar GET /caso/personas para mostrar las personas registradas en el caso.
 */
export async function consultarPersonasCaso() {
  const respuesta = await fetch(`${URL_API}/caso/personas`)
  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(resultado.error || 'No se pudo consultar la lista de personas.')
  }

  if (
    !Number.isInteger(resultado.cantidad) || resultado.cantidad < 0 ||
    !Array.isArray(resultado.personas) || !resultado.personas.every((persona) => typeof persona === 'string')
  ) {
    throw new Error('El servidor no devolvió una lista de personas válida.')
  }

  return resultado
}
