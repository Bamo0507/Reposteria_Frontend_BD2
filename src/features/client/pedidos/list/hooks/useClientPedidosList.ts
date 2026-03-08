"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import type { DateRange } from "react-day-picker"
import {
  getClientOrders,
  getRestaurantNames,
  getAvailableProducts,
  createOrder,
} from "../../client-pedidos-api"
import type { CreatePedidoInput } from "../../shared/types"

export function useClientPedidosList() {
  const queryClient = useQueryClient()
  const userId = typeof window !== "undefined" ? (localStorage.getItem("_id") ?? "") : ""

  // Filters
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const fechaInicio = dateRange?.from?.toISOString()
  const fechaFin = (() => {
    if (!dateRange?.from) return undefined
    const from = dateRange.from
    const to = dateRange.to
    const sameDay = !to || to.toDateString() === from.toDateString()
    return sameDay
      ? new Date(from.getFullYear(), from.getMonth(), from.getDate() + 1).toISOString()
      : to.toISOString()
  })()

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["client", "pedidos", "list", { fechaInicio, fechaFin, currentPage, pageSize, userId }],
    queryFn: () => getClientOrders({ userId, page: currentPage, pageSize, fechaInicio, fechaFin }),
    staleTime: 2 * 60 * 1000,
    placeholderData: keepPreviousData,
    enabled: Boolean(userId),
  })

  const { data: restauranteOptions = [] } = useQuery({
    queryKey: ["client", "pedidos", "restaurantes"],
    queryFn: getRestaurantNames,
    staleTime: 5 * 60 * 1000,
  })

  const { data: productoOptions = [] } = useQuery({
    queryKey: ["client", "pedidos", "productos"],
    queryFn: getAvailableProducts,
    staleTime: 5 * 60 * 1000,
  })

  const pedidos = data?.data ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const { mutate: submitCreateOrder, isPending: isCreating } = useMutation({
    mutationFn: (input: CreatePedidoInput) => createOrder(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["client", "pedidos", "list"] })
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

    // Create order
    userId,
    createOrder: submitCreateOrder,
    isCreating,
    restauranteOptions,
    productoOptions,
  }
}
