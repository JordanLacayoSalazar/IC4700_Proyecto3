import { Alert, Box, CircularProgress, Typography } from '@mui/material'

/**
 * Entradas: registros, cantidad opcional, estados de carga y error y renderizador de registro.
 * Salidas: estado de carga, error, lista vacía o lista de registros.
 * Restricciones: recibe registros sin agrupar y un renderizador que produce un elemento por registro.
 * Objetivo: proporcionar el estado y contenedor comunes a las seis listas del panel de datos.
 */
function PanelRegistros({
  registros,
  cantidad,
  cargando,
  error,
  mensajeCarga,
  mensajeVacio,
  classNameLista,
  renderizarRegistro,
}) {
  if (cargando) {
    return (
      <Box className="estado-consulta" role="status">
        <CircularProgress color="inherit" size={28} />
        <Typography>{mensajeCarga}</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error">{error}</Alert>
    )
  }

  if (cantidad === 0) {
    return <Typography className="mensaje-vacio-registros">{mensajeVacio}</Typography>
  }

  return (
    <Box className={classNameLista}>
      {registros.map((registro, indice) => renderizarRegistro(registro, indice))}
    </Box>
  )
}

export default PanelRegistros
