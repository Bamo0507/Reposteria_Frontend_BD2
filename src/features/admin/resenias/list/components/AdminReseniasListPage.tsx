"use client"

import { useAdminReseniasList } from "../hooks/useAdminReseniasList"
import { AdminReseniasListHeader } from "./AdminReseniasListHeader"
import { AdminReseniasListTable } from "./AdminReseniasListTable"

export function AdminReseniasListPage() {
  const listState = useAdminReseniasList()

  return (
    <div className="space-y-6 px-2 py-2 md:px-4 xl:px-8">
      <AdminReseniasListHeader
        searchQuery={listState.searchQuery}
        onSearchChange={listState.setSearchQuery}
        dateRange={listState.dateRange}
        onDateRangeChange={listState.setDateRange}
        puntuacion={listState.puntuacion}
        onPuntuacionChange={listState.setPuntuacion}
        hasFilters={listState.hasFilters}
        onClearFilters={listState.clearFilters}
      />
      <AdminReseniasListTable listState={listState} />
    </div>
  )
}
