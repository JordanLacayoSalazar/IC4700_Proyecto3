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

export async function consultarEventoCaso() {
  const respuesta = await fetch(`${URL_API}/caso/evento`)
  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(resultado.error || 'No se pudo consultar el evento central.')
  }

  return resultado.evento
}

export async function consultarPosiblesResponsablesCaso() {
  const respuesta = await fetch(`${URL_API}/caso/posibles-responsables`)
  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(resultado.error || 'No se pudieron consultar posibles responsables.')
  }

  return resultado.texto
}

export async function consultarExplicacionesCaso(persona) {
  const respuesta = await fetch(`${URL_API}/caso/explicaciones`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ persona }),
  })
  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(resultado.error || 'No se pudieron generar las explicaciones.')
  }

  return resultado.texto
}

async function consultarConParametros(ruta, parametros, mensajeError) {
  const respuesta = await fetch(`${URL_API}${ruta}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parametros),
  })
  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(resultado.error || mensajeError)
  }

  return resultado.texto
}

export async function investigarPersonaCaso(persona) {
  return consultarConParametros(
    '/caso/investigar-persona',
    { persona },
    'No se pudo investigar a la persona.',
  )
}

export async function consultarMovimientoPorHoraCaso(persona, lugar, hora) {
  return consultarConParametros(
    '/caso/movimiento-hora',
    { persona, lugar, hora },
    'No se pudo consultar el movimiento.',
  )
}

export async function consultarMovimientosPorIntervaloCaso(persona, lugar, inicio, fin) {
  return consultarConParametros(
    '/caso/movimientos-intervalo',
    { persona, lugar, inicio, fin },
    'No se pudieron consultar los movimientos.',
  )
}

export async function resolverCaso() {
  const respuesta = await fetch(`${URL_API}/caso/resolver`)
  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(resultado.error || 'No se pudo resolver el caso.')
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

/**
 * Entradas: ninguna.
 * Salidas: cantidad de movimientos y lista de registros individuales con nombre, imagen y descripción.
 * Restricciones: requiere una respuesta JSON del endpoint de movimientos.
 * Objetivo: consultar GET api/caso/movimientos para mostrar cada movimiento.
 */
export async function consultarMovimientosCaso() {
  const respuesta = await fetch(`${URL_API}/caso/movimientos`)
  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(resultado.error || 'No se pudieron consultar los movimientos del caso.')
  }

  return resultado
}

/**
 * Entradas: ninguna.
 * Salidas: cantidad de testimonios y lista de registros individuales con nombre, imagen y descripción.
 * Restricciones: requiere una respuesta JSON del endpoint de testimonios.
 * Objetivo: consultar GET api/caso/testimonios para mostrar cada testimonio.
 */
export async function consultarTestimoniosCaso() {
  const respuesta = await fetch(`${URL_API}/caso/testimonios`)
  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(resultado.error || 'No se pudieron consultar los testimonios del caso.')
  }

  return resultado
}
