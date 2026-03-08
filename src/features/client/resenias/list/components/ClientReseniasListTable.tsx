"use client"

import { useRouter } from "next/navigation"
import { IconEye, IconStar, IconTrash } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import type { useClientReseniasList } from "../hooks/useClientReseniasList"

interface ClientReseniasListTableProps {
  listState: ReturnType<typeof useClientReseniasList>
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

export function ClientReseniasListTable({ listState }: ClientReseniasListTableProps) {
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
    selectionMode,
    selectedIds,
    toggleSelection,
    toggleSelectAll,
    deleteResenia,
    isDeleting,
  } = listState

  const router = useRouter()
  const allSelected = resenias.length > 0 && selectedIds.size === resenias.length

  const TABLE_HEADERS = (
    <TableRow className="bg-muted/50">
      {selectionMode && (
        <TableHead className="w-10">
          <Checkbox
            checked={allSelected}
            onCheckedChange={toggleSelectAll}
            aria-label="Seleccionar todos"
          />
        </TableHead>
      )}
      <TableHead className="w-40 font-semibold">Título</TableHead>
      <TableHead className="w-56 font-semibold">Descripción</TableHead>
      <TableHead className="w-44 font-semibold">Restaurante</TableHead>
      <TableHead className="w-36 font-semibold">Puntuación</TableHead>
      <TableHead className="w-32 font-semibold">Fecha</TableHead>
      <TableHead className="w-20 text-right"></TableHead>
    </TableRow>
  )

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="w-full overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>{TABLE_HEADERS}</TableHeader>
            <TableBody>
              {Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i}>
                  {selectionMode && <TableCell><Skeleton className="h-4 w-4" /></TableCell>}
                  <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-52" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </TableCell>
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
        <p className="text-sm font-medium text-destructive">Error al cargar las reseñas</p>
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
                {selectionMode && (
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(resenia._id)}
                      onCheckedChange={() => toggleSelection(resenia._id)}
                      aria-label="Seleccionar reseña"
                    />
                  </TableCell>
                )}
                <TableCell className="text-muted-foreground">
                  <div className="truncate max-w-40">{resenia.titulo}</div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="truncate">{resenia.descripcion}</div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  <div className="truncate max-w-44">{resenia.nombre_restaurante}</div>
                </TableCell>
                <TableCell>
                  <StarRating value={resenia.puntuacion} />
                </TableCell>
                <TableCell className="text-muted-foreground tabular-nums">
                  {formatDate(resenia.fecha)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Eliminar reseña"
                      disabled={isDeleting}
                      onClick={() => deleteResenia(resenia._id)}
                    >
                      <IconTrash className="h-4 w-4 text-destructive" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Ver detalle"
                      onClick={() => router.push(`/client/resenias/${resenia._id}`)}
                    >
                      <IconEye className="h-4 w-4" />
                    </Button>
                  </div>
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
