"use client"

import { useRouter } from "next/navigation"
import { IconChevronRight } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/features/admin/shared/components/StatusBadge"
import type { Producto } from "../../shared/types/producto.type"

interface ProductoCardProps {
  producto: Producto
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString("es-GT", { style: "currency", currency: "GTQ" })
}

export function ProductoCard({ producto }: ProductoCardProps) {
  const router = useRouter()

  return (
    <div className="flex rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="w-28 shrink-0 bg-muted flex items-center justify-center">
        {producto.imagen ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={producto.imagen}
            alt={producto.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-3xl select-none text-slate-500">?</span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-4 py-3 min-w-0">
        <div className="flex-1 space-y-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{producto.nombre}</p>
          <p className="text-sm text-muted-foreground tabular-nums">
            {formatCurrency(producto.precio)}
          </p>
          <StatusBadge active={producto.esActivo} />
        </div>

        <div className="flex justify-end mt-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground hover:text-foreground px-2"
            onClick={() => router.push(`/admin/productos/${producto._id}`)}
          >
            Ver detalles
            <IconChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
