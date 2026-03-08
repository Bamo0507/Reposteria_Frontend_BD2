"use client"

import { useQuery } from "@tanstack/react-query"
import { getClientOrderById } from "../../client-pedidos-api"

export function useClientPedidoDetail(id: string) {
  return useQuery({
    queryKey: ["client", "pedidos", id],
    queryFn: () => getClientOrderById(id),
    staleTime: 2 * 60 * 1000,
  })
}
