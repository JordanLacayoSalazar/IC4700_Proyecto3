import { Box, Typography } from '@mui/material'
import imagenesColores from './imagenesColores.js'

/**
 * Entradas: nombre, identificador de imagen y clase CSS opcional.
 * Salidas: tarjeta reutilizable con imagen y nombre de una persona.
 * Restricciones: la imagen debe corresponder a una clave de imagenesColores.
 * Objetivo: presentar una persona con el mismo marcado en las listas del caso.
 */
function TarjetaPersona({ nombre, imagen, className = 'tarjeta-persona' }) {
  return (
    <Box className={className}>
      <Box
        component="img"
        className="icono-persona"
        src={imagenesColores[imagen]}
        alt=""
        aria-hidden="true"
      />
      <Typography component="span" className="nombre-persona">
        {nombre}
      </Typography>
    </Box>
  )
}

export default TarjetaPersona
