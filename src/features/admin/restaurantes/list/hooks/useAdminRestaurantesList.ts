"use client"

import { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getRestaurantes, updateRestaurante } from "../../admin-restaurantes-api"

export function useAdminRestaurantesList() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin", "restaurantes", "list"],
    queryFn: getRestaurantes,
    staleTime: 2 * 60 * 1000,
  })

  const allRestaurantes = useMemo(() => data ?? [], [data])

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return allRestaurantes
    const query = searchQuery.toLowerCase()
    return allRestaurantes.filter((restaurante) => restaurante.nombre_restaurante.toLowerCase().includes(query))
  }, [allRestaurantes, searchQuery])

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const restaurantes = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, currentPage, pageSize])

  const { mutate: toggleStatus, isPending: isTogglingStatus } = useMutation({
    mutationFn: ({ id, esActivo }: { id: string; esActivo: boolean }) =>
      updateRestaurante(id, { esActivo: !esActivo }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "restaurantes", "list"] })
    },
  })

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  return {
    restaurantes,
    isLoading,
    error,
    refetch,
    searchQuery,
    setSearchQuery: handleSearchChange,
    toggleStatus,
    isTogglingStatus,
    currentPage,
    pageSize,
    total,
    totalPages,
    onPageChange: setCurrentPage,
    onPageSizeChange: handlePageSizeChange,
  }
}
