import cors from 'cors'
import express from 'express'
import {
  consultarInformacionCaso,
  consultarEvidenciasCaso,
  consultarLugaresCaso,
  consultarObjetosCaso,
} from './controllers/investigacion.controller.js'
import { consultarPersonasCaso } from './controllers/personas.controller.js'

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/api/caso/informacion', consultarInformacionCaso)
app.get('/api/caso/lugares', consultarLugaresCaso)
app.get('/api/caso/objetos', consultarObjetosCaso)
app.get('/api/caso/evidencias', consultarEvidenciasCaso)
app.get('/api/caso/personas', consultarPersonasCaso)

app.listen(port, () => {
  console.log(`El servidor ha iniciado (ejecutándose en http://localhost:${port}).`)
})
