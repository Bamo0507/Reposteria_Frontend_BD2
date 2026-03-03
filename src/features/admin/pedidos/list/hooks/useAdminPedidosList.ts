"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import type { DateRange } from "react-day-picker"
import { getOrders, updateOrderStatus } from "../../admin-pedidos-api"
import type { PedidoEstado } from "../../shared/types/pedido.type"

export function useAdminPedidosList() {
  const queryClient = useQueryClient()

  // Filters
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const fechaInicio = dateRange?.from?.toISOString()
  const fechaFin = dateRange?.to?.toISOString()

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin", "pedidos", "list", { fechaInicio, fechaFin, currentPage, pageSize }],
    queryFn: () => getOrders({ page: currentPage, pageSize, fechaInicio, fechaFin }),
    staleTime: 2 * 60 * 1000,
    placeholderData: keepPreviousData,
  })

  const pedidos = data?.data ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const {
    mutate: changeStatus,
    isPending: isUpdatingStatus,
  } = useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: PedidoEstado }) =>
      updateOrderStatus(id, estado),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "pedidos", "list"] })
    },
  })

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setDateRange(undefined)
    setCurrentPage(1)
  }

  const hasFilters = Boolean(dateRange?.from || dateRange?.to)

  return {
    pedidos,
    isLoading: isLoading || isFetching,
    error,
    refetch,

    // Filters
    dateRange,
    setDateRange: handleDateRangeChange,
    hasFilters,
    clearFilters,

    // Pagination
    currentPage,
    pageSize,
    total,
    totalPages,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,

    // Status mutation
    changeStatus,
    isUpdatingStatus,
  }
}
