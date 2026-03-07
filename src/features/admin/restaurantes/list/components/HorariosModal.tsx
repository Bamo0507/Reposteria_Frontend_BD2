"use client"

import { IconClock } from "@tabler/icons-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { HorariosDeAtencion } from "../../shared/types/restaurante.type"

interface HorariosModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  horarios: HorariosDeAtencion | null
}

const HORARIO_LABELS: { key: keyof HorariosDeAtencion; label: string }[] = [
  { key: "entre_semana", label: "Entre semana" },
  { key: "fines_de_semana", label: "Fines de semana" },
  { key: "asueto", label: "Asueto" },
]

export function HorariosModal({ open, onOpenChange, horarios }: HorariosModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconClock className="h-5 w-5" />
            Horarios de atencion
          </DialogTitle>
        </DialogHeader>

        {horarios ? (
          <div className="space-y-4">
            {HORARIO_LABELS.map((horario) => (
              <div key={horario.key} className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground">{horario.label}</p>
                <p className="text-sm font-medium">
                  {horarios[horario.key] || "No especificado"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No se pudo cargar la informacion.</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
