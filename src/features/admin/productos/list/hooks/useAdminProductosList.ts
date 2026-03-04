"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProducts, updateProductsStatus } from "../../admin-productos-api"
import type { UpdateProductsStatusInput } from "../../shared/types/producto.type"

export function useAdminProductosList() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "productos", "list"],
    queryFn: getProducts,
    staleTime: 2 * 60 * 1000,
  })

  const productos = useMemo(() => data ?? [], [data])

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return productos
    const q = searchQuery.toLowerCase()
    return productos.filter((p) => p.nombre.toLowerCase().includes(q))
  }, [productos, searchQuery])

  const { mutate: changeStatus, isPending: isUpdatingStatus } = useMutation({
    mutationFn: (input: UpdateProductsStatusInput) => updateProductsStatus(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "productos", "list"] })
    },
  })

  return {
    productos: filtered,
    allProductos: productos,
    isLoading,
    error,
    refetch,
    searchQuery,
    setSearchQuery,
    changeStatus,
    isUpdatingStatus,
  }
}
