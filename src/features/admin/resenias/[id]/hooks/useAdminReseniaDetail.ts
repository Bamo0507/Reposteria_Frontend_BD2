"use client"

import { useQuery } from "@tanstack/react-query"
import { getReseniaById } from "../../admin-resenias-api"

export function useAdminReseniaDetail(id: string) {
  return useQuery({
    queryKey: ["admin", "resenias", "detail", id],
    queryFn: () => getReseniaById(id),
    staleTime: 2 * 60 * 1000,
    enabled: Boolean(id),
  })
}
