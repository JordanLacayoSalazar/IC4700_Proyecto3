import { Box, Button, Typography } from '@mui/material'
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined'
import { motion } from 'motion/react'
import bienvenidaImg from '../assets/bienvenida.png'
import './bienvenida.css'

function Bienvenida({ onEmpezar }) {
  return (
    <Box component="section" className="pagina-bienvenida" aria-labelledby="titulo-proyecto">
      <motion.img
        className="fondo-bienvenida"
        src={bienvenidaImg}
        alt=""
        aria-hidden="true"
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <Box className="sombra-bienvenida" aria-hidden="true" />

      <motion.main
        className="contenido-bienvenida"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.55, ease: 'easeOut' }}
      >
        <Typography className="nombre-instituto" variant="h6" component="p">
          Instituto Tecnológico de Costa Rica
        </Typography>
        <Typography className="nombre-curso" variant="body1" component="p">
          IC4700 - Lenguajes de Programación
        </Typography>
        <Typography className="titulo-proyecto" variant="h1" component="h1">
          Academia Detectives
        </Typography>
        <Typography className="numero-proyecto" variant="overline" component="p">
          Proyecto 3
        </Typography>

        <Box className="seccion-integrantes">
          <Typography variant="body1" className="titulo-integrantes">
            Integrantes:
          </Typography>
          <Typography className="nombres-integrantes" variant="body1">
            Jordan Lacayo, Jeremy Montero y David Fernández
          </Typography>
        </Box>

        <Button
          className="boton-investigacion"
          onClick={onEmpezar}
          startIcon={<RocketLaunchOutlinedIcon />}
          type="button"
        >
          Empezar investigación
        </Button>
      </motion.main>
    </Box>
  )
}

export default Bienvenida
