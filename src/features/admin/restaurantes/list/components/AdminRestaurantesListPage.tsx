"use client"

import { useAdminRestaurantesList } from "../hooks/useAdminRestaurantesList"
import { AdminRestaurantesListHeader } from "./AdminRestaurantesListHeader"
import { AdminRestaurantesListTable } from "./AdminRestaurantesListTable"

export function AdminRestaurantesListPage() {
  const listState = useAdminRestaurantesList()

  return (
    <div className="space-y-6 px-2 py-2 md:px-4 xl:px-8">
      <AdminRestaurantesListHeader
        searchQuery={listState.searchQuery}
        onSearchChange={listState.setSearchQuery}
      />
      <AdminRestaurantesListTable listState={listState} />
    </div>
  )
}
