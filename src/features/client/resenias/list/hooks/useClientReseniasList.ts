"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query"
import {
  getClientResenias,
  createResenia,
  deleteResenia,
  deleteReseniasBulk,
} from "../../client-resenias-api"
import { getClientRecentOrders } from "@/features/client/pedidos/client-pedidos-api"
import type { CreateReseniaInput } from "../../shared/types"

export function useClientReseniasList() {
  const queryClient = useQueryClient()
  const userId = typeof window !== "undefined" ? (localStorage.getItem("_id") ?? "") : ""

  // Filters
  const [searchQuery, setSearchQuery] = useState("")

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Selection mode (bulk delete)
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["client", "resenias", "list", { searchQuery, currentPage, pageSize, userId }],
    queryFn: () =>
      getClientResenias({
        userId,
        page: currentPage,
        pageSize,
        q: searchQuery || undefined,
      }),
    staleTime: 2 * 60 * 1000,
    placeholderData: keepPreviousData,
    enabled: Boolean(userId),
  })

  const { data: pedidosRecientes = [] } = useQuery({
    queryKey: ["client", "pedidos", "recientes", userId],
    queryFn: () => getClientRecentOrders(userId),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(userId),
  })

  const resenias = data?.data ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const invalidateList = () =>
    void queryClient.invalidateQueries({ queryKey: ["client", "resenias", "list"] })

  const { mutate: submitCreate, isPending: isCreating } = useMutation({
    mutationFn: (input: CreateReseniaInput) => createResenia(input),
    onSuccess: invalidateList,
  })

  const { mutate: submitDelete, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteResenia(id),
    onSuccess: invalidateList,
  })

  const { mutate: submitBulkDelete, isPending: isBulkDeleting } = useMutation({
    mutationFn: (ids: string[]) => deleteReseniasBulk(ids),
    onSuccess: () => {
      cancelSelectionMode()
      invalidateList()
    },
  })

  // Pagination handlers
  const handlePageChange = (page: number) => setCurrentPage(page)
  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  // Search handler
  const handleSearchChange = (q: string) => {
    setSearchQuery(q)
    setCurrentPage(1)
  }

  // Selection handlers
  const enterSelectionMode = () => {
    setSelectionMode(true)
    setSelectedIds(new Set())
  }

  const cancelSelectionMode = () => {
    setSelectionMode(false)
    setSelectedIds(new Set())
  }

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === resenias.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(resenias.map((r) => r._id)))
    }
  }

  const confirmBulkDelete = () => {
    if (selectedIds.size === 0) return
    submitBulkDelete(Array.from(selectedIds))
  }

  return {
    resenias,
    isLoading: isLoading || isFetching,
    error,
    refetch,

    // Search
    searchQuery,
    setSearchQuery: handleSearchChange,

    // Pagination
    currentPage,
    pageSize,
    total,
    totalPages,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,

    // Create
    userId,
    createResenia: submitCreate,
    isCreating,
    pedidosRecientes,

    // Delete single
    deleteResenia: submitDelete,
    isDeleting,

    // Selection / bulk delete
    selectionMode,
    selectedIds,
    enterSelectionMode,
    cancelSelectionMode,
    toggleSelection,
    toggleSelectAll,
    confirmBulkDelete,
    isBulkDeleting,
  }
}
