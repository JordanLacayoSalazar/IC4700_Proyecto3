import { PlaceOutlined, VpnKeyOutlined } from '@mui/icons-material'
import { Box, CircularProgress, Typography } from '@mui/material'

/**
 * Entradas: lista y cantidad de objetos junto con los estados de carga y error.
 * Salidas: tarjetas de objetos con sus lugares de acceso condicionado y ubicación.
 * Restricciones: recibe los objetos consultados por el backend.
 * Objetivo: mostrar los objetos y sus relaciones de acceso y ubicación.
 */
function ResultadoObjetos({ cantidad, objetos, cargando, error }) {
  if (cargando) {
    return (
      <Box className="estado-consulta" role="status">
        <CircularProgress color="inherit" size={28} />
        <Typography>Consultando objetos...</Typography>
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
        No hay objetos registrados en el caso.
      </Typography>
    )
  }

  /**
   * Entradas: arreglo de lugares.
   * Salidas: cadena de texto con los lugares separados por coma, o "No registrado" si está vacío.
   * Restricciones: lugares debe ser un arreglo de strings.
   * Objetivo: mostrar los lugares de acceso o ubicación de un objeto.
   */
  function mostrarLugares(lugares) {
    return lugares.join(', ') || 'No registrado'
  }

  /**
   * Entradas: objeto con nombre, lugares a los que permite acceder y lugares donde se encontraba.
   * Salidas: tarjeta JSX con nombre del objeto y sus relaciones de acceso y ubicación.
   * Restricciones: los lugares deben ser arreglos de strings.
   * Objetivo: representar visualmente un objeto y sus relaciones.
   */
  function renderizarObjeto({ nombre, permiteAccederA, seEncontrabaEn }) {
    return (
      <Box component="article" className="tarjeta-lugar tarjeta-objeto" key={nombre}>
        <Typography component="h3" className="nombre-lugar">
          {nombre}
        </Typography>
        <Box className="detalles-objeto">
          <Box className="dato-objeto">
            <Typography component="h4">
              <VpnKeyOutlined aria-hidden="true" />
              Permite acceder a:
            </Typography>
            <Typography>{mostrarLugares(permiteAccederA)}</Typography>
          </Box>
          <Box className="dato-objeto">
            <Typography component="h4">
              <PlaceOutlined aria-hidden="true" />
              Se encontraba en:
            </Typography>
            <Typography>{mostrarLugares(seEncontrabaEn)}</Typography>
          </Box>
        </Box>
      </Box>
    )
  }

  return <Box className="lista-lugares">{objetos.map(renderizarObjeto)}</Box>
}

export default ResultadoObjetos
