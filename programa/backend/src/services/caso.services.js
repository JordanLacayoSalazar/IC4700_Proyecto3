import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ejecutarArchivo = promisify(execFile)

const ARCHIVO_MAIN_PROLOG = fileURLToPath(
  new URL('../../../prolog/main.pl', import.meta.url),
)
const UTF_ENCODING = 'utf8'
const MAX_BUFFER_TAMANO = 1024 * 1024 // 1 MB de salida
const TIMEOUT_MILISEGUNDOS = 15000 // La ejecución tiene límite de 15 segundos.

/**
 * Entradas: nombre de persona emitido por Prolog.
 * Salidas: verdadero si el texto representa un átomo con nombre válido.
 * Restricciones: acepta letras minusculas, dígitos y guion bajo, y exige que empiece con minuscula.
 * Objetivo: validar cada nombre recibido antes de incluirlo en la respuesta del servicio.
 */
function esAtomoPersonaValido(persona) {
  return /^[a-z][a-z0-9_]*$/i.test(persona)
}

/**
 * Entradas: ninguna.
 * Salidas: texto producido por opcion_consultar_caso en Prolog.
 * Restricciones: requiere SWI-Prolog instalado, main.pl y que el predicado produzca salida no vacía.
 * Objetivo: ejecutar la consulta de información del caso y devolver su salida al controlador.
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

  const texto = stdout.trim()
  if (!texto) {
    throw new Error('Prolog no devolvió información del caso.')
  }

  return texto
}

/**
 * Entradas: ninguna.
 * Salidas: objeto con cantidad y lista de personas impresas por opcion_consultar_personas.
 * Restricciones: requiere SWI-Prolog instalado. En la salida, el primer renglón sea un entero no negativo
 *                y los demas renglones sean átomos válidos.
 * Objetivo: ejecutar la consulta de personas del caso y devolver su salida al controlador.
 */
export async function obtenerPersonasCaso() {
  const { stdout } = await ejecutarArchivo(
    'swipl',
    ['-q', '-s', ARCHIVO_MAIN_PROLOG, '-g', 'opcion_consultar_personas,halt'],
    {
      cwd: dirname(ARCHIVO_MAIN_PROLOG),
      encoding: UTF_ENCODING,
      maxBuffer: MAX_BUFFER_TAMANO,
      timeout: TIMEOUT_MILISEGUNDOS,
    },
  )

  const [cantidadTexto, ...personas] = stdout.trim().split(/\r?\n/)
  const cantidad = Number(cantidadTexto)

  if (!Number.isInteger(cantidad) || cantidad < 0 || personas.some((persona) => !esAtomoPersonaValido(persona))) {
    throw new Error('Prolog devolvió una lista de personas inválida.')
  }

  return { cantidad, personas }
}
