"use client"

import { useState } from "react"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import type { DateRange } from "react-day-picker"
import { getResenias } from "../../admin-resenias-api"

export function useAdminReseniasList() {
  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [puntuacion, setPuntuacion] = useState<number | undefined>(undefined)

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
    queryKey: ["admin", "resenias", "list", { searchQuery, fechaInicio, fechaFin, puntuacion, currentPage, pageSize }],
    queryFn: () =>
      getResenias({
        page: currentPage,
        pageSize,
        fechaInicio,
        fechaFin,
        puntuacion,
        q: searchQuery || undefined,
      }),
    staleTime: 2 * 60 * 1000,
    placeholderData: keepPreviousData,
  })

  const resenias = data?.data ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

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

  const handleSearchChange = (q: string) => {
    setSearchQuery(q)
    setCurrentPage(1)
  }

  const handlePuntuacionChange = (value: number | undefined) => {
    setPuntuacion(value)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setDateRange(undefined)
    setPuntuacion(undefined)
    setCurrentPage(1)
  }

  const hasFilters = Boolean(searchQuery || dateRange?.from || dateRange?.to || puntuacion)

  return {
    resenias,
    isLoading: isLoading || isFetching,
    error,
    refetch,

    // Filters
    searchQuery,
    setSearchQuery: handleSearchChange,
    dateRange,
    setDateRange: handleDateRangeChange,
    puntuacion,
    setPuntuacion: handlePuntuacionChange,
    hasFilters,
    clearFilters,

    // Pagination
    currentPage,
    pageSize,
    total,
    totalPages,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
  }
}
