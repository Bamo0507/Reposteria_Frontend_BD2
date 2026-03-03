"use client"

import { useQuery } from "@tanstack/react-query"
import { getOrderById } from "../../admin-pedidos-api"

export function useAdminPedidoDetail(id: string) {
  return useQuery({
    queryKey: ["admin", "pedidos", "detail", id],
    queryFn: () => getOrderById(id),
    staleTime: 2 * 60 * 1000,
    enabled: Boolean(id),
  })
}
