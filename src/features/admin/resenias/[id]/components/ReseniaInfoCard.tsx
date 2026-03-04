"use client"

import { IconStar } from "@tabler/icons-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ReseniaDetalle } from "../../shared/types/resenia.type"

interface ReseniaInfoCardProps {
  resenia: ReseniaDetalle
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString("es-GT", { style: "currency", currency: "GTQ" })
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-GT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function StarIcons({ value }: { value: number }) {
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

export function ReseniaInfoCard({ resenia }: ReseniaInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de la reseña</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label className="font-semibold">Título</Label>
            <Input
              value={resenia.titulo}
              readOnly
              className="cursor-default focus-visible:ring-0"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label className="font-semibold">Descripción</Label>
            <Input
              value={resenia.descripcion}
              readOnly
              className="cursor-default focus-visible:ring-0"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold flex items-center gap-2">
              Puntuación
              <StarIcons value={resenia.puntuacion} />
            </Label>
            <Input
              value={`${resenia.puntuacion} / 5`}
              readOnly
              className="cursor-default focus-visible:ring-0 tabular-nums"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Fecha</Label>
            <Input
              value={formatDate(resenia.fecha)}
              readOnly
              className="cursor-default focus-visible:ring-0"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Usuario</Label>
            <Input
              value={resenia.nombre_usuario}
              readOnly
              className="cursor-default focus-visible:ring-0"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Restaurante</Label>
            <Input
              value={resenia.nombre_restaurante}
              readOnly
              className="cursor-default focus-visible:ring-0"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Total del pedido</Label>
            <Input
              value={formatCurrency(resenia.total)}
              readOnly
              className="cursor-default focus-visible:ring-0 tabular-nums"
            />
          </div>
        </div>

        <Separator />

        {/* Products table */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Productos del pedido</h3>
          <div className="rounded-lg border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Precio unitario</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resenia.productos.map((producto, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{producto.nombre}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {producto.cantidad}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {formatCurrency(producto.precio_unitario)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {formatCurrency(producto.cantidad * producto.precio_unitario)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
