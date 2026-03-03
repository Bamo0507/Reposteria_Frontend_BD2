"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { IconCaretDownFilled } from "@tabler/icons-react"
import {
  getPedidoEstadoColorKey,
  getPedidoEstadoLabel,
  ESTADO_COLOR_CLASSES,
  PEDIDO_ESTADOS,
} from "../../shared/types/pedido.type"
import type { PedidoEstado } from "../../shared/types/pedido.type"

interface PedidoStatusBadgeProps {
  pedidoId: string
  currentEstado: PedidoEstado
  onChangeEstado: (estado: PedidoEstado) => void
  isLoading?: boolean
}

export function PedidoStatusBadge({
  currentEstado,
  onChangeEstado,
  isLoading,
}: PedidoStatusBadgeProps) {
  const [open, setOpen] = useState(false)

  const colorKey = getPedidoEstadoColorKey(currentEstado)
  const colorClasses = ESTADO_COLOR_CLASSES[colorKey]
  const label = getPedidoEstadoLabel(currentEstado)

  const handleSelect = (estado: PedidoEstado) => {
    if (isLoading) return
    if (estado === currentEstado) return
    onChangeEstado(estado)
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Badge
          variant="secondary"
          className={cn(
            "inline-flex w-fit items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity select-none",
            colorClasses.bg,
            colorClasses.text,
            isLoading ? "opacity-60 pointer-events-none" : ""
          )}
        >
          <IconCaretDownFilled
            className={cn(
              "h-3 w-3 transition-transform duration-200",
              open ? "rotate-90" : "rotate-0"
            )}
          />
          <span className="truncate">{label}</span>
        </Badge>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {PEDIDO_ESTADOS.map((estado) => {
          const itemColorKey = getPedidoEstadoColorKey(estado)
          const itemColor = ESTADO_COLOR_CLASSES[itemColorKey]
          const itemLabel = getPedidoEstadoLabel(estado)

          return (
            <DropdownMenuItem
              key={estado}
              onSelect={() => handleSelect(estado)}
              disabled={estado === currentEstado}
            >
              <span className={cn("mr-2 h-2 w-2 rounded-full", itemColor.dot)} />
              {itemLabel}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
