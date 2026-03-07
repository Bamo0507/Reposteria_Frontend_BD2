"use client"

import { useState } from "react"
import { IconSearch, IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CrearRestauranteDialog } from "./CrearRestauranteDialog"

interface AdminRestaurantesListHeaderProps {
  searchQuery: string
  onSearchChange: (q: string) => void
}

export function AdminRestaurantesListHeader({
  searchQuery,
  onSearchChange,
}: AdminRestaurantesListHeaderProps) {
  const [crearOpen, setCrearOpen] = useState(false)

  return (
    <>
      <div className="space-y-4 md:space-y-6">
        {/* Row 1: title + crear */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Restaurantes</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Gestiona los restaurantes de Sweet Lab
            </p>
          </div>
          <Button onClick={() => setCrearOpen(true)} className="shrink-0">
            <IconPlus className="h-4 w-4 mr-1" />
            Crear restaurante
          </Button>
        </div>

        {/* Row 2: search */}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-72">
            <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </div>

      <CrearRestauranteDialog open={crearOpen} onOpenChange={setCrearOpen} />
    </>
  )
}
