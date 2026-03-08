"use client"

import { useState } from "react"
import { IconStar } from "@tabler/icons-react"
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
import { SearchableSelect } from "@/components/shared/SearchableSelect"
import type { useClientReseniasList } from "../hooks/useClientReseniasList"

interface AgregarReseniaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  createResenia: ReturnType<typeof useClientReseniasList>["createResenia"]
  isCreating: boolean
  pedidosRecientes: ReturnType<typeof useClientReseniasList>["pedidosRecientes"]
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-GT", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button key={i} type="button" onClick={() => onChange(i)}>
          <IconStar
            className={`h-7 w-7 transition-colors ${
              i <= value ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30 hover:text-amber-300"
            }`}
          />
        </button>
      ))}
    </div>
  )
}

const EMPTY_FORM = {
  titulo: "",
  id_pedido: null as string | null,
  descripcion: "",
  puntuacion: 0,
}

export function AgregarReseniaDialog({
  open,
  onOpenChange,
  userId,
  createResenia,
  isCreating,
  pedidosRecientes,
}: AgregarReseniaDialogProps) {
  const [form, setForm] = useState(EMPTY_FORM)

  const pedidoOptions = pedidosRecientes.map((p) => ({
    id: p._id,
    label: `${p.nombre_restaurante} — ${formatDate(p.fecha_pedido)}`,
  }))

  const selectedPedido = pedidosRecientes.find((p) => p._id === form.id_pedido) ?? null

  const canSubmit =
    Boolean(form.titulo.trim()) &&
    Boolean(form.id_pedido) &&
    Boolean(form.descripcion.trim()) &&
    form.puntuacion > 0 &&
    !isCreating

  const handleSubmit = () => {
    if (!canSubmit || !selectedPedido) return
    createResenia(
      {
        titulo: form.titulo.trim(),
        id_usuario: userId,
        id_restaurante: selectedPedido.id_restaurante,
        id_pedido: selectedPedido._id,
        descripcion: form.descripcion.trim(),
        puntuacion: form.puntuacion,
      },
      {
        onSuccess: () => {
          setForm(EMPTY_FORM)
          onOpenChange(false)
        },
      }
    )
  }

  const handleOpenChange = (value: boolean) => {
    if (!value) setForm(EMPTY_FORM)
    onOpenChange(value)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva reseña</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="font-semibold">Pedido</Label>
            <SearchableSelect
              options={pedidoOptions}
              value={form.id_pedido}
              onChange={(id) => setForm((prev) => ({ ...prev, id_pedido: id }))}
              placeholder="Selecciona un pedido reciente…"
              searchPlaceholder="Buscar pedido…"
              widePopover={false}
            />
            <p className="text-xs text-muted-foreground">
              Solo se muestran tus últimos 5 pedidos recibidos.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Título</Label>
            <Input
              value={form.titulo}
              onChange={(e) => setForm((prev) => ({ ...prev, titulo: e.target.value }))}
              placeholder="Ej. Excelente experiencia"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Descripción</Label>
            <Input
              value={form.descripcion}
              onChange={(e) => setForm((prev) => ({ ...prev, descripcion: e.target.value }))}
              placeholder="Cuéntanos tu experiencia…"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Puntuación</Label>
            <StarPicker
              value={form.puntuacion}
              onChange={(v) => setForm((prev) => ({ ...prev, puntuacion: v }))}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isCreating}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {isCreating ? "Guardando…" : "Enviar reseña"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
