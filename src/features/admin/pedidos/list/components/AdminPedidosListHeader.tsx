"use client"

import { IconX, IconCalendar } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import type { DateRange } from "react-day-picker"

interface AdminPedidosListHeaderProps {
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  hasFilters: boolean
  onClearFilters: () => void
}

function formatDateLabel(dateRange: DateRange | undefined): string {
  if (!dateRange?.from) return "Filtrar por fechas"
  const from = dateRange.from.toLocaleDateString("es-GT")
  if (!dateRange.to) return `Desde ${from}`
  const to = dateRange.to.toLocaleDateString("es-GT")
  return `${from} — ${to}`
}

export function AdminPedidosListHeader({
  dateRange,
  onDateRangeChange,
  hasFilters,
  onClearFilters,
}: AdminPedidosListHeaderProps) {
  const label = formatDateLabel(dateRange)

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-row gap-3 items-center justify-between">
        <div className="min-w-0 flex-1 space-y-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Pedidos</h1>
          <p className="text-sm text-muted-foreground hidden sm:block">
            Gestiona y actualiza el estado de todos los pedidos
          </p>
          <p className="text-sm text-muted-foreground sm:hidden">
            Gestiona los pedidos
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!dateRange?.from}
              className="w-full sm:w-auto justify-start gap-2 font-normal data-[empty=true]:text-muted-foreground"
            >
              <IconCalendar className="h-4 w-4 shrink-0" />
              <span className="truncate">{label}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="p-0">
            <Calendar
              mode="range"
              selected={dateRange}
              captionLayout="dropdown"
              numberOfMonths={1}
              onSelect={onDateRangeChange}
              className="w-full"
            />
          </PopoverContent>
        </Popover>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="shrink-0"
          >
            <IconX className="h-4 w-4" />
            <span>Limpiar filtros</span>
          </Button>
        )}
      </div>
    </div>
  )
}
