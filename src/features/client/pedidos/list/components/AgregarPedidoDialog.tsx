"use client"

import { useState } from "react"
import { IconTrash } from "@tabler/icons-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { SearchableSelect } from "@/components/shared/SearchableSelect"
import type { useClientPedidosList } from "../hooks/useClientPedidosList"

interface AgregarPedidoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  createOrder: ReturnType<typeof useClientPedidosList>["createOrder"]
  isCreating: boolean
  restauranteOptions: ReturnType<typeof useClientPedidosList>["restauranteOptions"]
  productoOptions: ReturnType<typeof useClientPedidosList>["productoOptions"]
}

interface Linea {
  producto_id: string
  nombre: string
  precio_unitario: number
  cantidad: number
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString("es-GT", { style: "currency", currency: "GTQ" })
}

const EMPTY_FORM = { id_restaurante: null as string | null, lineas: [] as Linea[] }

export function AgregarPedidoDialog({
  open,
  onOpenChange,
  userId,
  createOrder,
  isCreating,
  restauranteOptions,
  productoOptions,
}: AgregarPedidoDialogProps) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [selectedProductoId, setSelectedProductoId] = useState<string | null>(null)
  const [cantidad, setCantidad] = useState(1)

  const restaurantes = restauranteOptions.map((r) => ({
    id: r._id,
    label: r.nombre_restaurante,
  }))

  const productosDisponibles = productoOptions
    .filter((p) => !form.lineas.some((l) => l.producto_id === p._id))
    .map((p) => ({ id: p._id, label: `${p.nombre} — ${formatCurrency(p.precio)}` }))

  const total = form.lineas.reduce(
    (sum, l) => sum + l.precio_unitario * l.cantidad,
    0
  )

  const handleAddProducto = () => {
    if (!selectedProductoId) return
    const producto = productoOptions.find((p) => p._id === selectedProductoId)
    if (!producto) return
    setForm((prev) => ({
      ...prev,
      lineas: [
        ...prev.lineas,
        {
          producto_id: producto._id,
          nombre: producto.nombre,
          precio_unitario: producto.precio,
          cantidad,
        },
      ],
    }))
    setSelectedProductoId(null)
    setCantidad(1)
  }

  const handleRemoveLinea = (producto_id: string) => {
    setForm((prev) => ({
      ...prev,
      lineas: prev.lineas.filter((l) => l.producto_id !== producto_id),
    }))
  }

  const handleSubmit = () => {
    if (!form.id_restaurante || form.lineas.length === 0) return
    createOrder(
      {
        id_usuario: userId,
        id_restaurante: form.id_restaurante,
        productos: form.lineas.map(({ producto_id, cantidad, precio_unitario }) => ({
          producto_id,
          cantidad,
          precio_unitario,
        })),
      },
      {
        onSuccess: () => {
          setForm(EMPTY_FORM)
          setSelectedProductoId(null)
          setCantidad(1)
          onOpenChange(false)
        },
      }
    )
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setForm(EMPTY_FORM)
      setSelectedProductoId(null)
      setCantidad(1)
    }
    onOpenChange(value)
  }

  const canSubmit = Boolean(form.id_restaurante) && form.lineas.length > 0 && !isCreating

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar pedido</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Restaurante */}
          <div className="space-y-2">
            <Label className="font-semibold">Restaurante</Label>
            <SearchableSelect
              options={restaurantes}
              value={form.id_restaurante}
              onChange={(id) => setForm((prev) => ({ ...prev, id_restaurante: id }))}
              placeholder="Selecciona un restaurante…"
              searchPlaceholder="Buscar restaurante…"
            />
          </div>

          <Separator />

          {/* Agregar producto */}
          <div className="space-y-3">
            <Label className="font-semibold">Productos</Label>

            <div className="flex gap-2 items-end">
              <div className="flex-1 space-y-1">
                <Label className="text-xs text-muted-foreground">Producto</Label>
                <SearchableSelect
                  options={productosDisponibles}
                  value={selectedProductoId}
                  onChange={setSelectedProductoId}
                  placeholder="Selecciona un producto…"
                  searchPlaceholder="Buscar producto…"
                  widePopover
                />
              </div>
              <div className="w-24 space-y-1">
                <Label className="text-xs text-muted-foreground">Cantidad</Label>
                <Input
                  type="number"
                  min={1}
                  value={cantidad}
                  onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleAddProducto}
                disabled={!selectedProductoId}
              >
                Agregar
              </Button>
            </div>

            {/* Lista de productos agregados */}
            {form.lineas.length > 0 && (
              <div className="rounded-md border border-border divide-y divide-border">
                {form.lineas.map((linea) => (
                  <div
                    key={linea.producto_id}
                    className="flex items-center justify-between px-3 py-2 text-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{linea.nombre}</p>
                      <p className="text-xs text-muted-foreground tabular-nums">
                        {linea.cantidad} × {formatCurrency(linea.precio_unitario)} ={" "}
                        {formatCurrency(linea.cantidad * linea.precio_unitario)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 ml-2 text-destructive hover:text-destructive"
                      onClick={() => handleRemoveLinea(linea.producto_id)}
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <div className="flex justify-end px-3 py-2 text-sm font-semibold">
                  Total: {formatCurrency(total)}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isCreating}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {isCreating ? "Guardando…" : "Crear pedido"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
