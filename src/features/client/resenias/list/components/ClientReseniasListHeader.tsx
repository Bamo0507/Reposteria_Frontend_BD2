"use client"

import { useState } from "react"
import { IconSearch, IconPlus, IconTrash, IconX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AgregarReseniaDialog } from "./AgregarReseniaDialog"
import type { useClientReseniasList } from "../hooks/useClientReseniasList"

interface ClientReseniasListHeaderProps {
  listState: ReturnType<typeof useClientReseniasList>
}

export function ClientReseniasListHeader({ listState }: ClientReseniasListHeaderProps) {
  const {
    searchQuery,
    setSearchQuery,
    selectionMode,
    selectedIds,
    enterSelectionMode,
    cancelSelectionMode,
    confirmBulkDelete,
    isBulkDeleting,
    userId,
    createResenia,
    isCreating,
    pedidosRecientes,
  } = listState

  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <div className="space-y-4 md:space-y-6">
        {/* Row 1: title + agregar */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Mis Reseñas</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Consulta y gestiona tus reseñas
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="shrink-0">
            <IconPlus className="h-4 w-4 mr-1" />
            Nueva reseña
          </Button>
        </div>

        {/* Row 2: search + eliminar */}
        <div className="flex items-center justify-between gap-2">
          <div className="relative w-full sm:w-72">
            <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título o descripción…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          {!selectionMode ? (
            <Button variant="outline" onClick={enterSelectionMode} className="shrink-0">
              <IconTrash className="h-4 w-4 mr-1" />
              Eliminar reseñas
            </Button>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="ghost" size="sm" onClick={cancelSelectionMode} disabled={isBulkDeleting}>
                <IconX className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={confirmBulkDelete}
                disabled={selectedIds.size === 0 || isBulkDeleting}
              >
                <IconTrash className="h-4 w-4 mr-1" />
                {isBulkDeleting
                  ? "Eliminando…"
                  : `Eliminar${selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}`}
              </Button>
            </div>
          )}
        </div>
      </div>

      <AgregarReseniaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        userId={userId}
        createResenia={createResenia}
        isCreating={isCreating}
        pedidosRecientes={pedidosRecientes}
      />
    </>
  )
}
