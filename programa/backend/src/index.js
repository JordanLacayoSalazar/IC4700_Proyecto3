import cors from 'cors'
import express from 'express'
import {
  consultarInformacionCaso,
  consultarPersonasCaso,
} from './controllers/caso.controller.js'

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get('/api/caso/informacion', consultarInformacionCaso)
app.get('/api/caso/personas', consultarPersonasCaso)

app.listen(port, () => {
  console.log(`El servidor ha iniciado (ejecutándose en http://localhost:${port}).`)
})
