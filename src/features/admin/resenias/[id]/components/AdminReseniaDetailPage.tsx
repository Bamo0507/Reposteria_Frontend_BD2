"use client"

import { useRouter } from "next/navigation"
import { IconChevronLeft } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdminReseniaDetail } from "../hooks/useAdminReseniaDetail"
import { ReseniaInfoCard } from "./ReseniaInfoCard"

interface AdminReseniaDetailPageProps {
  id: string
}

export function AdminReseniaDetailPage({ id }: AdminReseniaDetailPageProps) {
  const router = useRouter()
  const { data: resenia, isLoading, isError, refetch } = useAdminReseniaDetail(id)

  if (isLoading) {
    return (
      <div className="space-y-6 w-full max-w-3xl mx-auto px-2 py-2 md:px-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-[520px]" />
      </div>
    )
  }

  if (isError || !resenia) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 w-full max-w-3xl mx-auto py-24 text-center">
        <p className="text-sm font-medium text-destructive">
          Error al cargar la reseña
        </p>
        <p className="text-xs text-muted-foreground">
          No se pudo obtener la información de la reseña solicitada.
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto px-2 py-2 md:px-4">
      <div className="space-y-1">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/resenias")}
          className="px-2"
        >
          <IconChevronLeft className="mr-1 h-4 w-4" />
          Volver a reseñas
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          Reseña de {resenia.nombre_usuario}
        </h1>
        <p className="text-sm text-muted-foreground">{resenia.nombre_restaurante}</p>
      </div>

      <ReseniaInfoCard resenia={resenia} />
    </div>
  )
}
