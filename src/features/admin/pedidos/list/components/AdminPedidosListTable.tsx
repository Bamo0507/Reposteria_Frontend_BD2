"use client"

import { useRouter } from "next/navigation"
import { IconEye } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PedidoStatusBadge } from "./PedidoStatusBadge"
import { PaginationControls } from "./PaginationControls"
import type { useAdminPedidosList } from "../hooks/useAdminPedidosList"

interface AdminPedidosListTableProps {
  listState: ReturnType<typeof useAdminPedidosList>
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString("es-GT", { style: "currency", currency: "GTQ" })
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-GT")
}

const TABLE_HEADERS = (
  <TableRow className="bg-muted/50">
    <TableHead className="font-semibold">Usuario</TableHead>
    <TableHead className="font-semibold">Restaurante</TableHead>
    <TableHead className="font-semibold">Total</TableHead>
    <TableHead className="font-semibold">Estado</TableHead>
    <TableHead className="font-semibold">Fecha pedido</TableHead>
    <TableHead className="w-16 text-center"></TableHead>
  </TableRow>
)

export function AdminPedidosListTable({ listState }: AdminPedidosListTableProps) {
  const {
    pedidos,
    isLoading,
    error,
    refetch,
    changeStatus,
    isUpdatingStatus,
    currentPage,
    pageSize,
    total,
    totalPages,
    onPageChange,
    onPageSizeChange,
  } = listState

  const router = useRouter()

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="w-full overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="min-w-40">Usuario</TableHead>
                <TableHead className="min-w-48">Restaurante</TableHead>
                <TableHead className="w-32">Total</TableHead>
                <TableHead className="w-36">Estado</TableHead>
                <TableHead className="w-36">Fecha pedido</TableHead>
                <TableHead className="w-16 text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-44" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 mx-auto" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-border py-16 text-center">
        <p className="text-sm font-medium text-destructive">
          Error al cargar los pedidos
        </p>
        <p className="text-xs text-muted-foreground">
          {error instanceof Error ? error.message : "Error desconocido"}
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    )
  }

  if (pedidos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border py-16 text-center">
        <p className="text-sm font-medium text-foreground">No hay pedidos</p>
        <p className="text-xs text-muted-foreground">
          No se encontraron pedidos para el rango de fechas seleccionado.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="w-full overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>{TABLE_HEADERS}</TableHeader>
          <TableBody>
            {pedidos.map((pedido) => (
              <TableRow key={pedido._id} className="hover:bg-muted/50">
                <TableCell className="text-muted-foreground">
                  <div className="truncate max-w-[160px]">{pedido.nombre_usuario}</div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="truncate max-w-[180px]">{pedido.nombre_restaurante}</div>
                </TableCell>
                <TableCell className="text-muted-foreground tabular-nums">
                  {formatCurrency(pedido.total)}
                </TableCell>
                <TableCell
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <PedidoStatusBadge
                    pedidoId={pedido._id}
                    currentEstado={pedido.estado}
                    onChangeEstado={(estado) =>
                      changeStatus({ id: pedido._id, estado })
                    }
                    isLoading={isUpdatingStatus}
                  />
                </TableCell>
                <TableCell className="text-muted-foreground tabular-nums">
                  {formatDate(pedido.fecha_pedido)}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Ver detalle"
                    onClick={() => router.push(`/admin/pedidos/${pedido._id}`)}
                  >
                    <IconEye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        total={total}
      />
    </div>
  )
}
