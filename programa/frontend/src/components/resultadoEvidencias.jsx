import { Box, CircularProgress, Typography } from '@mui/material'
import TarjetaPersona from './tarjetaPersona.jsx'

/**
 * Entradas: cantidad y evidencias con ubicación, hora y personas relacionadas.
 * Salidas: lista gráfica de evidencias y sus correspondencias.
 * Restricciones: recibe evidencias e imágenes preparadas por el backend.
 * Objetivo: mostrar cada evidencia y, si existe, la persona a la que corresponde.
 */
function ResultadoEvidencias({ cantidad, evidencias, cargando, error }) {
  if (cargando) {
    return (
      <Box className="estado-consulta" role="status">
        <CircularProgress color="inherit" size={28} />
        <Typography>Consultando evidencias...</Typography>
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
        No hay evidencias registradas en el caso.
      </Typography>
    )
  }

  function renderizarEvidencia({ nombre, lugar, hora, personas }) {
    return (
      <Box component="article" className="tarjeta-lugar tarjeta-evidencia" key={nombre}>
        <Typography component="h3" className="nombre-lugar">
          {nombre}
        </Typography>
        <Typography className="descripcion-evidencia">
          Encontrada en {lugar} a las {hora}
        </Typography>
        <Box className="subcuadro-evidencia">
          <Typography component="h4">Corresponde a:</Typography>
          {personas.length === 0 ? (
            <Typography>No hay una persona relacionada.</Typography>
          ) : (
            <Box className="lista-accesos-lugar">
              {personas.map(({ nombre: nombrePersona, imagen }) => (
                <TarjetaPersona
                  key={nombrePersona}
                  nombre={nombrePersona}
                  imagen={imagen}
                  className="persona-con-acceso"
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    )
  }

  return <Box className="lista-lugares">{evidencias.map(renderizarEvidencia)}</Box>
}

export default ResultadoEvidencias
