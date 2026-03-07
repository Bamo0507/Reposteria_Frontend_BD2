"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getRestauranteById, updateRestaurante } from "../../admin-restaurantes-api"
import type { UpdateRestauranteInput } from "../../shared/types/restaurante.type"

export function useAdminRestauranteDetail(id: string) {
  const queryClient = useQueryClient()

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "restaurantes", "detail", id] })
    void queryClient.invalidateQueries({ queryKey: ["admin", "restaurantes", "list"] })
  }

  const query = useQuery({
    queryKey: ["admin", "restaurantes", "detail", id],
    queryFn: () => getRestauranteById(id),
    staleTime: 2 * 60 * 1000,
    enabled: Boolean(id),
  })

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: (input: UpdateRestauranteInput) => updateRestaurante(id, input),
    onSuccess: invalidate,
  })

  return { ...query, update, isUpdating }
}
