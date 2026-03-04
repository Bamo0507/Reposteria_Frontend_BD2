"use client"

import { useRouter } from "next/navigation"
import { IconEye, IconStar } from "@tabler/icons-react"
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
import type { useAdminReseniasList } from "../hooks/useAdminReseniasList"

interface AdminReseniasListTableProps {
  listState: ReturnType<typeof useAdminReseniasList>
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-GT")
}

function StarRating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <IconStar
          key={i}
          className={`h-3.5 w-3.5 ${i < value ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
        />
      ))}
    </span>
  )
}

const TABLE_HEADERS = (
  <TableRow className="bg-muted/50">
    <TableHead className="w-40 font-semibold">Título</TableHead>
    <TableHead className="font-semibold">Descripción</TableHead>
    <TableHead className="w-40 font-semibold">Puntuación</TableHead>
    <TableHead className="w-32 font-semibold">Fecha</TableHead>
    <TableHead className="w-16 text-center"></TableHead>
  </TableRow>
)

export function AdminReseniasListTable({ listState }: AdminReseniasListTableProps) {
  const {
    resenias,
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
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-40">Título</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="w-40">Puntuación</TableHead>
                <TableHead className="w-32">Fecha</TableHead>
                <TableHead className="w-16 text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-56" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
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
          Error al cargar las reseñas
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

  if (resenias.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border py-16 text-center">
        <p className="text-sm font-medium text-foreground">No hay reseñas</p>
        <p className="text-xs text-muted-foreground">
          No se encontraron reseñas para los filtros seleccionados.
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
            {resenias.map((resenia) => (
              <TableRow key={resenia._id} className="hover:bg-muted/50">
                <TableCell className="text-muted-foreground">
                  <div className="truncate max-w-40">{resenia.titulo}</div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="truncate">{resenia.descripcion}</div>
                </TableCell>
                <TableCell>
                  <StarRating value={resenia.puntuacion} />
                </TableCell>
                <TableCell className="text-muted-foreground tabular-nums">
                  {formatDate(resenia.fecha)}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Ver detalle"
                    onClick={() => router.push(`/admin/resenias/${resenia._id}`)}
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
