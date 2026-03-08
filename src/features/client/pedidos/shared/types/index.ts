// Estado helpers shared with admin
export type { PedidoEstado as ClientPedidoEstado, EstadoColorKey } from "@/features/shared/types/pedido.type"
export {
  getPedidoEstadoLabel as getClientPedidoEstadoLabel,
  getPedidoEstadoColorKey as getClientPedidoEstadoColorKey,
  ESTADO_COLOR_CLASSES,
  PEDIDO_ESTADOS,
} from "@/features/shared/types/pedido.type"

import type { PedidoEstado } from "@/features/shared/types/pedido.type"

export interface ClientPedidoProducto {
  nombre: string
  cantidad: number
  precio_unitario: number
}

export interface ClientPedido {
  _id: string
  fecha_pedido: string
  nombre_restaurante: string
  total: number
  estado: PedidoEstado
}

export interface ClientPedidoDetalle extends ClientPedido {
  productos: ClientPedidoProducto[]
}

export interface RestauranteOption {
  _id: string
  nombre_restaurante: string
}

export interface ProductoOption {
  _id: string
  nombre: string
  precio: number
}

export interface CreatePedidoInput {
  id_usuario: string
  id_restaurante: string
  productos: {
    producto_id: string
    cantidad: number
    precio_unitario: number
  }[]
}
