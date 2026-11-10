import { IMAGENES_PERSONAS } from '../constants.js'
import { obtenerRespuestaProlog } from './prolog.services.js'

/**
 * Entradas: un texto que representa un átomo de Prolog.
 * Salidas: verdadero si representa un átomo o falso si no.
 * Restricciones: acepta letras minusculas, dígitos y guion bajo, y exige que empiece con minuscula.
 * Objetivo: validar nombres de persona recibidos desde Prolog.
 */
export function esAtomoValido(texto) {
  return typeof texto === 'string' && /^[a-z][a-z0-9_]*$/i.test(texto)
}

/**
 * Entradas: arreglo de nombres de personas.
 * Salidas: arreglo de objetos { nombre, imagen }.
 * Restricciones: asigna por orden alfabético y reutiliza imágenes en ciclo si hay más nombres
 * que recursos disponibles.
 * Objetivo: compartir la misma asignación de imágenes entre resultados de Personas y Lugares.
 */
export function asignarImagenesPersonas(personas) {
  const nombresOrdenados = [...new Set(personas)].sort()

  // Si son las mismas personas, se asigna la misma imagen.
  const imagenPorNombre = new Map(
    nombresOrdenados.map((nombre, indice) => [
      nombre,
      IMAGENES_PERSONAS[indice % IMAGENES_PERSONAS.length],
    ]),
  )

  return personas.map((nombre) => ({
    nombre,
    imagen: imagenPorNombre.get(nombre),
  }))
}

/**
 * Entradas: ninguna.
 * Salidas: objeto con la cantidad de personas y la lista con sus nombres e imágenes.
 * Restricciones: la primera línea debe ser una cantidad no negativa y
 * las siguientes, átomos válidos de persona.
 * Objetivo: ejecutar interfaz_consultar_personas y devolver el objeto JSON al controlador.
 */
export async function obtenerPersonasCaso() {
  const stdout = await obtenerRespuestaProlog('interfaz_consultar_personas')

  const [cantidadTexto, ...personas] = stdout.trim() ? stdout.trim().split(/\r?\n/) : [] // Dividir en líneas, considerando tanto \r como \n.
  const cantidad = Number(cantidadTexto)

  if (
    !Number.isInteger(cantidad) ||
    cantidad < 0 ||
    personas.some((persona) => !esAtomoValido(persona))
  ) {
    throw new Error('Prolog devolvió una lista de personas inválida.')
  }

  return { cantidad, personas: asignarImagenesPersonas(personas) }
}
