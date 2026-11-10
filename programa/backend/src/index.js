import cors from 'cors'
import express from 'express'
import {
  consultarEventoCaso,
  consultarExplicacionesCaso,
  consultarInformacionCaso,
  consultarIntervaloMovimientos,
  consultarMovimientoPuntual,
  investigarPersona,
  consultarPosiblesResponsablesCaso,
  resolverCaso,
  consultarEvidenciasCaso,
  consultarLugaresCaso,
  consultarMovimientosCaso,
  consultarObjetosCaso,
  consultarTestimoniosCaso,
} from './controllers/investigacion.controller.js'
import { consultarPersonasCaso } from './controllers/personas.controller.js'

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/api/caso/informacion', consultarInformacionCaso)
app.get('/api/caso/evento', consultarEventoCaso)
app.get('/api/caso/posibles-responsables', consultarPosiblesResponsablesCaso)
app.post('/api/caso/explicaciones', consultarExplicacionesCaso)
app.post('/api/caso/investigar-persona', investigarPersona)
app.post('/api/caso/movimiento-hora', consultarMovimientoPuntual)
app.post('/api/caso/movimientos-intervalo', consultarIntervaloMovimientos)
app.get('/api/caso/resolver', resolverCaso)
app.get('/api/caso/lugares', consultarLugaresCaso)
app.get('/api/caso/objetos', consultarObjetosCaso)
app.get('/api/caso/evidencias', consultarEvidenciasCaso)
app.get('/api/caso/movimientos', consultarMovimientosCaso)
app.get('/api/caso/testimonios', consultarTestimoniosCaso)
app.get('/api/caso/personas', consultarPersonasCaso)

app.listen(port, () => {
  console.log(`El servidor ha iniciado (ejecutándose en http://localhost:${port}).`)
})
