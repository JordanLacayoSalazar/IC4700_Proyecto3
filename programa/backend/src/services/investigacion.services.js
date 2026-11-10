import {
  asignarImagenesPersonas,
  esAtomoValido,
  obtenerPersonasCaso,
} from './personas.services.js'
import { IMAGEN_PERSONA_DEFAULT } from '../constants.js'
import {
  obtenerRespuestaProlog,
  obtenerRespuestaPrologConArgumentos,
} from './prolog.services.js'

/**
 * Entradas: ninguna.
 * Salidas: texto producido por opcion_consultar_caso en Prolog.
 * Restricciones: el texto producido por Prolog debe ser no vacío.
 * Objetivo: ejecutar la consulta y devolver el texto al controlador.
 */
export async function obtenerInformacionCaso() {
  const stdout = await obtenerRespuestaProlog('opcion_consultar_caso')

  if (typeof stdout !== 'string' || !stdout.trim()) {
    throw new Error('Prolog no devolvió información del caso.')
  }

  return stdout.trim()
}

export async function obtenerEventoCaso() {
  const stdout = await obtenerRespuestaProlog('mostrar_evento')
  if (!stdout.trim()) {
    throw new Error('Prolog no devolvió el evento central.')
  }

  return stdout
}

export async function obtenerPosiblesResponsablesCaso() {
  return obtenerRespuestaProlog('opcion_posibles_responsables')
}

export async function obtenerExplicacionesCaso(persona) {
  if (persona !== undefined && persona !== null && persona !== '' && !esAtomoValido(persona)) {
    throw new Error('El nombre de la persona no es válido.')
  }

  return obtenerRespuestaPrologConArgumentos('interfaz_generar_explicaciones', [persona])
}

export async function investigarPersonaCaso(persona) {
  if (persona !== undefined && persona !== null && persona !== '' && !esAtomoValido(persona)) {
    throw new Error('El nombre de la persona no es válido.')
  }

  return obtenerRespuestaPrologConArgumentos('interfaz_investigar_persona', [persona])
}

export async function consultarMovimientoPorHora(persona, lugar, hora) {
  validarAtomosConsulta(persona, lugar)
  return obtenerRespuestaPrologConArgumentos('interfaz_consultar_estadia', [
    persona,
    lugar,
    hora,
  ])
}

export async function consultarMovimientosPorIntervalo(persona, lugar, inicio, fin) {
  validarAtomosConsulta(persona, lugar)
  return obtenerRespuestaPrologConArgumentos('interfaz_consultar_intervalo', [
    persona,
    lugar,
    inicio,
    fin,
  ])
}

function validarAtomosConsulta(persona, lugar) {
  for (const [valor, etiqueta] of [
    [persona, 'persona'],
    [lugar, 'lugar'],
  ]) {
    if (valor !== undefined && valor !== null && valor !== '' && !esAtomoValido(valor)) {
      throw new Error(`El nombre de ${etiqueta} no es válido.`)
    }
  }
}

export async function obtenerResolucionCaso() {
  return obtenerRespuestaProlog('opcion_resolver_caso')
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
  const stdout = await obtenerRespuestaProlog('interfaz_consultar_lugares')

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
  const stdout = await obtenerRespuestaProlog('interfaz_consultar_objetos')

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
 * Restricciones: cada línea contiene cuatro campos separados por |. La lista de personas
 *                puede estar vacía y los valores de persona/lugar/evidencia deben ser átomos.
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
 * Objetivo: ejecutar la consulta y devolver cantidad y evidencias al controlador.
 */
export async function obtenerEvidenciasCaso() {
  const stdout = await obtenerRespuestaProlog('interfaz_consultar_evidencias')

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

/**
 * Entradas: líneas de salida de interfaz_consultar_movimientos o
 * interfaz_consultar_testimonios.
 * Salidas: cantidad de registros y registros individuales con nombre y texto.
 * Restricciones: cada línea contiene dos campos separados por |. El nombre debe ser un átomo Prolog y el texto no puede estar vacío.
 * Objetivo: validar y convertir la salida de Prolog a un arreglo que pueda entender el frontend.
 */
export function parsearRegistrosPersona(lineas) {
  if (!Array.isArray(lineas)) {
    throw new Error('Prolog devolvió una lista de registros inválida.')
  }

  return lineas.map((linea) => {
    if (typeof linea !== 'string') {
      throw new Error('Prolog devolvió una línea de registro inválida.')
    }

    const separador = linea.indexOf('|')
    if (separador < 0) {
      throw new Error('Prolog devolvió un registro con formato inválido.')
    }

    const nombre = linea.slice(0, separador)
    const texto = linea.slice(separador + 1)
    if (!esAtomoValido(nombre) || !texto.trim()) {
      throw new Error('Prolog devolvió datos de registro inválidos.')
    }

    return { nombre, texto }
  })
}

/**
 * Entradas: nombre de un predicado Prolog que devuelve registros de personas con un texto
 *           (formato: nombre|texto).
 * Salidas: cantidad de registros, y registros individuales con nombre, imagen y texto.
 * Restricciones: Prolog imprime la cantidad en la primera línea y luego una línea por registro.
 * Objetivo: reutilizar esta función para obtener registros de movimientos y testimonios del caso, asignando imágenes a las personas.
 */
async function obtenerRegistrosPersona(predicado) {
  const stdout = await obtenerRespuestaProlog(predicado)
  const textoLimpio = stdout.trim()
  const [cantidadTexto, ...lineas] = textoLimpio ? textoLimpio.split(/\r?\n/) : []
  const cantidad = Number(cantidadTexto)
  if (!Number.isInteger(cantidad) || cantidad < 0) {
    throw new Error('Prolog devolvió una cantidad de registros inválida.')
  }

  const registros = parsearRegistrosPersona(lineas)
  const resultadoPersonas = await obtenerPersonasCaso()
  const imagenPorNombre = new Map(
    resultadoPersonas.personas.map(({ nombre, imagen }) => [nombre, imagen]),
  )

  return {
    cantidad,
    registros: registros.map(({ nombre, texto }) => ({
      nombre,
      imagen: imagenPorNombre.get(nombre) ?? IMAGEN_PERSONA_DEFAULT,
      texto,
    })),
  }
}

/**
 * Entradas: ninguna.
 * Salidas: cantidad de movimientos y registros individuales con persona, imagen y texto.
 * Restricciones: ninguna.
 * Objetivo: consultar los movimientos del caso para enviarlos al controlador.
 */
export async function obtenerMovimientosCaso() {
  return obtenerRegistrosPersona('interfaz_consultar_movimientos')
}

/**
 * Entradas: ninguna.
 * Salidas: cantidad de testimonios y registros individuales con persona, imagen y texto.
 * Restricciones: ninguna.
 * Objetivo: consultar los testimonios del caso para enviarlos al controlador.
 */
export async function obtenerTestimoniosCaso() {
  return obtenerRegistrosPersona('interfaz_consultar_testimonios')
}
