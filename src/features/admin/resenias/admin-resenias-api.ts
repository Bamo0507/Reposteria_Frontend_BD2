import { apiClient } from "@/lib/api/apiClient"
import type { Resenia, ReseniaDetalle } from "./shared/types/resenia.type"

export interface GetReseniasParams {
  page?: number
  pageSize?: number
  puntuacion?: number
  fechaInicio?: string
  fechaFin?: string
  q?: string
}

export interface ReseniasResponse {
  data: Resenia[]
  total: number
}

// getResenias uses fetch directly to preserve the { data, total } envelope
export async function getResenias(params?: GetReseniasParams): Promise<ReseniasResponse> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL no está definida")

  const query = new URLSearchParams({
    page: String(params?.page ?? 1),
    pageSize: String(params?.pageSize ?? 10),
  })
  if (params?.puntuacion) query.set("puntuacion", String(params.puntuacion))
  if (params?.fechaInicio) query.set("fechaInicio", params.fechaInicio)
  if (params?.fechaFin) query.set("fechaFin", params.fechaFin)
  if (params?.q) query.set("q", params.q)

  const response = await fetch(`${API_URL}/admin/resenias?${query.toString()}`)
  if (!response.ok) {
    const json = await response.json().catch(() => null) as { message?: string } | null
    throw new Error(json?.message ?? `Error ${response.status}: ${response.statusText}`)
  }
  return response.json() as Promise<ReseniasResponse>
}

export async function getReseniaById(id: string): Promise<ReseniaDetalle> {
  return apiClient.get<ReseniaDetalle>(`/admin/resenias/${id}`)
}
