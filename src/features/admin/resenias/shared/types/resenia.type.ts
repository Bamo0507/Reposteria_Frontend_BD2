export interface ReseniaProducto {
  nombre: string
  cantidad: number
  precio_unitario: number
}

export interface Resenia {
  _id: string
  titulo: string
  descripcion: string
  puntuacion: number
  fecha: string
}

export interface ReseniaDetalle extends Resenia {
  nombre_usuario: string
  nombre_restaurante: string
  total: number
  productos: ReseniaProducto[]
}

export const PUNTUACION_OPTIONS = [1, 2, 3, 4, 5] as const
export type Puntuacion = (typeof PUNTUACION_OPTIONS)[number]
