"use client"

import { useRouter } from "next/navigation"
import { IconChevronLeft } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdminProductoDetail } from "../hooks/useAdminProductoDetail"
import { ProductoProfileCard } from "./ProductoProfileCard"

interface AdminProductoDetailPageProps {
  id: string
}

export function AdminProductoDetailPage({ id }: AdminProductoDetailPageProps) {
  const router = useRouter()
  const { data: producto, isLoading, isError, refetch, update, isUpdating, updateStatus, isUpdatingStatus } = useAdminProductoDetail(id)

  if (isLoading) {
    return (
      <div className="space-y-6 w-full max-w-2xl mx-auto px-2 py-2 md:px-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-52" />
        </div>
        <Skeleton className="h-[560px]" />
      </div>
    )
  }

  if (isError || !producto) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 w-full max-w-2xl mx-auto py-24 text-center">
        <p className="text-sm font-medium text-destructive">Error al cargar el producto</p>
        <p className="text-xs text-muted-foreground">
          No se pudo obtener la información del producto solicitado.
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto px-2 py-2 md:px-4">
      <div className="space-y-1">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/productos")}
          className="px-2"
        >
          <IconChevronLeft className="mr-1 h-4 w-4" />
          Volver a productos
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{producto.nombre}</h1>
      </div>

      <ProductoProfileCard
        producto={producto}
        update={update}
        isUpdating={isUpdating}
        updateStatus={updateStatus}
        isUpdatingStatus={isUpdatingStatus}
      />
    </div>
  )
}
