import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { dirname } from 'node:path'
import {
  asignarImagenesPersonas,
  esAtomoValido,
  obtenerPersonasCaso,
} from './personas.services.js'
import {
  ARCHIVO_MAIN_PROLOG,
  IMAGEN_PERSONA_DEFAULT,
  MAX_BUFFER_TAMANO,
  TIMEOUT_MILISEGUNDOS,
  UTF_ENCODING,
} from '../constants.js'

const ejecutarArchivo = promisify(execFile)

/**
 * Entradas: ninguna.
 * Salidas: texto producido por opcion_consultar_caso en Prolog.
 * Restricciones: el texto producido por Prolog debe ser no vacío.
 * Objetivo: ejecutar la consulta y devolver el texto al controlador.
 */
export async function obtenerInformacionCaso() {
  const { stdout } = await ejecutarArchivo(
    'swipl',
    ['-q', '-s', ARCHIVO_MAIN_PROLOG, '-g', 'opcion_consultar_caso,halt'],
    {
      cwd: dirname(ARCHIVO_MAIN_PROLOG),
      encoding: UTF_ENCODING,
      maxBuffer: MAX_BUFFER_TAMANO,
      timeout: TIMEOUT_MILISEGUNDOS,
    },
  )

  if (typeof stdout !== 'string' || !stdout.trim()) {
    throw new Error('Prolog no devolvió información del caso.')
  }

  return stdout.trim()
}

/**
 * Entradas: líneas producidas por interfaz_consultar_lugares en Prolog.
 * Salidas: arreglo de lugares con nombre, descripción y personas con acceso.
 * Restricciones: cada línea debe contener tres campos separados por |. El campo de personas puede estar vacío.
 * Objetivo: validar y convertir la salida de Prolog a un arreglo que pueda entender el frontend.
 */
export function parsearLugares(lineas) {
  if (!Array.isArray(lineas)) {
    throw new Error('Prolog devolvió una lista de lugares inválida.')
  }

  return lineas.map((linea) => {
    if (typeof linea !== 'string') {
      throw new Error('Prolog devolvió una línea de lugar inválida.')
    }

    const campos = linea.split('|')

    // Si nadie tiene acceso, split devuelve un arreglo de longitud 3 con el último campo vacío, lo cual es válido.
    if (campos.length !== 3) {
      throw new Error('Prolog devolvió un lugar con formato inválido.')
    }

    const [nombre, descripcion, personasTexto] = campos
    const personas = personasTexto ? personasTexto.split(',') : []
    if (
      typeof nombre !== 'string' ||
      typeof descripcion !== 'string' ||
      !esAtomoValido(nombre) ||
      !descripcion ||
      personas.some((persona) => typeof persona !== 'string' || !esAtomoValido(persona))
    ) {
      throw new Error('Prolog devolvió datos de lugar o acceso inválidos.')
    }

    return { nombre, descripcion, personas }
  })
}

/**
 * Entradas: ninguna.
 * Salidas: objeto con la cantidad de lugares informada por Prolog y el arreglo de lugares.
 * Restricciones: Prolog imprime la cantidad en la primera linea y cada lugar despues con
 * tres campos separados por '|' y las personas separadas por comas.
 * Objetivo: ejecutar la consulta y devolver cantidad y lugares al controlador.
 */
export async function obtenerLugaresCaso() {
  const { stdout } = await ejecutarArchivo(
    'swipl',
    ['-q', '-s', ARCHIVO_MAIN_PROLOG, '-g', 'interfaz_consultar_lugares,halt'],
    {
      cwd: dirname(ARCHIVO_MAIN_PROLOG),
      encoding: UTF_ENCODING,
      maxBuffer: MAX_BUFFER_TAMANO,
      timeout: TIMEOUT_MILISEGUNDOS,
    },
  )

  if (typeof stdout !== 'string') {
    throw new Error('Prolog devolvió una respuesta de lugares inválida.')
  }

  const textoLimpio = stdout.trim()
  const [cantidadTexto, ...lineas] = textoLimpio
    ? textoLimpio.split(/\r?\n/)
    : []
  const cantidad = Number(cantidadTexto)
  if (!Number.isInteger(cantidad) || cantidad < 0) {
    throw new Error('Prolog devolvió una cantidad de lugares inválida.')
  }

  const lugares = parsearLugares(lineas)

  const resultadoPersonas = await obtenerPersonasCaso()
  const imagenPorNombre = new Map(
    resultadoPersonas.personas.map(({ nombre, imagen }) => [nombre, imagen]),
  )

  const resultado = lugares.map(({ nombre, descripcion, personas }) => ({
    nombre,
    descripcion,
    personas: personas.map((nombrePersona) => ({
      nombre: nombrePersona,
      imagen: imagenPorNombre.get(nombrePersona) ?? IMAGEN_PERSONA_DEFAULT,
    })),
  }))

  return { cantidad, lugares: resultado }
}

/**
 * Entradas: líneas producidas por interfaz_consultar_objetos en Prolog.
 * Salidas: objetos con su nombre, los lugares a los que permiten acceder y sus ubicaciones.
 * Restricciones: cada línea contiene tres campos separados por |. Las listas pueden estar vacías
 *                y sus elementos, cuando existen, son átomos Prolog.
 * Objetivo: validar y convertir las relaciones de objetos impresas por Prolog.
 */
