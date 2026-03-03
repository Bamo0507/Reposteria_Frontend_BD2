"use client"

import { useAdminPedidosList } from "../hooks/useAdminPedidosList"
import { AdminPedidosListHeader } from "./AdminPedidosListHeader"
import { AdminPedidosListTable } from "./AdminPedidosListTable"

export function AdminPedidosListPage() {
  const listState = useAdminPedidosList()

  return (
    <div className="space-y-6 px-2 py-2 md:px-4 xl:px-8">
      <AdminPedidosListHeader
        dateRange={listState.dateRange}
        onDateRangeChange={listState.setDateRange}
        hasFilters={listState.hasFilters}
        onClearFilters={listState.clearFilters}
      />
      <AdminPedidosListTable listState={listState} />
    </div>
  )
}
