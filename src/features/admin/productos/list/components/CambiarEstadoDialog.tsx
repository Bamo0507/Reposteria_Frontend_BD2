"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Producto } from "../../shared/types/producto.type"
import type { useAdminProductosList } from "../hooks/useAdminProductosList"

interface CambiarEstadoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  allProductos: Producto[]
  changeStatus: ReturnType<typeof useAdminProductosList>["changeStatus"]
  isUpdatingStatus: boolean
}

export function CambiarEstadoDialog({
  open,
  onOpenChange,
  allProductos,
  changeStatus,
  isUpdatingStatus,
}: CambiarEstadoDialogProps) {
  const [esActivo, setEsActivo] = useState(true)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const toggleId = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    setSelectedIds((prev) =>
      prev.length === allProductos.length ? [] : allProductos.map((p) => p._id)
    )
  }

  const handleSubmit = () => {
    if (!selectedIds.length) return
    changeStatus(
      { ids: selectedIds, esActivo },
      {
        onSuccess: () => {
          setSelectedIds([])
          onOpenChange(false)
        },
      }
    )
  }

  const STATUS_BTN = (active: boolean) =>
    `flex-1 py-2 rounded-md text-sm font-medium border transition-colors ${
      esActivo === active
        ? "bg-primary text-primary-foreground border-primary"
        : "bg-background text-muted-foreground border-input hover:text-foreground"
    }`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cambiar estado de productos</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Status selector */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Nuevo estado</p>
            <div className="flex gap-2">
              <button className={STATUS_BTN(true)} onClick={() => setEsActivo(true)}>
                Activo
              </button>
              <button className={STATUS_BTN(false)} onClick={() => setEsActivo(false)}>
                Inactivo
              </button>
            </div>
          </div>

          {/* Product selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Productos</p>
              <button
                onClick={toggleAll}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {selectedIds.length === allProductos.length ? "Deseleccionar todos" : "Seleccionar todos"}
              </button>
            </div>
            <div className="max-h-56 overflow-y-auto rounded-md border border-input p-2 space-y-1">
              {allProductos.map((p) => (
                <label key={p._id} className="flex items-center gap-2 cursor-pointer text-sm py-1">
                  <Checkbox
                    checked={selectedIds.includes(p._id)}
                    onCheckedChange={() => toggleId(p._id)}
                  />
                  {p.nombre}
                </label>
              ))}
            </div>
            {selectedIds.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {selectedIds.length} producto{selectedIds.length !== 1 ? "s" : ""} seleccionado{selectedIds.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUpdatingStatus}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isUpdatingStatus || !selectedIds.length}>
            {isUpdatingStatus ? "Aplicando…" : "Aplicar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
