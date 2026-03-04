"use client"

import { useState, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { IconPencil, IconX, IconDeviceFloppy, IconChevronDown } from "@tabler/icons-react"
import { IngredientesMultiSelect } from "../../shared/components/IngredientesMultiSelect"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getIngredientes } from "../../admin-productos-api"
import type { ProductoDetalle, UpdateProductoInput } from "../../shared/types/producto.type"
import type { useAdminProductoDetail } from "../hooks/useAdminProductoDetail"

interface ProductoProfileCardProps {
  producto: ProductoDetalle
  update: ReturnType<typeof useAdminProductoDetail>["update"]
  isUpdating: boolean
  updateStatus: ReturnType<typeof useAdminProductoDetail>["updateStatus"]
  isUpdatingStatus: boolean
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString("es-GT", { style: "currency", currency: "GTQ" })
}

export function ProductoProfileCard({
  producto,
  update,
  isUpdating,
  updateStatus,
  isUpdatingStatus,
}: ProductoProfileCardProps) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<UpdateProductoInput>({})
  const [formEstado, setFormEstado] = useState<boolean>(producto.esActivo)
  const [newImage, setNewImage] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isBusy = isUpdating || isUpdatingStatus

  const { data: ingredientes = [] } = useQuery({
    queryKey: ["admin", "productos", "ingredientes"],
    queryFn: getIngredientes,
    staleTime: 5 * 60 * 1000,
    enabled: editing,
  })

  const startEditing = () => {
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      tiempo_preparacion: producto.tiempo_preparacion,
      precio: producto.precio,
      ingredientes: [...producto.ingredientes],
    })
    setFormEstado(producto.esActivo)
    setNewImage(null)
    setEditing(true)
  }

  const cancelEditing = () => {
    setEditing(false)
    setForm({})
    setNewImage(null)
  }

  const handleSave = () => {
    const payload: UpdateProductoInput = { ...form }
    if (newImage) payload.imagen = newImage

    // Fire status update separately if it changed
    if (formEstado !== producto.esActivo) {
      updateStatus(formEstado)
    }

    update(payload, { onSuccess: () => setEditing(false) })
  }

  const displayImage = newImage ? URL.createObjectURL(newImage) : producto.imagen

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Información del producto</CardTitle>
        {!editing ? (
          <Button variant="ghost" size="icon" onClick={startEditing} aria-label="Editar">
            <IconPencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={cancelEditing} disabled={isBusy} aria-label="Cancelar" className="cursor-pointer">
            <IconX className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Circular image */}
        <div className="flex flex-col items-center">
          {!editing ? (
            <div className="h-40 w-40 rounded-full overflow-hidden border-4 border-border bg-muted flex items-center justify-center shrink-0">
              {displayImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={displayImage} alt={producto.nombre} className="h-full w-full object-cover" />
              ) : (
                <span className="text-5xl select-none text-slate-500">?</span>
              )}
            </div>
          ) : (
            <>
              <div
                className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-border bg-muted flex items-center justify-center shrink-0 cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                {displayImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={displayImage} alt={producto.nombre} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-5xl select-none text-slate-500">?</span>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                  <IconPencil className="h-8 w-8 text-white" />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setNewImage(e.target.files?.[0] ?? null)}
              />
            </>
          )}
        </div>

        {/* Fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label className="font-semibold">Nombre</Label>
            <Input
              value={editing ? (form.nombre ?? "") : producto.nombre}
              readOnly={!editing}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className={!editing ? "cursor-default focus-visible:ring-0" : ""}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label className="font-semibold">Descripción</Label>
            <Input
              value={editing ? (form.descripcion ?? "") : producto.descripcion}
              readOnly={!editing}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              className={!editing ? "cursor-default focus-visible:ring-0" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Precio (GTQ)</Label>
            <Input
              type={editing ? "number" : "text"}
              value={editing ? (form.precio ?? 0) : formatCurrency(producto.precio)}
              readOnly={!editing}
              onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })}
              className={!editing ? "cursor-default focus-visible:ring-0 tabular-nums" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Tiempo de preparación (min)</Label>
            <Input
              type={editing ? "number" : "text"}
              value={editing ? (form.tiempo_preparacion ?? 0) : `${producto.tiempo_preparacion} min`}
              readOnly={!editing}
              onChange={(e) => setForm({ ...form, tiempo_preparacion: Number(e.target.value) })}
              className={!editing ? "cursor-default focus-visible:ring-0 tabular-nums" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Estado</Label>
            {!editing ? (
              <Input
                value={producto.esActivo ? "Activo" : "Inactivo"}
                readOnly
                className="cursor-default focus-visible:ring-0"
              />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-between w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] h-9 md:text-sm focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50">
                    {formEstado ? "Activo" : "Inactivo"}
                    <IconChevronDown className="h-4 w-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  <DropdownMenuItem onSelect={() => setFormEstado(true)}>Activo</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFormEstado(false)}>Inactivo</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label className="font-semibold">Ingredientes</Label>
            {!editing ? (
              <div className="flex flex-wrap gap-1.5 min-h-9 items-center px-3 py-2 rounded-md border border-input bg-background">
                {producto.ingredientes.length > 0
                  ? producto.ingredientes.map((ing) => (
                      <Badge key={ing} variant="secondary" className="text-xs">{ing}</Badge>
                    ))
                  : <span className="text-sm text-muted-foreground">Sin ingredientes</span>
                }
              </div>
            ) : (
              <IngredientesMultiSelect
                ingredientes={ingredientes}
                selected={form.ingredientes ?? []}
                onChange={(v) => setForm({ ...form, ingredientes: v })}
              />
            )}
          </div>
        </div>

        {/* Save button — only visible in edit mode */}
        {editing && (
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isBusy}>
              <IconDeviceFloppy className="h-4 w-4" />
              {isBusy ? "Actualizando…" : "Actualizar"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
