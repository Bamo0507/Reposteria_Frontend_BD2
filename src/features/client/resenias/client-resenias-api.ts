import { apiClient } from "@/lib/api/apiClient"
import type {
  ClientResenia,
  ClientReseniaDetalle,
  CreateReseniaInput,
  UpdateReseniaInput,
} from "./shared/types"

export interface GetClientReseniasParams {
  userId: string
  page?: number
  pageSize?: number
  q?: string
}

export interface ClientReseniasResponse {
  data: ClientResenia[]
  total: number
}

// getClientResenias necesita el campo `total` que apiClient descarta al extraer `.data`,
// así que usa fetch directamente para obtener la respuesta completa.
export async function getClientResenias(
  params: GetClientReseniasParams
): Promise<ClientReseniasResponse> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL no está definida")

  const query = new URLSearchParams({
    userId: params.userId,
    page: String(params.page ?? 1),
    pageSize: String(params.pageSize ?? 10),
  })
  if (params.q) query.set("q", params.q)

  const response = await fetch(`${API_URL}/cliente/resenias?${query.toString()}`)
  if (!response.ok) {
    const json = await response.json().catch(() => null) as { message?: string } | null
    throw new Error(json?.message ?? `Error ${response.status}: ${response.statusText}`)
  }
  return response.json() as Promise<ClientReseniasResponse>
}

export async function getClientReseniaById(id: string): Promise<ClientReseniaDetalle> {
  return apiClient.get<ClientReseniaDetalle>(`/cliente/resenias/${id}`)
}

export async function createResenia(input: CreateReseniaInput): Promise<void> {
  return apiClient.post<void>("/cliente/resenias", input)
}

export async function updateResenia(id: string, input: UpdateReseniaInput): Promise<void> {
  return apiClient.put<void>(`/cliente/resenias/${id}`, input)
}

export async function deleteResenia(id: string): Promise<void> {
  return apiClient.delete<void>(`/cliente/resenias/${id}`)
}

export async function deleteReseniasBulk(ids: string[]): Promise<void> {
  return apiClient.delete<void>("/cliente/resenias/bulk", { body: JSON.stringify({ ids }) })
}
