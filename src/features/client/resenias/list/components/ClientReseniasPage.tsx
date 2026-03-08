"use client"

import { useClientReseniasList } from "../hooks/useClientReseniasList"
import { ClientReseniasListHeader } from "./ClientReseniasListHeader"
import { ClientReseniasListTable } from "./ClientReseniasListTable"

export function ClientReseniasPage() {
  const listState = useClientReseniasList()

  return (
    <div className="space-y-6">
      <ClientReseniasListHeader listState={listState} />
      <ClientReseniasListTable listState={listState} />
    </div>
  )
}
