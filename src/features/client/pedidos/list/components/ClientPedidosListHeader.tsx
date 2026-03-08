"use client"

import { useState } from "react"
import { IconCalendar, IconX, IconChevronDown, IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import type { DateRange } from "react-day-picker"
import { AgregarPedidoDialog } from "./AgregarPedidoDialog"
import type { useClientPedidosList } from "../hooks/useClientPedidosList"

interface ClientPedidosListHeaderProps {
  listState: ReturnType<typeof useClientPedidosList>
}

function formatDateLabel(dateRange: DateRange | undefined): string {
  if (!dateRange?.from) return "Filtrar por fechas"
  const from = dateRange.from.toLocaleDateString("es-GT")
  if (!dateRange.to) return `Desde ${from}`
  const to = dateRange.to.toLocaleDateString("es-GT")
  return `${from} — ${to}`
}

export function ClientPedidosListHeader({ listState }: ClientPedidosListHeaderProps) {
  const {
    dateRange,
    setDateRange,
    hasFilters,
    clearFilters,
    userId,
    createOrder,
    isCreating,
    restauranteOptions,
    productoOptions,
  } = listState

  const [dialogOpen, setDialogOpen] = useState(false)
  const dateLabel = formatDateLabel(dateRange)

  return (
    <>
      <div className="space-y-4 md:space-y-6">
        {/* Row 1: title + agregar */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Mis Pedidos</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Consulta y gestiona tus pedidos
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="shrink-0">
            <IconPlus className="h-4 w-4 mr-1" />
            Agregar pedido
          </Button>
        </div>

        {/* Row 2: filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-wrap">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                data-empty={!dateRange?.from}
                className="w-full sm:w-auto justify-start gap-2 font-normal data-[empty=true]:text-muted-foreground"
              >
                <IconCalendar className="h-4 w-4 shrink-0" />
                <span className="truncate">{dateLabel}</span>
                <IconChevronDown className="h-4 w-4 text-muted-foreground ml-auto" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0">
              <Calendar
                mode="range"
                selected={dateRange}
                captionLayout="dropdown"
                numberOfMonths={1}
                onSelect={setDateRange}
                className="w-full"
              />
            </PopoverContent>
          </Popover>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="shrink-0">
              <IconX className="h-4 w-4" />
              <span>Limpiar filtros</span>
            </Button>
          )}
        </div>
      </div>

      <AgregarPedidoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        userId={userId}
        createOrder={createOrder}
        isCreating={isCreating}
        restauranteOptions={restauranteOptions}
        productoOptions={productoOptions}
      />
    </>
  )
}
