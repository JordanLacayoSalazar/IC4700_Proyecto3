import { execFile } from 'node:child_process'
import { existsSync } from 'node:fs'
import { promisify } from 'node:util'
import { dirname } from 'node:path'
import {
  ARCHIVO_MAIN_PROLOG,
  MAX_BUFFER_TAMANO,
  TIMEOUT_MILISEGUNDOS,
  UTF_ENCODING,
} from '../constants.js'

const ejecutarArchivo = promisify(execFile)
const RUTA_SWIPL_WINDOWS = 'C:\\Program Files\\swipl\\bin\\swipl.exe'
const EJECUTABLE_SWIPL =
  process.env.SWIPL_PATH ||
  (process.platform === 'win32' && existsSync(RUTA_SWIPL_WINDOWS)
    ? RUTA_SWIPL_WINDOWS
    : 'swipl')

async function ejecutarConsultaProlog(argumentos, predicado) {
  try {
    return await ejecutarArchivo(EJECUTABLE_SWIPL, argumentos, {
      cwd: dirname(ARCHIVO_MAIN_PROLOG),
      encoding: UTF_ENCODING,
      maxBuffer: MAX_BUFFER_TAMANO,
      timeout: TIMEOUT_MILISEGUNDOS,
    })
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(
        `No se encontró SWI-Prolog para ejecutar ${predicado}. Agregue swipl al PATH o configure SWIPL_PATH con la ruta completa a su ejecutable.`,
        { cause: error },
      )
    }

    throw error
  }
}

/**
 * Entradas: nombre de un predicado Prolog sin argumentos.
 * Salidas: texto escrito por el predicado en la salida estándar.
 * Restricciones: Se requiere que SWI-Prolog esté instalado, disponible mediante SWIPL_PATH o PATH (o en su ruta estándar de Windows),
 *                y que el archivo main.pl contenga el predicado solicitado.
 *                Además, el nombre del predicado debe ser una cadena de caracteres de letras minúsculas y guiones bajos.
 * Objetivo: reutilizar esta función para ejecutar todas las consultas Prolog del backend.
 */
export async function obtenerRespuestaProlog(predicado) {
  if (typeof predicado !== 'string' || !/^[a-z_]+$/.test(predicado)) {
    throw new Error('El nombre del predicado Prolog no es válido.')
  }

  const { stdout } = await ejecutarConsultaProlog(
    ['-q', '-s', ARCHIVO_MAIN_PROLOG, '-g', `${predicado},halt`],
    predicado,
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
  const { stdout } = await ejecutarConsultaProlog(
    ['-q', '-s', ARCHIVO_MAIN_PROLOG, '-g', objetivo],
    predicado,
  )

  if (typeof stdout !== 'string') {
    throw new Error(`Prolog devolvió una respuesta inválida para ${predicado}.`)
  }

  return stdout
}
