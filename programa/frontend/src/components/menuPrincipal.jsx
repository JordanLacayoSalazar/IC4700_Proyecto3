import {
  AccessTimeOutlined,
  GroupsOutlined,
  InfoOutlined,
  LightbulbOutlined,
  LogoutOutlined,
  OpenInNewOutlined,
  PersonSearchOutlined,
  GavelOutlined,
  HistoryToggleOffOutlined,
} from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'
import detectiveImg from '../assets/detective-1.png'
import './menuPrincipal.css'

const opcionesMenu = [
  { texto: 'Consultar información del caso', icono: InfoOutlined },
  { texto: 'Investigar a una persona', icono: PersonSearchOutlined },
  { texto: 'Obtener posibles responsables', icono: GroupsOutlined },
  { texto: 'Generar explicaciones', icono: LightbulbOutlined },
  { texto: 'Resolver el caso', icono: GavelOutlined },
  { texto: 'Consultar movimiento por hora', icono: AccessTimeOutlined },
  { texto: 'Consultar movimientos por intervalo', icono: HistoryToggleOffOutlined },
]

const resumenCaso = [
  { clave: 'personas', etiqueta: 'Personas', color: 1 },
  { clave: 'lugares', etiqueta: 'Lugares', color: 2 },
  { clave: 'objetos', etiqueta: 'Objetos', color: 3 },
  { clave: 'evidencias', etiqueta: 'Evidencias', color: 4 },
  { clave: 'movimientos', etiqueta: 'Movimientos', color: 5 },
  { clave: 'testimonios', etiqueta: 'Testimonios', color: 6 },
  { clave: 'accesos', etiqueta: 'Accesos', color: 7 },
]

function mostrarCantidad(valor) {
  if (Array.isArray(valor)) return valor.length
  if (Number.isInteger(valor) && valor >= 0) return valor
  return 'No disponible'
}

function obtenerNombreEvento(evento) {
  if (typeof evento === 'string') return evento
  if (evento && typeof evento.nombre === 'string') return evento.nombre
  return 'No disponible'
}

function MenuPrincipal({ datosCaso, onSalir }) {
  return (
    <Box component="main" className="menu-principal">
      <Box className="cabecera-menu">
        <Box className="marca-menu">
          <Box
            component="img"
            className="imagen-detective-menu"
            src={detectiveImg}
            alt=""
            aria-hidden="true"
          />
          <Typography className="titulo-menu" component="h1" variant="h4">
            Menú de investigación
          </Typography>
        </Box>
        <Button
          className="boton-salir"
          onClick={onSalir}
          startIcon={<LogoutOutlined />}
          type="button"
        >
          Salir
        </Button>
      </Box>

      <Box className="cuerpo-menu-principal">
        <Box component="nav" className="menu-opciones-lateral" aria-label="Opciones de investigación">
          <Box className="lista-opciones">
            {opcionesMenu.map(({ texto, icono: Icono }, indice) => (
              <Button
                className={`boton-opcion color-boton-${indice + 1}`}
                key={texto}
                startIcon={<Icono />}
                type="button"
              >
                {texto}
              </Button>
            ))}
          </Box>
        </Box>

        <Box component="section" className="panel-caso" aria-labelledby="titulo-caso">
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
            <Box className="resumen-caso">
              {resumenCaso.map(({ clave, etiqueta, color }) => (
                <Button
                  className={`boton-resumen color-boton-${color}`}
                  key={clave}
                  type="button"
                >
                  <span className="texto-resumen">{etiqueta}</span>
                  <span className="cantidad-resumen">{mostrarCantidad(datosCaso?.[clave])}</span>
                  <span className="enlace-detalles">
                    <span>Ver detalles</span>
                    <OpenInNewOutlined aria-hidden="true" />
                  </span>
                </Button>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default MenuPrincipal
