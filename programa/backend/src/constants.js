import { fileURLToPath } from 'node:url'

export const ARCHIVO_MAIN_PROLOG = fileURLToPath(
  new URL('../../prolog/main.pl', import.meta.url),
)
export const UTF_ENCODING = 'utf8'
export const MAX_BUFFER_TAMANO = 1024 * 1024
export const TIMEOUT_MILISEGUNDOS = 15000
export const IMAGENES_PERSONAS = [
  'Banana','Black', 'Blue', 'Brown',
  'Cyan', 'Coral', 'Gray',
  'Green', 'Lime', 'Maroon', 'Olive',
  'Orange', 'Pink', 'Purple', 'Red',
  'Rose', 'Tan', 'White', 'Yellow'
]
export const IMAGEN_PERSONA_DEFAULT = IMAGENES_PERSONAS[0]
