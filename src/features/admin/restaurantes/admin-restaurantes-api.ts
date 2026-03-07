import { apiClient } from "@/lib/api/apiClient"
import type {
  Restaurante,
  RestauranteDetalle,
  CreateRestauranteInput,
  UpdateRestauranteInput,
} from "./shared/types/restaurante.type"

export async function getRestaurantes(): Promise<Restaurante[]> {
  return apiClient.get<Restaurante[]>("/admin/restaurantes")
}

export async function getRestauranteById(id: string): Promise<RestauranteDetalle> {
  return apiClient.get<RestauranteDetalle>(`/admin/restaurantes/${id}`)
}

export async function createRestaurante(input: CreateRestauranteInput): Promise<void> {
  return apiClient.post<void>("/admin/restaurantes", input)
}

export async function updateRestaurante(id: string, input: UpdateRestauranteInput): Promise<void> {
  return apiClient.put<void>(`/admin/restaurantes/${id}`, input)
}
