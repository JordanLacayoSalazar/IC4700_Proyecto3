import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { dirname } from 'node:path'
import {
  ARCHIVO_MAIN_PROLOG,
  MAX_BUFFER_TAMANO,
  TIMEOUT_MILISEGUNDOS,
  UTF_ENCODING,
} from '../constants.js'

const ejecutarArchivo = promisify(execFile)

/**
 * Entradas: nombre de un predicado Prolog sin argumentos.
 * Salidas: texto escrito por el predicado en la salida estándar.
 * Restricciones: Se requiere que SWI-Prolog esté instalado y que el archivo main.pl contenga el predicado solicitado.
 *                Además, el nombre del predicado debe ser una cadena de caracteres de letras minúsculas y guiones bajos.
 * Objetivo: reutilizar esta función para ejecutar todas las consultas Prolog del backend.
 */
export async function obtenerRespuestaProlog(predicado) {
  if (typeof predicado !== 'string' || !/^[a-z_]+$/.test(predicado)) {
    throw new Error('El nombre del predicado Prolog no es válido.')
  }

  const { stdout } = await ejecutarArchivo(
    'swipl',
    ['-q', '-s', ARCHIVO_MAIN_PROLOG, '-g', `${predicado},halt`],
    {
      cwd: dirname(ARCHIVO_MAIN_PROLOG),
      encoding: UTF_ENCODING,
      maxBuffer: MAX_BUFFER_TAMANO,
      timeout: TIMEOUT_MILISEGUNDOS,
    },
  )

  if (typeof stdout !== 'string') {
    throw new Error(`Prolog devolvió una respuesta inválida para ${predicado}.`)
  }

  return stdout
}

export async function obtenerRespuestaPrologConArgumentos(predicado, argumentos) {
  const aridadesPermitidas = {
    interfaz_generar_explicaciones: ['atomo'],
    interfaz_investigar_persona: ['atomo'],
    interfaz_consultar_estadia: ['atomo', 'atomo', 'hora'],
    interfaz_consultar_intervalo: ['atomo', 'atomo', 'hora', 'hora'],
  }
  const tiposArgumentos = Object.hasOwn(aridadesPermitidas, predicado)
    ? aridadesPermitidas[predicado]
    : undefined
  if (!tiposArgumentos || !Array.isArray(argumentos) || argumentos.length !== tiposArgumentos.length) {
    throw new Error('La consulta de Prolog no es válida.')
  }

  const terminos = argumentos.map((argumento, indice) => {
    const esAtomo = tiposArgumentos[indice] === 'atomo'
    const esVacio = argumento === undefined || argumento === null || argumento === ''

    if (esVacio) {
        return JSON.stringify('')
    }
    if (esAtomo) {
        return `'${argumento}'`
    }
    if (tiposArgumentos[indice] === 'hora' && typeof argumento === 'number') {
      return String(argumento)
    }
    return `"${argumento}"` // Por seguridad
  })

  const objetivo = `${predicado}(${terminos.join(',')}),halt`
  const { stdout } = await ejecutarArchivo(
    'swipl',
    ['-q', '-s', ARCHIVO_MAIN_PROLOG, '-g', objetivo],
    {
      cwd: dirname(ARCHIVO_MAIN_PROLOG),
      encoding: UTF_ENCODING,
      maxBuffer: MAX_BUFFER_TAMANO,
      timeout: TIMEOUT_MILISEGUNDOS,
    },
  )

  if (typeof stdout !== 'string') {
    throw new Error(`Prolog devolvió una respuesta inválida para ${predicado}.`)
  }

  return stdout
}
