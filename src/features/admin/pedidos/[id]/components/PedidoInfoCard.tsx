"use client"

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
import { getPedidoEstadoLabel } from "../../shared/types/pedido.type"
import type { PedidoDetalle } from "../../shared/types/pedido.type"

interface PedidoInfoCardProps {
  pedido: PedidoDetalle
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

export function PedidoInfoCard({ pedido }: PedidoInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del pedido</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="font-semibold">Usuario</Label>
            <Input
              value={pedido.nombre_usuario}
              readOnly
              className="cursor-default focus-visible:ring-0"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Restaurante</Label>
            <Input
              value={pedido.nombre_restaurante}
              readOnly
              className="cursor-default focus-visible:ring-0"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Total</Label>
            <Input
              value={formatCurrency(pedido.total)}
              readOnly
              className="cursor-default focus-visible:ring-0 tabular-nums"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Estado</Label>
            <Input
              value={getPedidoEstadoLabel(pedido.estado)}
              readOnly
              className="cursor-default focus-visible:ring-0"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label className="font-semibold">Fecha del pedido</Label>
            <Input
              value={formatDate(pedido.fecha_pedido)}
              readOnly
              className="cursor-default focus-visible:ring-0"
            />
          </div>
        </div>

        <Separator />

        {/* Products table */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Productos</h3>
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
                {pedido.productos.map((producto, index) => (
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
