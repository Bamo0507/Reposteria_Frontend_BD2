"use client"

import { useRouter } from "next/navigation"
import { IconChevronLeft } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdminPedidoDetail } from "../hooks/useAdminPedidoDetail"
import { PedidoInfoCard } from "./PedidoInfoCard"

interface AdminPedidoDetailPageProps {
  id: string
}

export function AdminPedidoDetailPage({ id }: AdminPedidoDetailPageProps) {
  const router = useRouter()
  const { data: pedido, isLoading, isError, refetch } = useAdminPedidoDetail(id)

  if (isLoading) {
    return (
      <div className="space-y-6 w-full max-w-3xl mx-auto px-2 py-2 md:px-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-[480px]" />
      </div>
    )
  }

  if (isError || !pedido) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 w-full max-w-3xl mx-auto py-24 text-center">
        <p className="text-sm font-medium text-destructive">
          Error al cargar el pedido
        </p>
        <p className="text-xs text-muted-foreground">
          No se pudo obtener la información del pedido solicitado.
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
          onClick={() => router.push("/admin/pedidos")}
          className="px-2"
        >
          <IconChevronLeft className="mr-1 h-4 w-4" />
          Volver a pedidos
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">
          Pedido de {pedido.nombre_usuario}
        </h1>
        <p className="text-sm text-muted-foreground">{pedido.nombre_restaurante}</p>
      </div>

      <PedidoInfoCard pedido={pedido} />
    </div>
  )
}
