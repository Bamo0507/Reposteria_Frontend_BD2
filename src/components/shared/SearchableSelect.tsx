"use client"

import { useState, useRef, useEffect } from "react"
import { IconChevronDown, IconSearch, IconCheck } from "@tabler/icons-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface SearchableSelectOption {
  id: string
  label: string
}

interface SearchableSelectProps {
  options: SearchableSelectOption[]
  value: string | null
  onChange: (id: string) => void
  placeholder?: string
  searchPlaceholder?: string
  disabled?: boolean
  className?: string
  /** Expands the popover width beyond the trigger to avoid clipping long labels */
  widePopover?: boolean
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Selecciona una opción…",
  searchPlaceholder = "Buscar…",
  disabled = false,
  className,
  widePopover = false,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const selected = options.find((o) => o.id === value)

  const filtered = search.trim()
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options

  useEffect(() => {
    if (open) {
      setSearch("")
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  const handleSelect = (id: string) => {
    onChange(id)
    setOpen(false)
  }

  const popoverWidth = widePopover
    ? "calc(var(--radix-popover-trigger-width) + 4rem)"
    : "var(--radix-popover-trigger-width)"

  return (
    <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            !selected && "text-muted-foreground",
            className
          )}
        >
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <IconChevronDown className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="p-0"
        style={{ minWidth: popoverWidth }}
        align="start"
      >
        <div className="border-b border-border px-3 py-2 flex items-center gap-2">
          <IconSearch className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-7 border-0 p-0 shadow-none focus-visible:ring-0 text-sm"
          />
        </div>

        <div
          className="max-h-60 overflow-y-auto py-1"
          onPointerDown={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          style={{ touchAction: "pan-y", overscrollBehavior: "contain" }}
        >
          {filtered.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-muted-foreground">
              Sin resultados
            </p>
          ) : (
            filtered.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt.id)}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                <IconCheck
                  className={cn(
                    "h-4 w-4 shrink-0",
                    value === opt.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="truncate">{opt.label}</span>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
