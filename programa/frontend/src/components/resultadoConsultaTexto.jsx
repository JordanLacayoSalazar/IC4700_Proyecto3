import { Alert, Box, CircularProgress, Typography } from '@mui/material'

/**
 * Entradas: texto de respuesta, indicador cargando y mensaje error.
 * Salidas: JSX para mostrar progreso, error o texto de salida de Prolog.
 * Restricciones: muestra el resultado solo cuando existe texto y no hay carga activa.
 * Objetivo: ser un componente reutilizable para resultados textuales de consultas.
 */
function ResultadoConsulta({ texto, cargando, error }) {
  return (
    <Box className="resultado-consulta" aria-live="polite">
      {cargando && (
        <Box className="estado-consulta">
          <CircularProgress color="inherit" size={28} />
          <Typography>Consultando Prolog...</Typography>
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {texto && !cargando && (
        <Box component="pre" className="texto-resultado">
          {texto}
        </Box>
      )}
    </Box>
  )
}

export default ResultadoConsulta
