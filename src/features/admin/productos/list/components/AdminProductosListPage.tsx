"use client"

import { useAdminProductosList } from "../hooks/useAdminProductosList"
import { AdminProductosListHeader } from "./AdminProductosListHeader"
import { AdminProductosGrid } from "./AdminProductosGrid"

export function AdminProductosListPage() {
  const listState = useAdminProductosList()

  return (
    <div className="space-y-6 px-2 py-2 md:px-4 xl:px-8">
      <AdminProductosListHeader
        searchQuery={listState.searchQuery}
        onSearchChange={listState.setSearchQuery}
        allProductos={listState.allProductos}
        changeStatus={listState.changeStatus}
        isUpdatingStatus={listState.isUpdatingStatus}
      />
      <AdminProductosGrid listState={listState} />
    </div>
  )
}
