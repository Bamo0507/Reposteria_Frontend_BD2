"use client"

import { useState } from "react"
import { IconPencil, IconX, IconDeviceFloppy, IconChevronDown } from "@tabler/icons-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { RestauranteDetalle, UpdateRestauranteInput } from "../../shared/types/restaurante.type"
import type { useAdminRestauranteDetail } from "../hooks/useAdminRestauranteDetail"

interface RestauranteProfileCardProps {
  restaurante: RestauranteDetalle
  update: ReturnType<typeof useAdminRestauranteDetail>["update"]
  isUpdating: boolean
}

export function RestauranteProfileCard({
  restaurante,
  update,
  isUpdating,
}: RestauranteProfileCardProps) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<UpdateRestauranteInput>({})
  const [formEstado, setFormEstado] = useState<boolean>(restaurante.esActivo)

  const startEditing = () => {
    setForm({
      nombre_restaurante: restaurante.nombre_restaurante,
      ubicacion: { ...restaurante.ubicacion },
      telefono: restaurante.telefono,
      horarios_de_atencion: {
        entre_semana: restaurante.horarios_de_atencion?.entre_semana ?? "",
        fines_de_semana: restaurante.horarios_de_atencion?.fines_de_semana ?? "",
        asueto: restaurante.horarios_de_atencion?.asueto ?? "",
      },
    })
    setFormEstado(restaurante.esActivo)
    setEditing(true)
  }

  const cancelEditing = () => {
    setEditing(false)
    setForm({})
  }

  const handleSave = () => {
    const payload: UpdateRestauranteInput = { ...form }

    if (formEstado !== restaurante.esActivo) {
      payload.esActivo = formEstado
    }

    update(payload, { onSuccess: () => setEditing(false) })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Informacion del restaurante</CardTitle>
        {!editing ? (
          <Button variant="ghost" size="icon" onClick={startEditing} aria-label="Editar">
            <IconPencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={cancelEditing} disabled={isUpdating} aria-label="Cancelar" className="cursor-pointer">
            <IconX className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label className="font-semibold">Nombre</Label>
            <Input
              value={editing ? (form.nombre_restaurante ?? "") : restaurante.nombre_restaurante}
              readOnly={!editing}
              onChange={(e) => setForm({ ...form, nombre_restaurante: e.target.value })}
              className={!editing ? "cursor-default focus-visible:ring-0" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Calle</Label>
            <Input
              value={editing ? (form.ubicacion?.calle ?? "") : restaurante.ubicacion.calle}
              readOnly={!editing}
              onChange={(e) => setForm({ ...form, ubicacion: { ...form.ubicacion, calle: e.target.value } })}
              className={!editing ? "cursor-default focus-visible:ring-0" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Avenida</Label>
            <Input
              value={editing ? (form.ubicacion?.avenida ?? "") : restaurante.ubicacion.avenida}
              readOnly={!editing}
              onChange={(e) => setForm({ ...form, ubicacion: { ...form.ubicacion, avenida: e.target.value } })}
              className={!editing ? "cursor-default focus-visible:ring-0" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Zona</Label>
            <Input
              value={editing ? (form.ubicacion?.zona ?? "") : restaurante.ubicacion.zona}
              readOnly={!editing}
              onChange={(e) => setForm({ ...form, ubicacion: { ...form.ubicacion, zona: e.target.value } })}
              className={!editing ? "cursor-default focus-visible:ring-0" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Codigo postal</Label>
            <Input
              value={editing ? (form.ubicacion?.codigo_postal ?? "") : restaurante.ubicacion.codigo_postal}
              readOnly={!editing}
              onChange={(e) => setForm({ ...form, ubicacion: { ...form.ubicacion, codigo_postal: e.target.value } })}
              className={!editing ? "cursor-default focus-visible:ring-0" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Telefono</Label>
            <Input
              value={editing ? (form.telefono?.join(", ") ?? "") : restaurante.telefono.join(", ")}
              readOnly={!editing}
              onChange={(e) => setForm({ ...form, telefono: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
              className={!editing ? "cursor-default focus-visible:ring-0" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Estado</Label>
            {!editing ? (
              <Input
                value={restaurante.esActivo ? "Activo" : "Inactivo"}
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
        </div>

        {/* Horarios section */}
        <div className="space-y-3 rounded-lg border border-border p-4">
          <p className="text-sm font-semibold">Horarios de atencion</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Entre semana</Label>
              <Input
                value={editing ? (form.horarios_de_atencion?.entre_semana ?? "") : (restaurante.horarios_de_atencion?.entre_semana ?? "")}
                readOnly={!editing}
                onChange={(e) =>
                  setForm({
                    ...form,
                    horarios_de_atencion: { ...form.horarios_de_atencion, entre_semana: e.target.value },
                  })
                }
                className={!editing ? "cursor-default focus-visible:ring-0" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Fines de semana</Label>
              <Input
                value={editing ? (form.horarios_de_atencion?.fines_de_semana ?? "") : (restaurante.horarios_de_atencion?.fines_de_semana ?? "")}
                readOnly={!editing}
                onChange={(e) =>
                  setForm({
                    ...form,
                    horarios_de_atencion: { ...form.horarios_de_atencion, fines_de_semana: e.target.value },
                  })
                }
                className={!editing ? "cursor-default focus-visible:ring-0" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Asueto</Label>
              <Input
                value={editing ? (form.horarios_de_atencion?.asueto ?? "") : (restaurante.horarios_de_atencion?.asueto ?? "")}
                readOnly={!editing}
                onChange={(e) =>
                  setForm({
                    ...form,
                    horarios_de_atencion: { ...form.horarios_de_atencion, asueto: e.target.value },
                  })
                }
                className={!editing ? "cursor-default focus-visible:ring-0" : ""}
              />
            </div>
          </div>
        </div>

        {/* Save button */}
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
