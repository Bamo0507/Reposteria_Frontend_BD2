"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ProductoCard } from "./ProductoCard"
import type { useAdminProductosList } from "../hooks/useAdminProductosList"

interface AdminProductosGridProps {
  listState: ReturnType<typeof useAdminProductosList>
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex rounded-xl border border-border overflow-hidden h-28">
          <Skeleton className="w-28 shrink-0 rounded-none" />
          <div className="flex flex-col flex-1 px-4 py-3 gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/3" />
            <div className="flex justify-end mt-auto">
              <Skeleton className="h-8 w-28" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function AdminProductosGrid({ listState }: AdminProductosGridProps) {
  const { productos, isLoading, error, refetch } = listState

  if (isLoading) return <GridSkeleton />

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border py-16 text-center">
        <p className="text-sm font-medium text-destructive">Error al cargar los productos</p>
        <p className="text-xs text-muted-foreground">
          {error instanceof Error ? error.message : "Error desconocido"}
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    )
  }

  if (productos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border py-16 text-center">
        <p className="text-sm font-medium text-foreground">No hay productos</p>
        <p className="text-xs text-muted-foreground">
          No se encontraron productos con ese nombre.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {productos.map((producto) => (
        <ProductoCard key={producto._id} producto={producto} />
      ))}
    </div>
  )
}
