"use client"

import { IconX, IconCalendar, IconSearch, IconStar, IconChevronDown } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { DateRange } from "react-day-picker"
import { PUNTUACION_OPTIONS } from "../../shared/types/resenia.type"

interface AdminReseniasListHeaderProps {
  searchQuery: string
  onSearchChange: (q: string) => void
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  puntuacion: number | undefined
  onPuntuacionChange: (value: number | undefined) => void
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

function StarDisplay({ value }: { value: number }) {
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

export function AdminReseniasListHeader({
  searchQuery,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  puntuacion,
  onPuntuacionChange,
  hasFilters,
  onClearFilters,
}: AdminReseniasListHeaderProps) {
  const dateLabel = formatDateLabel(dateRange)
  const puntuacionLabel = puntuacion ? `${puntuacion} estrella${puntuacion !== 1 ? "s" : ""}` : "Puntuación"

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-row gap-3 items-center justify-between">
        <div className="min-w-0 flex-1 space-y-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Reseñas</h1>
          <p className="text-sm text-muted-foreground hidden sm:block">
            Consulta y explora las reseñas de los usuarios
          </p>
          <p className="text-sm text-muted-foreground sm:hidden">
            Consulta las reseñas
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-wrap">
        {/* Search bar */}
        <div className="relative w-full sm:w-64">
          <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título o descripción…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Date range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!dateRange?.from}
              className="w-full sm:w-auto justify-start gap-2 font-normal data-[empty=true]:text-muted-foreground"
            >
              <IconCalendar className="h-4 w-4 shrink-0" />
              <span className="truncate">{dateLabel}</span>
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

        {/* Puntuacion filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              data-empty={!puntuacion}
              className="w-full sm:w-auto justify-between gap-2 font-normal data-[empty=true]:text-muted-foreground"
            >
              <span className="flex items-center gap-1.5">
                <IconStar className="h-4 w-4 shrink-0" />
                <span>{puntuacionLabel}</span>
              </span>
              <IconChevronDown className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onSelect={() => onPuntuacionChange(undefined)}>
              Todas
            </DropdownMenuItem>
            {PUNTUACION_OPTIONS.map((p) => (
              <DropdownMenuItem key={p} onSelect={() => onPuntuacionChange(p)}>
                <span className="flex items-center gap-2">
                  <StarDisplay value={p} />
                  <span>{p} estrella{p !== 1 ? "s" : ""}</span>
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

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
