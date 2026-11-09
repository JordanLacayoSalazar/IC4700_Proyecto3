import { Box, CircularProgress, Typography } from '@mui/material'
import banana from '../assets/colors/Banana.webp'
import black from '../assets/colors/Black.webp'
import blue from '../assets/colors/Blue.webp'
import brown from '../assets/colors/Brown.webp'
import coral from '../assets/colors/Coral.webp'
import cyan from '../assets/colors/Cyan.webp'
import fortegreen from '../assets/colors/Fortegreen.webp'
import gray from '../assets/colors/Gray.webp'
import green from '../assets/colors/Green.webp'
import lime from '../assets/colors/Lime.webp'
import maroon from '../assets/colors/Maroon.webp'
import olive from '../assets/colors/Olive.webp'
import orange from '../assets/colors/Orange.webp'
import pink from '../assets/colors/Pink.webp'
import purple from '../assets/colors/Purple.webp'
import red from '../assets/colors/Red.webp'
import rose from '../assets/colors/Rose.webp'
import tan from '../assets/colors/Tan.webp'
import white from '../assets/colors/White.webp'
import yellow from '../assets/colors/Yellow.webp'

const imagenesColores = [
  banana, black, blue, brown,
  cyan, coral, fortegreen, gray,
  green, lime, maroon, olive,
  orange, pink, purple, red,
  rose, tan, white, yellow,
]

/**
 * Entradas: nombre de una persona.
 * Salidas: nombre normalizado en minúsculas y sin espacios externos.
 * Restricciones: persona debe ser una cadena.
 * Objetivo: producir la clave estable usada para buscar la imagen asignada.
 */
function normalizarNombrePersona(persona) {
  return persona.trim().toLowerCase()
}

/**
 * Entradas: arreglo de nombres de personas.
 * Salidas: Map de nombre normalizado a imagen de color.
 * Restricciones: ordena nombres únicos alfabéticamente; reutiliza las imágenes en ciclo
 * si la cantidad de nombres supera la cantidad de imágenes importadas.
 * Objetivo: asignar imágenes estables a las personas del caso.
 */
function obtenerImagenesPersonas(personas) {
  const nombresLimpios = personas.map(normalizarNombrePersona)
  const nombresUnicos = [...new Set(nombresLimpios)]
  const nombresOrdenados = nombresUnicos.sort();

  /**
   * Entradas: nombre normalizado e índice dentro del arreglo ordenado.
   * Salidas: par [nombre, imagen] para construir el Map.
   * Restricciones: el índice selecciona una imagen en ciclo si hay más nombres que recursos.
   * Objetivo: asociar cada nombre único con una imagen de color.
   */
  function asignarImagenPersona(nombre, indice) {
    const imagenAsignada = imagenesColores[indice % imagenesColores.length]
    return [nombre, imagenAsignada]
  }

  const mapeoPersonasImagenes = nombresOrdenados.map(asignarImagenPersona)
  return new Map(mapeoPersonasImagenes)
}

/**
 * Entradas: cantidad, nombres de personas, indicador cargando y mensaje error.
 * Salidas: JSX de carga, error, estado vacío o tarjetas de personas con sus imágenes.
 * Restricciones: usa cantidad para decidir si la consulta no tiene personas; la lista y la
 * cantidad deben provenir de la respuesta del backend.
 * Objetivo: representar el resultado de la consulta de personas.
 */
function ResultadoPersonas({ cantidad, personas, cargando, error }) {
  if (cargando) {
    return (
      <Box className="estado-consulta" role="status">
        <CircularProgress color="inherit" size={28} />
        <Typography>Consultando personas...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Typography className="error-personas" role="alert">
        {error}
      </Typography>
    )
  }

  if (cantidad === 0) {
    return (
      <Typography className="mensaje-personas">
        No hay personas registradas en el caso.
      </Typography>
    )
  }

  const imagenesPersonas = obtenerImagenesPersonas(personas)

  /**
   * Entradas: nombre de una persona de la lista.
   * Salidas: tarjeta JSX con la imagen asignada y el nombre.
   * Restricciones: el nombre debe corresponder a una clave del Map de imágenes.
   * Objetivo: presentar visualmente una persona en la lista del resultado.
   */
  function renderizarPersona(persona) {
    return (
      <Box className="tarjeta-persona" key={persona}>
        <Box
          component="img"
          className="icono-persona"
          src={imagenesPersonas.get(normalizarNombrePersona(persona))}
          alt=""
          aria-hidden="true"
        />
        <Typography component="span" className="nombre-persona">
          {persona}
        </Typography>
      </Box>
    )
  }

  return (
    <Box className="lista-personas">{personas.map(renderizarPersona)}</Box>
  )
}

export default ResultadoPersonas
