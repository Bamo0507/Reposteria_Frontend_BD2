"use client"

import { useRouter } from "next/navigation"
import { IconChevronLeft } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdminRestauranteDetail } from "../hooks/useAdminRestauranteDetail"
import { RestauranteProfileCard } from "./RestauranteProfileCard"

interface AdminRestauranteDetailPageProps {
  id: string
}

export function AdminRestauranteDetailPage({ id }: AdminRestauranteDetailPageProps) {
  const router = useRouter()
  const { data: restaurante, isLoading, isError, refetch, update, isUpdating } = useAdminRestauranteDetail(id)

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

  if (isError || !restaurante) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 w-full max-w-2xl mx-auto py-24 text-center">
        <p className="text-sm font-medium text-destructive">Error al cargar el restaurante</p>
        <p className="text-xs text-muted-foreground">
          No se pudo obtener la informacion del restaurante solicitado.
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
          onClick={() => router.push("/admin/restaurantes")}
          className="px-2"
        >
          <IconChevronLeft className="mr-1 h-4 w-4" />
          Volver a restaurantes
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{restaurante.nombre_restaurante}</h1>
      </div>

      <RestauranteProfileCard
        restaurante={restaurante}
        update={update}
        isUpdating={isUpdating}
      />
    </div>
  )
}
