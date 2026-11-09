import { Box, Button, Typography } from '@mui/material'
import { OpenInNewOutlined } from '@mui/icons-material'

const resumenCaso = [
  { clave: 'personas', etiqueta: 'Personas', color: 1 },
  { clave: 'lugares', etiqueta: 'Lugares', color: 2 },
  { clave: 'objetos', etiqueta: 'Objetos', color: 3 },
  { clave: 'evidencias', etiqueta: 'Evidencias', color: 4 },
  { clave: 'movimientos', etiqueta: 'Movimientos', color: 5 },
  { clave: 'testimonios', etiqueta: 'Testimonios', color: 6 },
  { clave: 'accesos', etiqueta: 'Accesos', color: 7 },
]

/**
 * Entradas: valor que debería contener la cantidad recibida.
 * Salidas: entero no negativo o el texto "No disponible".
 * Restricciones: no calcula cantidades a partir de arreglos; solo acepta enteros no negativos.
 * Objetivo: obtener el total recibido desde el backend para mostrarlo en el panel.
 */
function mostrarCantidad(valor) {
  if (Number.isInteger(valor) && valor >= 0) return valor
  return 'No disponible'
}

/**
 * Entradas: evento como cadena o como objeto con propiedad nombre.
 * Salidas: nombre del evento o "No disponible" si no se recibió uno válido.
 * Restricciones: solo reconoce cadenas y objetos cuyo nombre sea una cadena.
 * Objetivo: obtener el nombre del evento desde el backend para mostrarlo en el panel.
 */
function obtenerNombreEvento(evento) {
  if (typeof evento === 'string') return evento
  if (evento && typeof evento.nombre === 'string') return evento.nombre
  return 'No disponible'
}

/**
 * Entradas: datosCaso opcionales, cantidadPersonas recibida del backend y callback onVerPersonas.
 * Salidas: JSX con el evento central y tarjetas resumen de las categorías del caso.
 * Restricciones: muestra "No disponible" para conteos ausentes o inválidos; solo la tarjeta
 * Personas ejecuta onVerPersonas.
 * Objetivo: presentar el resumen del caso y permitir abrir el detalle de personas.
 */
function PanelDatos({ datosCaso, cantidadPersonas, onVerPersonas }) {
  /**
   * Entradas: configuración de una categoría del resumen.
   * Salidas: botón JSX con etiqueta, cantidad e indicador para ver detalles.
   * Restricciones: solo la categoría personas recibe el callback onVerPersonas.
   * Objetivo: renderizar una tarjeta del resumen del caso.
   */
  function renderizarResumen({ clave, etiqueta, color }) {
    return (
      <Button
        className={`boton-resumen color-boton-${color}`}
        key={clave}
        onClick={clave === 'personas' ? onVerPersonas : undefined}
        type="button"
      >
        <span className="texto-resumen">{etiqueta}</span>
        <span className="cantidad-resumen">
          {clave === 'personas'
            ? mostrarCantidad(cantidadPersonas)
            : mostrarCantidad(datosCaso?.[clave])}
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
        Evento central
      </Typography>
      <Typography className="nombre-evento" id="titulo-caso" component="h2" variant="h3">
        {obtenerNombreEvento(datosCaso?.evento)}
      </Typography>

      <Typography className="titulo-resumen" component="h3" variant="h5">
        Resumen de hechos registrados
      </Typography>
      <Box className="resumen-caso">{resumenCaso.map(renderizarResumen)}</Box>
    </Box>
  )
}

export default PanelDatos
