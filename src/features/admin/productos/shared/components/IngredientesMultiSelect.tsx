"use client"

import { useState } from "react"
import { IconSearch, IconX, IconCheck, IconChevronDown } from "@tabler/icons-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface IngredientesMultiSelectProps {
  ingredientes: string[]
  selected: string[]
  onChange: (v: string[]) => void
  placeholder?: string
}

export function IngredientesMultiSelect({
  ingredientes,
  selected,
  onChange,
  placeholder = "Seleccionar ingredientes…",
}: IngredientesMultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const filtered = ingredientes.filter((ing) =>
    ing.toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (ing: string) => {
    onChange(
      selected.includes(ing) ? selected.filter((i) => i !== ing) : [...selected, ing]
    )
  }

  const remove = (ing: string) => {
    onChange(selected.filter((i) => i !== ing))
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="w-full flex items-center justify-between px-3 h-9 rounded-md border border-input bg-background text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>
              {selected.length > 0
                ? `${selected.length} ingrediente${selected.length !== 1 ? "s" : ""} seleccionado${selected.length !== 1 ? "s" : ""}`
                : placeholder}
            </span>
            <IconChevronDown className="h-4 w-4 shrink-0" />
          </button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-72 p-2 space-y-2">
          <div className="relative">
            <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar ingrediente…"
              className="pl-8 h-8 text-sm"
            />
          </div>

          <div className="max-h-48 overflow-y-auto space-y-0.5">
            {filtered.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-3">Sin resultados</p>
            ) : (
              filtered.map((ing) => {
                const isSelected = selected.includes(ing)
                return (
                  <button
                    key={ing}
                    type="button"
                    onClick={() => toggle(ing)}
                    className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded text-sm hover:bg-muted transition-colors"
                  >
                    <span className={`truncate text-left ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                      {ing}
                    </span>
                    {isSelected && <IconCheck className="h-3.5 w-3.5 shrink-0 text-primary" />}
                  </button>
                )
              })
            )}
          </div>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((ing) => (
            <Badge key={ing} variant="secondary" className="gap-1 pr-1 text-xs">
              {ing}
              <button
                type="button"
                onClick={() => remove(ing)}
                className="hover:text-destructive ml-0.5"
              >
                <IconX className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
