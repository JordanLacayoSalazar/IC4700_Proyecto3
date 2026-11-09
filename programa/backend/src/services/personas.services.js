import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { dirname } from 'node:path'
import {
  ARCHIVO_MAIN_PROLOG,
  IMAGENES_PERSONAS,
  MAX_BUFFER_TAMANO,
  TIMEOUT_MILISEGUNDOS,
  UTF_ENCODING,
} from '../constants.js'

const ejecutarArchivo = promisify(execFile)

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
  const { stdout } = await ejecutarArchivo(
    'swipl',
    ['-q', '-s', ARCHIVO_MAIN_PROLOG, '-g', 'interfaz_consultar_personas,halt'],
    {
      cwd: dirname(ARCHIVO_MAIN_PROLOG),
      encoding: UTF_ENCODING,
      maxBuffer: MAX_BUFFER_TAMANO,
      timeout: TIMEOUT_MILISEGUNDOS,
    },
  )

  if (typeof stdout !== 'string') {
    throw new Error('Prolog devolvió una respuesta de personas inválida.')
  }

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
