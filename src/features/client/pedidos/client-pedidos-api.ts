import { apiClient } from "@/lib/api/apiClient"
import type {
  ClientPedido,
  ClientPedidoDetalle,
  RestauranteOption,
  ProductoOption,
  CreatePedidoInput,
} from "./shared/types"

export interface GetClientOrdersParams {
  userId: string
  page?: number
  pageSize?: number
  fechaInicio?: string
  fechaFin?: string
}

export interface ClientOrdersResponse {
  data: ClientPedido[]
  total: number
}

// getClientOrders necesita el campo `total` que apiClient descarta al extraer `.data`,
// así que usa fetch directamente para obtener la respuesta completa.
export async function getClientOrders(
  params: GetClientOrdersParams
): Promise<ClientOrdersResponse> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL no está definida")

  const query = new URLSearchParams({
    userId: params.userId,
    page: String(params.page ?? 1),
    pageSize: String(params.pageSize ?? 10),
  })
  if (params.fechaInicio) query.set("fechaInicio", params.fechaInicio)
  if (params.fechaFin) query.set("fechaFin", params.fechaFin)

  const response = await fetch(`${API_URL}/cliente/pedidos?${query.toString()}`)
  if (!response.ok) {
    const json = await response.json().catch(() => null) as { message?: string } | null
    throw new Error(json?.message ?? `Error ${response.status}: ${response.statusText}`)
  }
  return response.json() as Promise<ClientOrdersResponse>
}

export async function getClientOrderById(id: string): Promise<ClientPedidoDetalle> {
  return apiClient.get<ClientPedidoDetalle>(`/cliente/pedidos/${id}`)
}

export async function createOrder(input: CreatePedidoInput): Promise<void> {
  return apiClient.post<void>("/cliente/pedidos", input)
}

export async function getRestaurantNames(): Promise<RestauranteOption[]> {
  return apiClient.get<RestauranteOption[]>("/cliente/pedidos/restaurantes")
}

export async function getAvailableProducts(): Promise<ProductoOption[]> {
  return apiClient.get<ProductoOption[]>("/cliente/pedidos/productos")
}
