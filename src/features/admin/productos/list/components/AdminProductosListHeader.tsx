"use client"

import { useState } from "react"
import { IconSearch, IconPlus, IconAdjustments } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AgregarProductoDialog } from "./AgregarProductoDialog"
import { CambiarEstadoDialog } from "./CambiarEstadoDialog"
import type { useAdminProductosList } from "../hooks/useAdminProductosList"

interface AdminProductosListHeaderProps {
  searchQuery: string
  onSearchChange: (q: string) => void
  allProductos: ReturnType<typeof useAdminProductosList>["allProductos"]
  changeStatus: ReturnType<typeof useAdminProductosList>["changeStatus"]
  isUpdatingStatus: boolean
}

export function AdminProductosListHeader({
  searchQuery,
  onSearchChange,
  allProductos,
  changeStatus,
  isUpdatingStatus,
}: AdminProductosListHeaderProps) {
  const [agregarOpen, setAgregarOpen] = useState(false)
  const [estadoOpen, setEstadoOpen] = useState(false)

  return (
    <>
      <div className="space-y-4 md:space-y-6">
        {/* Row 1: title + agregar */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Productos</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Gestiona el catálogo de productos de Sweet Lab
            </p>
          </div>
          <Button onClick={() => setAgregarOpen(true)} className="shrink-0">
            <IconPlus className="h-4 w-4 mr-1" />
            Agregar producto
          </Button>
        </div>

        {/* Row 2: search + cambiar estado */}
        <div className="flex items-center justify-between gap-2">
          <div className="relative w-full sm:w-72">
            <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button variant="outline" onClick={() => setEstadoOpen(true)} className="shrink-0">
            <IconAdjustments className="h-4 w-4 mr-1" />
            Cambiar estado
          </Button>
        </div>
      </div>

      <AgregarProductoDialog open={agregarOpen} onOpenChange={setAgregarOpen} />
      <CambiarEstadoDialog
        open={estadoOpen}
        onOpenChange={setEstadoOpen}
        allProductos={allProductos}
        changeStatus={changeStatus}
        isUpdatingStatus={isUpdatingStatus}
      />
    </>
  )
}
