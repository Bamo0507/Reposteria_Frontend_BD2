"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { IconEye, IconTrash, IconClock, IconRotate2 } from "@tabler/icons-react"
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
import { StatusBadge } from "@/features/admin/shared/components/StatusBadge"
import { HorariosModal } from "./HorariosModal"
import type { Restaurante } from "../../shared/types/restaurante.type"
import type { useAdminRestaurantesList } from "../hooks/useAdminRestaurantesList"

interface AdminRestaurantesListTableProps {
  listState: ReturnType<typeof useAdminRestaurantesList>
}

const TABLE_HEADERS = (
  <TableRow className="bg-muted/50">
    <TableHead className="w-[25%] font-semibold">Nombre</TableHead>
    <TableHead className="w-[30%] font-semibold">Ubicacion</TableHead>
    <TableHead className="w-[25%] font-semibold">Telefono</TableHead>
    <TableHead className="w-[12%] font-semibold">Estado</TableHead>
    <TableHead className="w-[12%] text-right"></TableHead>
  </TableRow>
)

export function AdminRestaurantesListTable({ listState }: AdminRestaurantesListTableProps) {
  const {
    restaurantes,
    isLoading,
    error,
    refetch,
    toggleStatus,
    currentPage,
    pageSize,
    total,
    totalPages,
    onPageChange,
    onPageSizeChange,
  } = listState

  const router = useRouter()
  const [horariosOpen, setHorariosOpen] = useState(false)
  const [selectedHorarios, setSelectedHorarios] = useState<Restaurante["horarios_de_atencion"] | null>(null)

  const handleOpenHorarios = (horarios: Restaurante["horarios_de_atencion"]) => {
    setSelectedHorarios(horarios)
    setHorariosOpen(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="w-full overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>{TABLE_HEADERS}</TableHeader>
            <TableBody>
              {Array.from({ length: pageSize }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-3/4" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-3/4" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-24 mx-auto" /></TableCell>
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
          Error al cargar los restaurantes
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

  if (restaurantes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border py-16 text-center">
        <p className="text-sm font-medium text-foreground">No hay restaurantes</p>
        <p className="text-xs text-muted-foreground">
          No se encontraron restaurantes para los filtros seleccionados.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
        <div className="w-full overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>{TABLE_HEADERS}</TableHeader>
            <TableBody>
              {restaurantes.map((restaurante) => (
                <TableRow key={restaurante._id} className="hover:bg-muted/50">
                  <TableCell className="text-muted-foreground">
                    <div className="truncate">{restaurante.nombre_restaurante}</div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <div className="truncate">
                      {`${restaurante.ubicacion.calle}, ${restaurante.ubicacion.avenida}, Zona ${restaurante.ubicacion.zona}`}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">
                    {restaurante.telefono.join(" | ")}
                  </TableCell>
                  <TableCell>
                    <StatusBadge active={restaurante.esActivo} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Ver horarios"
                        onClick={() => handleOpenHorarios(restaurante.horarios_de_atencion)}
                      >
                        <IconClock className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Ver detalle"
                        onClick={() => router.push(`/admin/restaurantes/${restaurante._id}`)}
                      >
                        <IconEye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={restaurante.esActivo ? "Desactivar" : "Activar"}
                        onClick={() => toggleStatus({ id: restaurante._id, esActivo: restaurante.esActivo })}
                      >
                        {restaurante.esActivo ? (
                          <IconTrash className="h-4 w-4 text-destructive" />
                        ) : (
                          <IconRotate2 className="h-4 w-4 text-green-600" />
                        )}
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

      <HorariosModal
        open={horariosOpen}
        onOpenChange={setHorariosOpen}
        horarios={selectedHorarios}
      />
    </>
  )
}
