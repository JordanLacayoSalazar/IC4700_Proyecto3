import { Box, Typography } from '@mui/material'
import TarjetaPersona from './tarjetaPersona.jsx'

/**
 * Entradas: registro con nombre, imagen y texto.
 * Salidas: tarjeta con la persona a la izquierda y su movimiento o testimonio a la derecha.
 * Restricciones: recibe un registro individual, sin agrupar otros registros de la persona.
 * Objetivo: reutilizar el diseño de movimientos y testimonios.
 */
function TarjetaRegistroPersona({ nombre, imagen, texto }) {
  return (
    <Box component="article" className="tarjeta-registro-persona">
      <TarjetaPersona nombre={nombre} imagen={imagen} />
      <Typography className="texto-registro-persona">{texto}</Typography>
    </Box>
  )
}

export default TarjetaRegistroPersona
