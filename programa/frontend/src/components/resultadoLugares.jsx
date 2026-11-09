import { ExpandMoreOutlined } from '@mui/icons-material'
import { Box, CircularProgress, Typography } from '@mui/material'
import TarjetaPersona from './tarjetaPersona.jsx'

/**
 * Entradas: arreglo de lugares, personas registradas, estados de carga y mensajes de error.
 * Salidas: lista gráfica de lugares con desplegables de personas autorizadas.
 * Restricciones: espera los datos de lugares y personas con imágenes asignadas por el backend.
 * Objetivo: mostrar los lugares del caso y las personas que pueden acceder a cada uno.
 */
function ResultadoLugares({
  lugares,
  cargandoLugares,
  cargandoPersonas,
  errorLugares,
  errorPersonas,
}) {
  if (cargandoLugares || cargandoPersonas) {
    return (
      <Box className="estado-consulta" role="status">
        <CircularProgress color="inherit" size={28} />
        <Typography>Consultando lugares y personas...</Typography>
      </Box>
    )
  }

  if (errorLugares || errorPersonas) {
    return (
      <Typography className="error-personas" role="alert">
        {errorLugares || errorPersonas}
      </Typography>
    )
  }

  if (lugares.length === 0) {
    return (
      <Typography className="mensaje-personas">
        No hay lugares registrados en el caso.
      </Typography>
    )
  }

  /**
   * Entradas: objeto de lugar con nombre, descripción y lista de personas con acceso.
   * Salidas: tarjeta desplegable con la información del lugar y sus personas autorizadas.
   * Restricciones: los nombres de acceso deben corresponder a personas registradas.
   * Objetivo: presentar los accesos de un lugar y reutilizar el icono asignado a cada persona.
   */
  function renderizarLugar({ nombre, descripcion, personas }) {
    return (
      <Box component="article" className="tarjeta-lugar" key={nombre}>
        <Typography component="h3" className="nombre-lugar">
          {nombre}
        </Typography>
        <Typography className="descripcion-lugar">{descripcion}</Typography>
        <details className="detalles-accesos-lugar">
          <summary>
            <span>Ver personas con acceso</span>
            <ExpandMoreOutlined aria-hidden="true" />
          </summary>
          {personas.length === 0 ? (
            <Typography className="mensaje-accesos-lugar">
              No hay personas con acceso registrado.
            </Typography>
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
        </details>
      </Box>
    )
  }

  return <Box className="lista-lugares">{lugares.map(renderizarLugar)}</Box>
}

export default ResultadoLugares