export function parsearObjetos(lineas) {
  if (!Array.isArray(lineas)) {
    throw new Error('Prolog devolvió una lista de objetos inválida.')
  }

  return lineas.map((linea) => {
    if (typeof linea !== 'string') {
      throw new Error('Prolog devolvió una línea de objeto inválida.')
    }

    const campos = linea.split('|')
    if (campos.length !== 3) {
      throw new Error('Prolog devolvió un objeto con formato inválido.')
    }

    const [nombre, accesosTexto, ubicacionesTexto] = campos
    const permiteAccederA = accesosTexto ? accesosTexto.split(',') : []
    const seEncontrabaEn = ubicacionesTexto ? ubicacionesTexto.split(',') : []
    if (
      !esAtomoValido(nombre) ||
      permiteAccederA.some((lugar) => !esAtomoValido(lugar)) ||
      seEncontrabaEn.some((lugar) => !esAtomoValido(lugar))
    ) {
      throw new Error('Prolog devolvió datos de objeto inválidos.')
    }

    return { nombre, permiteAccederA, seEncontrabaEn }
  })
}

/**
 * Entradas: ninguna.
 * Salidas: objeto con la cantidad de objetos y la lista de relaciones.
 * Restricciones: Prolog imprime la cantidad en la primera línea y luego una línea por cada objeto.
 * Objetivo: ejecutar la consulta y devolver cantidad y objetos al controlador.
 */
export async function obtenerObjetosCaso() {
  const { stdout } = await ejecutarArchivo(
    'swipl',
    ['-q', '-s', ARCHIVO_MAIN_PROLOG, '-g', 'interfaz_consultar_objetos,halt'],
    {
      cwd: dirname(ARCHIVO_MAIN_PROLOG),
      encoding: UTF_ENCODING,
      maxBuffer: MAX_BUFFER_TAMANO,
      timeout: TIMEOUT_MILISEGUNDOS,
    },
  )

  if (typeof stdout !== 'string') {
    throw new Error('Prolog devolvió una respuesta de objetos inválida.')
  }

  const textoLimpio = stdout.trim()
  const [cantidadTexto, ...lineas] = textoLimpio ? textoLimpio.split(/\r?\n/) : []
  const cantidad = Number(cantidadTexto)
  if (!Number.isInteger(cantidad) || cantidad < 0) {
    throw new Error('Prolog devolvió una cantidad de objetos inválida.')
  }

  return { cantidad, objetos: parsearObjetos(lineas) }
}

/**
 * Entradas: líneas producidas por interfaz_consultar_evidencias en Prolog.
 * Salidas: evidencias con nombre, ubicación, hora en texto HH:MM y personas relacionadas.
 * Restricciones: cada línea contiene cuatro campos separados por |; la lista de personas
 * puede estar vacía y los valores de persona/lugar/evidencia deben ser átomos.
 * Objetivo: validar y convertir las evidencias y sus correspondencias.
 */
export function parsearEvidencias(lineas) {
  if (!Array.isArray(lineas)) {
    throw new Error('Prolog devolvió una lista de evidencias inválida.')
  }

  return lineas.map((linea) => {
    if (typeof linea !== 'string') {
      throw new Error('Prolog devolvió una línea de evidencia inválida.')
    }

    const campos = linea.split('|')
    if (campos.length !== 4) {
      throw new Error('Prolog devolvió una evidencia con formato inválido.')
    }

    const [nombre, lugar, horaTexto, personasTexto] = campos
    const personas = personasTexto ? personasTexto.split(',') : []
    if (
      !esAtomoValido(nombre) ||
      !esAtomoValido(lugar) ||
      typeof horaTexto !== 'string' ||
      personas.some((persona) => !esAtomoValido(persona))
    ) {
      throw new Error('Prolog devolvió datos de evidencia inválidos.')
    }

    return { nombre, lugar, hora: horaTexto, personas }
  })
}

/**
 * Entradas: ninguna.
 * Salidas: objeto con la cantidad de evidencias informada por Prolog y la lista con
 * personas relacionadas e imágenes asignadas.
 * Restricciones: Prolog imprime la cantidad en la primera línea y luego una línea por evidencia.
 * Objetivo: ejecutar interfaz_consultar_evidencias y preparar la respuesta de la API.
 */
export async function obtenerEvidenciasCaso() {
  const { stdout } = await ejecutarArchivo(
    'swipl',
    ['-q', '-s', ARCHIVO_MAIN_PROLOG, '-g', 'interfaz_consultar_evidencias,halt'],
    {
      cwd: dirname(ARCHIVO_MAIN_PROLOG),
      encoding: UTF_ENCODING,
      maxBuffer: MAX_BUFFER_TAMANO,
      timeout: TIMEOUT_MILISEGUNDOS,
    },
  )

  if (typeof stdout !== 'string') {
    throw new Error('Prolog devolvió una respuesta de evidencias inválida.')
  }

  const textoLimpio = stdout.trim()
  const [cantidadTexto, ...lineas] = textoLimpio
    ? textoLimpio.split(/\r?\n/)
    : []
  const cantidad = Number(cantidadTexto)
  if (!Number.isInteger(cantidad) || cantidad < 0) {
    throw new Error('Prolog devolvió una cantidad de evidencias inválida.')
  }

  const evidencias = parsearEvidencias(lineas)
  const resultadoPersonas = await obtenerPersonasCaso()
  const imagenPorNombre = new Map(
    resultadoPersonas.personas.map(({ nombre, imagen }) => [nombre, imagen]),
  )

  return {
    cantidad,
    evidencias: evidencias.map(({ nombre, lugar, hora, personas }) => ({
      nombre,
      lugar,
      hora,
      personas: asignarImagenesPersonas(personas).map((persona) => ({
        ...persona,
        imagen: imagenPorNombre.get(persona.nombre) ?? persona.imagen,
      })),
    })),
  }
}
