import { Box, CircularProgress, Typography } from '@mui/material'
import TarjetaPersona from './tarjetaPersona.jsx'

/**
 * Entradas: cantidad, personas con nombre e imagen, indicador cargando y mensaje error.
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

  return (
    <Box className="lista-personas">
      {personas.map(({ nombre, imagen }) => (
        <TarjetaPersona key={nombre} nombre={nombre} imagen={imagen} />
      ))}
    </Box>
  )
}

export default ResultadoPersonas
