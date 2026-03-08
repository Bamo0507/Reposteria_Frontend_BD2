"use client"

import { useState } from "react"
import { IconStar, IconPencil, IconX, IconDeviceFloppy } from "@tabler/icons-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { ClientReseniaDetalle, UpdateReseniaInput } from "../../shared/types"
import type { useClientReseniaDetail } from "../hooks/useClientReseniaDetail"

interface ClientReseniaProfileCardProps {
  resenia: ClientReseniaDetalle
  update: ReturnType<typeof useClientReseniaDetail>["update"]
  isUpdating: boolean
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-GT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function StarIcons({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <IconStar
          key={i}
          className={`h-3.5 w-3.5 ${i < value ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
        />
      ))}
    </span>
  )
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

export function ClientReseniaProfileCard({
  resenia,
  update,
  isUpdating,
}: ClientReseniaProfileCardProps) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<UpdateReseniaInput>({})

  const startEditing = () => {
    setForm({
      titulo: resenia.titulo,
      descripcion: resenia.descripcion,
      puntuacion: resenia.puntuacion,
    })
    setEditing(true)
  }

  const cancelEditing = () => {
    setEditing(false)
    setForm({})
  }

  const handleSave = () => {
    update(form, { onSuccess: () => setEditing(false) })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Información de la reseña</CardTitle>
        {!editing ? (
          <Button variant="ghost" size="icon" onClick={startEditing} aria-label="Editar">
            <IconPencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={cancelEditing} disabled={isUpdating} aria-label="Cancelar">
            <IconX className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Titulo — editable */}
          <div className="space-y-2 sm:col-span-2">
            <Label className="font-semibold">Título</Label>
            <Input
              value={editing ? (form.titulo ?? "") : resenia.titulo}
              readOnly={!editing}
              onChange={(e) => setForm((prev) => ({ ...prev, titulo: e.target.value }))}
              className={!editing ? "cursor-default focus-visible:ring-0" : ""}
            />
          </div>

          {/* Descripcion — editable */}
          <div className="space-y-2 sm:col-span-2">
            <Label className="font-semibold">Descripción</Label>
            <Input
              value={editing ? (form.descripcion ?? "") : resenia.descripcion}
              readOnly={!editing}
              onChange={(e) => setForm((prev) => ({ ...prev, descripcion: e.target.value }))}
              className={!editing ? "cursor-default focus-visible:ring-0" : ""}
            />
          </div>

          {/* Puntuacion — editable */}
          <div className="space-y-2">
            <Label className="font-semibold flex items-center gap-2">
              Puntuación
              {!editing && <StarIcons value={resenia.puntuacion} />}
            </Label>
            {editing ? (
              <StarPicker
                value={form.puntuacion ?? resenia.puntuacion}
                onChange={(v) => setForm((prev) => ({ ...prev, puntuacion: v }))}
              />
            ) : (
              <Input
                value={`${resenia.puntuacion} / 5`}
                readOnly
                className="cursor-default focus-visible:ring-0 tabular-nums"
              />
            )}
          </div>

          {/* Fecha reseña — readonly siempre */}
          <div className="space-y-2">
            <Label className="font-semibold">Fecha de la reseña</Label>
            <Input
              value={formatDate(resenia.fecha)}
              readOnly
              className="cursor-default focus-visible:ring-0"
            />
          </div>

          <Separator className="sm:col-span-2" />

          {/* Restaurante — readonly siempre */}
          <div className="space-y-2">
            <Label className="font-semibold">Restaurante</Label>
            <Input
              value={resenia.nombre_restaurante}
              readOnly
              className="cursor-default focus-visible:ring-0"
            />
          </div>

          {/* Fecha pedido — readonly siempre */}
          <div className="space-y-2">
            <Label className="font-semibold">Fecha del pedido</Label>
            <Input
              value={formatDate(resenia.fecha_pedido)}
              readOnly
              className="cursor-default focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Save button — solo visible al editar */}
        {editing && (
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isUpdating}>
              <IconDeviceFloppy className="h-4 w-4" />
              {isUpdating ? "Actualizando..." : "Actualizar"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
