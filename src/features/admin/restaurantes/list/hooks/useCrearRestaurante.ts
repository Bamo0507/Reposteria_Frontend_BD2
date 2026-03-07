"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createRestaurante } from "../../admin-restaurantes-api"

export function useCrearRestaurante(onSuccess: () => void) {
  const queryClient = useQueryClient()

  const { mutate: crear, isPending: isCreating } = useMutation({
    mutationFn: createRestaurante,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "restaurantes", "list"] })
      onSuccess()
    },
  })

  return { crear, isCreating }
}
