"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCrearRestaurante } from "../hooks/useCrearRestaurante"
import type { CreateRestauranteInput } from "../../shared/types/restaurante.type"

interface CrearRestauranteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EMPTY_FORM: CreateRestauranteInput = {
  nombre_restaurante: "",
  ubicacion: {
    calle: "",
    avenida: "",
    zona: "",
    codigo_postal: "",
  },
  telefono: [],
  horarios_de_atencion: {
    entre_semana: "",
    fines_de_semana: "",
    asueto: "",
  },
}

export function CrearRestauranteDialog({ open, onOpenChange }: CrearRestauranteDialogProps) {
  const [form, setForm] = useState<CreateRestauranteInput>(EMPTY_FORM)

  const { crear, isCreating } = useCrearRestaurante(() => {
    setForm(EMPTY_FORM)
    onOpenChange(false)
  })

  const handleSubmit = () => {
    if (!form.nombre_restaurante || !form.ubicacion.calle || !form.telefono.length) return
    crear(form)
  }

  const updateUbicacion = (field: keyof CreateRestauranteInput["ubicacion"], value: string) => {
    setForm({ ...form, ubicacion: { ...form.ubicacion, [field]: value } })
  }

  const updateHorario = (field: keyof CreateRestauranteInput["horarios_de_atencion"], value: string) => {
    setForm({ ...form, horarios_de_atencion: { ...form.horarios_de_atencion, [field]: value } })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear restaurante</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label className="font-semibold">Nombre del restaurante</Label>
              <Input
                value={form.nombre_restaurante}
                onChange={(e) => setForm({ ...form, nombre_restaurante: e.target.value })}
                placeholder="Nombre del restaurante"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Calle</Label>
              <Input
                value={form.ubicacion.calle}
                onChange={(e) => updateUbicacion("calle", e.target.value)}
                placeholder="1ra Calle"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Avenida</Label>
              <Input
                value={form.ubicacion.avenida}
                onChange={(e) => updateUbicacion("avenida", e.target.value)}
                placeholder="5ta Avenida"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Zona</Label>
              <Input
                value={form.ubicacion.zona}
                onChange={(e) => updateUbicacion("zona", e.target.value)}
                placeholder="10"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Codigo postal</Label>
              <Input
                value={form.ubicacion.codigo_postal}
                onChange={(e) => updateUbicacion("codigo_postal", e.target.value)}
                placeholder="01010"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Telefono</Label>
              <Input
                value={form.telefono.join(", ")}
                onChange={(e) => setForm({ ...form, telefono: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
                placeholder="1234-5678"
              />
            </div>
          </div>

          <div className="space-y-3 rounded-lg border border-border p-4">
            <p className="text-sm font-semibold">Horarios de atencion</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Entre semana</Label>
                <Input
                  value={form.horarios_de_atencion.entre_semana}
                  onChange={(e) => updateHorario("entre_semana", e.target.value)}
                  placeholder="8:00 - 18:30"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Fines de semana</Label>
                <Input
                  value={form.horarios_de_atencion.fines_de_semana}
                  onChange={(e) => updateHorario("fines_de_semana", e.target.value)}
                  placeholder="8:30 - 19:00"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold">Asueto</Label>
                <Input
                  value={form.horarios_de_atencion.asueto}
                  onChange={(e) => updateHorario("asueto", e.target.value)}
                  placeholder="10:00 - 16:00"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isCreating}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isCreating}>
            {isCreating ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
