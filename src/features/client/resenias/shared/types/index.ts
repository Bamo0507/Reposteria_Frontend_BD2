export interface ClientResenia {
  _id: string
  titulo: string
  descripcion: string
  nombre_restaurante: string
  fecha_pedido: string
  puntuacion: number
  fecha: string
}

export interface ClientReseniaDetalle {
  _id: string
  titulo: string
  descripcion: string
  puntuacion: number
  fecha: string
  nombre_restaurante: string
  fecha_pedido: string
}

export interface CreateReseniaInput {
  titulo: string
  id_usuario: string
  id_restaurante: string
  id_pedido: string
  descripcion: string
  puntuacion: number
}

export interface UpdateReseniaInput {
  titulo?: string
  descripcion?: string
  puntuacion?: number
}
