"use client"

import { useClientPedidosList } from "../list/hooks/useClientPedidosList"
import { ClientPedidosListHeader } from "../list/components/ClientPedidosListHeader"
import { ClientPedidosListTable } from "../list/components/ClientPedidosListTable"

export function ClientPedidosPage() {
  const listState = useClientPedidosList()

  return (
    <div className="space-y-6">
      <ClientPedidosListHeader listState={listState} />
      <ClientPedidosListTable listState={listState} />
    </div>
  )
}
