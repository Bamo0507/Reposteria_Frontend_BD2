"use client"

import { useState, useRef } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { IconPlus, IconTrash, IconUpload } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createProduct, createProducts, getIngredientes } from "../../admin-productos-api"
import { IngredientesMultiSelect } from "../../shared/components/IngredientesMultiSelect"
import type { CreateProductoInput, CsvProductoRow } from "../../shared/types/producto.type"

interface AgregarProductoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type Mode = "uno" | "varios" | "csv"

const EMPTY_FORM: CreateProductoInput = {
  nombre: "",
  descripcion: "",
  tiempo_preparacion: 0,
  ingredientes: [],
  precio: 0,
  imagen: null,
}

const EMPTY_ROW = (): CsvProductoRow => ({
  nombre: "",
  descripcion: "",
  tiempo_preparacion: 0,
  ingredientes: [],
  precio: 0,
})

function parseCsv(text: string): CsvProductoRow[] {
  const lines = text.trim().split("\n")
  if (lines.length < 2) return []
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim())
    const row: Record<string, string> = {}
    headers.forEach((h, i) => { row[h] = values[i] ?? "" })
    return {
      nombre: row.nombre ?? "",
      descripcion: row.descripcion ?? "",
      tiempo_preparacion: Number(row.tiempo_preparacion ?? 0),
      ingredientes: row.ingredientes ? row.ingredientes.split(";").map((i) => i.trim()).filter(Boolean) : [],
      precio: Number(row.precio ?? 0),
    }
  })
}

export function AgregarProductoDialog({ open, onOpenChange }: AgregarProductoDialogProps) {
  const queryClient = useQueryClient()
  const [mode, setMode] = useState<Mode>("uno")
  const [form, setForm] = useState<CreateProductoInput>(EMPTY_FORM)
  const [rows, setRows] = useState<CsvProductoRow[]>([EMPTY_ROW()])
  const [csvRows, setCsvRows] = useState<CsvProductoRow[]>([])
  const [csvFileName, setCsvFileName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const csvInputRef = useRef<HTMLInputElement>(null)

  const { data: ingredientes = [] } = useQuery({
    queryKey: ["admin", "productos", "ingredientes"],
    queryFn: getIngredientes,
    staleTime: 5 * 60 * 1000,
    enabled: open,
  })

  const onSuccess = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "productos", "list"] })
    setForm(EMPTY_FORM)
    setRows([EMPTY_ROW()])
    setCsvRows([])
    setCsvFileName("")
    onOpenChange(false)
  }

  const { mutate: submitOne, isPending: pendingOne } = useMutation({
    mutationFn: createProduct,
    onSuccess,
  })

  const { mutate: submitMany, isPending: pendingMany } = useMutation({
    mutationFn: createProducts,
    onSuccess,
  })

  const isPending = pendingOne || pendingMany

  const handleSubmit = () => {
    if (mode === "uno") {
      if (!form.nombre || !form.descripcion || !form.precio) return
      submitOne(form)
    } else if (mode === "varios") {
      const valid = rows.filter((r) => r.nombre && r.descripcion && r.precio)
      if (!valid.length) return
      submitMany(valid)
    } else {
      if (!csvRows.length) return
      submitMany(csvRows)
    }
  }

  const handleCsvFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCsvFileName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      setCsvRows(parseCsv(text))
    }
    reader.readAsText(file)
  }

  const updateRow = (i: number, field: keyof CsvProductoRow, value: string | number | string[]) => {
    setRows((prev) => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r))
  }

  const TAB_CLASSES = (active: boolean) =>
    `cursor-pointer px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
      active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
    }`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar producto</DialogTitle>
        </DialogHeader>

        {/* Mode selector */}
        <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
          {(["uno", "varios", "csv"] as Mode[]).map((m) => (
            <button key={m} className={TAB_CLASSES(mode === m)} onClick={() => setMode(m)}>
              {m === "uno" ? "Un producto" : m === "varios" ? "Varios" : "Importar CSV"}
            </button>
          ))}
        </div>

        {/* Single product form */}
        {mode === "uno" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label className="font-semibold">Nombre</Label>
                <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre del producto" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label className="font-semibold">Descripción</Label>
                <Input value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Descripción" />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Precio (GTQ)</Label>
                <Input type="number" min={0} value={form.precio || ""} onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })} placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Tiempo de preparación (min)</Label>
                <Input type="number" min={0} value={form.tiempo_preparacion || ""} onChange={(e) => setForm({ ...form, tiempo_preparacion: Number(e.target.value) })} placeholder="0" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Ingredientes</Label>
              <IngredientesMultiSelect
                ingredientes={ingredientes}
                selected={form.ingredientes}
                onChange={(v) => setForm({ ...form, ingredientes: v })}
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Imagen</Label>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <IconUpload className="h-4 w-4 mr-1" />
                  {form.imagen ? form.imagen.name : "Seleccionar imagen"}
                </Button>
                {form.imagen && (
                  <button onClick={() => setForm({ ...form, imagen: null })} className="text-xs text-muted-foreground hover:text-destructive">
                    Quitar
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                  onChange={(e) => setForm({ ...form, imagen: e.target.files?.[0] ?? null })} />
              </div>
            </div>
          </div>
        )}

        {/* Multiple products form */}
        {mode === "varios" && (
          <div className="space-y-3">
            {rows.map((row, i) => (
              <div key={i} className="rounded-lg border border-border p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Producto {i + 1}</span>
                  {rows.length > 1 && (
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setRows((prev) => prev.filter((_, idx) => idx !== i))}>
                      <IconTrash className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 col-span-2">
                    <Label className="text-xs font-semibold">Nombre</Label>
                    <Input value={row.nombre} onChange={(e) => updateRow(i, "nombre", e.target.value)} placeholder="Nombre del producto" className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-xs font-semibold">Descripción</Label>
                    <Input value={row.descripcion} onChange={(e) => updateRow(i, "descripcion", e.target.value)} placeholder="Descripción" className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Precio (GTQ)</Label>
                    <Input type="number" value={row.precio || ""} onChange={(e) => updateRow(i, "precio", Number(e.target.value))} placeholder="0.00" className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Tiempo prep. (min)</Label>
                    <Input type="number" value={row.tiempo_preparacion || ""} onChange={(e) => updateRow(i, "tiempo_preparacion", Number(e.target.value))} placeholder="0" className="h-8 text-sm" />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label className="text-xs font-semibold">Ingredientes</Label>
                    <IngredientesMultiSelect
                      ingredientes={ingredientes}
                      selected={row.ingredientes}
                      onChange={(v) => updateRow(i, "ingredientes", v)}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => setRows((prev) => [...prev, EMPTY_ROW()])}>
              <IconPlus className="h-4 w-4 mr-1" />
              Agregar otro
            </Button>
          </div>
        )}

        {/* CSV import */}
        {mode === "csv" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              El CSV debe tener las columnas: <code className="bg-muted px-1 rounded text-xs">nombre, descripcion, precio, tiempo_preparacion, ingredientes</code>. Los ingredientes deben separarse con <code className="bg-muted px-1 rounded text-xs">;</code>.
            </p>
            <Button variant="outline" onClick={() => csvInputRef.current?.click()}>
              <IconUpload className="h-4 w-4 mr-2" />
              {csvFileName || "Seleccionar archivo CSV"}
            </Button>
            <input ref={csvInputRef} type="file" accept=".csv" className="hidden" onChange={handleCsvFile} />
            {csvRows.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {csvRows.length} producto{csvRows.length !== 1 ? "s" : ""} listos para importar.
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? "Guardando…" : "Guardar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
