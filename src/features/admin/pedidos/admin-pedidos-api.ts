import { apiClient } from "@/lib/api/apiClient"
import type { Pedido, PedidoDetalle, PedidoEstado } from "./shared/types/pedido.type"

export interface GetOrdersParams {
  page?: number
  pageSize?: number
  fechaInicio?: string
  fechaFin?: string
}

export interface OrdersResponse {
  data: Pedido[]
  total: number
}

// getOrders necesita el campo `total` que apiClient descarta al extraer `.data`,
// así que usa fetch directamente para obtener la respuesta completa.
export async function getOrders(params?: GetOrdersParams): Promise<OrdersResponse> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL no está definida")

  const query = new URLSearchParams({
    page: String(params?.page ?? 1),
    pageSize: String(params?.pageSize ?? 10),
  })
  if (params?.fechaInicio) query.set("fechaInicio", params.fechaInicio)
  if (params?.fechaFin) query.set("fechaFin", params.fechaFin)

  const response = await fetch(`${API_URL}/admin/pedidos?${query.toString()}`)
  if (!response.ok) {
    const json = await response.json().catch(() => null) as { message?: string } | null
    throw new Error(json?.message ?? `Error ${response.status}: ${response.statusText}`)
  }
  return response.json() as Promise<OrdersResponse>
}

export async function getOrderById(id: string): Promise<PedidoDetalle> {
  return apiClient.get<PedidoDetalle>(`/admin/pedidos/${id}`)
}

export async function updateOrderStatus(
  id: string,
  estado: PedidoEstado
): Promise<void> {
  return apiClient.put<void>(`/admin/pedidos/${id}/estado`, { estado })
}
