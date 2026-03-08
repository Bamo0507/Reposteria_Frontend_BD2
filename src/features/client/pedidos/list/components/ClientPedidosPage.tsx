"use client"

import { useClientPedidosList } from "../hooks/useClientPedidosList"
import { ClientPedidosListHeader } from "./ClientPedidosListHeader"
import { ClientPedidosListTable } from "./ClientPedidosListTable"

export function ClientPedidosPage() {
  const listState = useClientPedidosList()

  return (
    <div className="space-y-6">
      <ClientPedidosListHeader listState={listState} />
      <ClientPedidosListTable listState={listState} />
    </div>
  )
}
