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
import { PaginationControls } from "@/features/admin/shared/components/PaginationControls"
import {
  getClientPedidoEstadoLabel,
  getClientPedidoEstadoColorKey,
  ESTADO_COLOR_CLASSES,
} from "../../shared/types"
import type { useClientPedidosList } from "../hooks/useClientPedidosList"

interface ClientPedidosListTableProps {
  listState: ReturnType<typeof useClientPedidosList>
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString("es-GT", { style: "currency", currency: "GTQ" })
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-GT")
}

const TABLE_HEADERS = (
  <TableRow className="bg-muted/50">
    <TableHead className="w-64 font-semibold">Restaurante</TableHead>
    <TableHead className="w-36 font-semibold">Total</TableHead>
    <TableHead className="w-32 font-semibold">Estado</TableHead>
    <TableHead className="w-36 font-semibold">Fecha pedido</TableHead>
    <TableHead className="w-16 text-right"></TableHead>
  </TableRow>
)

export function ClientPedidosListTable({ listState }: ClientPedidosListTableProps) {
  const {
    pedidos,
    isLoading,
    error,
    refetch,
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
            <TableHeader>{TABLE_HEADERS}</TableHeader>
            <TableBody>
              {Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell className="flex justify-end"><Skeleton className="h-8 w-8" /></TableCell>
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
        <p className="text-sm font-medium text-destructive">Error al cargar los pedidos</p>
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
            {pedidos.map((pedido) => {
              const colorKey = getClientPedidoEstadoColorKey(pedido.estado)
              const colors = ESTADO_COLOR_CLASSES[colorKey]
              return (
                <TableRow key={pedido._id} className="hover:bg-muted/50">
                  <TableCell className="text-muted-foreground">
                    <div>{pedido.nombre_restaurante}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">
                    {formatCurrency(pedido.total)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
                      {getClientPedidoEstadoLabel(pedido.estado)}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">
                    {formatDate(pedido.fecha_pedido)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Ver detalle"
                      onClick={() => router.push(`/client/pedidos/${pedido._id}`)}
                    >
                      <IconEye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
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
