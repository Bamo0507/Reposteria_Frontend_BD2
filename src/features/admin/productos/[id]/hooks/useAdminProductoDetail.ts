"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProductById, updateProduct, updateProductsStatus } from "../../admin-productos-api"
import type { UpdateProductoInput } from "../../shared/types/producto.type"

export function useAdminProductoDetail(id: string) {
  const queryClient = useQueryClient()

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "productos", "detail", id] })
    void queryClient.invalidateQueries({ queryKey: ["admin", "productos", "list"] })
  }

  const query = useQuery({
    queryKey: ["admin", "productos", "detail", id],
    queryFn: () => getProductById(id),
    staleTime: 2 * 60 * 1000,
    enabled: Boolean(id),
  })

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: (input: UpdateProductoInput) => updateProduct(id, input),
    onSuccess: invalidate,
  })

  const { mutate: updateStatus, isPending: isUpdatingStatus } = useMutation({
    mutationFn: (esActivo: boolean) => updateProductsStatus({ ids: [id], esActivo }),
    onSuccess: invalidate,
  })

  return { ...query, update, isUpdating, updateStatus, isUpdatingStatus }
}
