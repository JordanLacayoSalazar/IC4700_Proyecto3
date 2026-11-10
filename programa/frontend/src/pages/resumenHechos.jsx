import { Box, Button, Typography } from '@mui/material'
import { OpenInNewOutlined } from '@mui/icons-material'

const resumenCaso = [
  { clave: 'personas', etiqueta: 'Personas involucradas', color: 1 },
  { clave: 'lugares', etiqueta: 'Lugares y accesos', color: 2 },
  { clave: 'objetos', etiqueta: 'Objetos', color: 3 },
  { clave: 'evidencias', etiqueta: 'Evidencias', color: 4 },
  { clave: 'movimientos', etiqueta: 'Movimientos', color: 5 },
  { clave: 'testimonios', etiqueta: 'Testimonios', color: 6 },
]

/**
 * Entradas: valor que debería contener la cantidad recibida.
 * Salidas: entero no negativo o el texto "No disponible".
 * Restricciones: solo acepta enteros no negativos.
 * Objetivo: obtener el total recibido desde el backend para mostrarlo en el panel.
 */
function mostrarCantidad(valor, cargando) {
  if (cargando) return 'Consultando...'
  if (Number.isInteger(valor) && valor >= 0) return valor
  return 'No disponible'
}

/**
 * Entradas: cantidades de registros y callbacks de detalle.
 * Salidas: JSX con el evento central y tarjetas resumen de las categorías del caso.
 * Restricciones: muestra "No disponible" para conteos ausentes o inválidos.
 * Objetivo: presentar el resumen del caso y permitir abrir el detalle de personas.
 */
function ResumenHechos({
  cantidadPersonas,
  cantidadLugares,
  cantidadObjetos,
  cantidadEvidencias,
  cantidadMovimientos,
  cantidadTestimonios,
  cargandoPersonas,
  cargandoLugares,
  cargandoObjetos,
  cargandoEvidencias,
  cargandoMovimientos,
  cargandoTestimonios,
  eventoCentral,
  cargandoEvento,
  errorEvento,
  onVerPersonas,
  onVerLugares,
  onVerObjetos,
  onVerEvidencias,
  onVerMovimientos,
  onVerTestimonios,
}) {
  const cantidades = {
    personas: cantidadPersonas,
    lugares: cantidadLugares,
    objetos: cantidadObjetos,
    evidencias: cantidadEvidencias,
    movimientos: cantidadMovimientos,
    testimonios: cantidadTestimonios,
  }
  const cargas = {
    personas: cargandoPersonas,
    lugares: cargandoLugares,
    objetos: cargandoObjetos,
    evidencias: cargandoEvidencias,
    movimientos: cargandoMovimientos,
    testimonios: cargandoTestimonios,
  }
  const accionesResumen = {
    personas: onVerPersonas,
    lugares: onVerLugares,
    objetos: onVerObjetos,
    evidencias: onVerEvidencias,
    movimientos: onVerMovimientos,
    testimonios: onVerTestimonios,
  }

  /**
   * Entradas: configuración de una categoría del resumen.
   * Salidas: botón JSX con etiqueta, cantidad e indicador para ver detalles.
   * Restricciones: personas y lugares reciben el callback de detalle correspondiente.
   * Objetivo: renderizar una tarjeta del resumen del caso.
   */
  function renderizarBotonesResumen({ clave, etiqueta, color }) {
    return (
      <Button
        className={`boton-resumen color-boton-${color}`}
        key={clave}
        onClick={accionesResumen[clave]}
        type="button"
      >
        <span className="texto-resumen">{etiqueta}</span>
        <span className="cantidad-resumen">
          {mostrarCantidad(cantidades[clave], cargas[clave])}
        </span>
        <span className="enlace-detalles">
          <span>Ver detalles</span>
          <OpenInNewOutlined aria-hidden="true" />
        </span>
      </Button>
    )
  }

  return (
    <Box className="contenido-caso">
      <Typography className="etiqueta-evento" component="p" variant="overline">
        Caso
      </Typography>
      <Typography
        className="nombre-evento"
        id="titulo-caso"
        component="pre"
        variant="p"
      >
        {errorEvento || (cargandoEvento ? 'Consultando...' : eventoCentral || 'No disponible')}
      </Typography>

      <Typography className="titulo-resumen" component="h3" variant="h5">
        Resumen de hechos registrados
      </Typography>
      <Box className="resumen-caso">{resumenCaso.map(renderizarBotonesResumen)}</Box>
    </Box>
  )
}

export default ResumenHechos
