"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getClientReseniaById, updateResenia } from "../../client-resenias-api"
import type { UpdateReseniaInput } from "../../shared/types"

export function useClientReseniaDetail(id: string) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ["client", "resenias", id],
    queryFn: () => getClientReseniaById(id),
    staleTime: 2 * 60 * 1000,
  })

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: (input: UpdateReseniaInput) => updateResenia(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["client", "resenias", id] })
      void queryClient.invalidateQueries({ queryKey: ["client", "resenias", "list"] })
    },
  })

  return { ...query, update, isUpdating }
}
