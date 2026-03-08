// Estado helpers re-exported from shared
export type { PedidoEstado, EstadoColorKey } from "@/features/shared/types/pedido.type"
export {
  getPedidoEstadoLabel,
  getPedidoEstadoColorKey,
  ESTADO_COLOR_CLASSES,
  PEDIDO_ESTADOS,
} from "@/features/shared/types/pedido.type"

import type { PedidoEstado } from "@/features/shared/types/pedido.type"

export interface PedidoProducto {
  nombre: string
  cantidad: number
  precio_unitario: number
}

export interface Pedido {
  _id: string
  fecha_pedido: string
  nombre_usuario: string
  nombre_restaurante: string
  total: number
  estado: PedidoEstado
}

export interface PedidoDetalle extends Pedido {
  productos: PedidoProducto[]
}
