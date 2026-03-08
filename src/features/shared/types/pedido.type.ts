export type PedidoEstado = "En cocina" | "En camino" | "Recibido"

export function getPedidoEstadoLabel(estado: PedidoEstado): string {
  const labels: Record<PedidoEstado, string> = {
    "En cocina": "En cocina",
    "En camino": "En camino",
    Recibido: "Recibido",
  }
  return labels[estado] ?? estado
}

export type EstadoColorKey = "cocina" | "camino" | "recibido"

export function getPedidoEstadoColorKey(estado: PedidoEstado): EstadoColorKey {
  const map: Record<PedidoEstado, EstadoColorKey> = {
    "En cocina": "cocina",
    "En camino": "camino",
    Recibido: "recibido",
  }
  return map[estado] ?? "cocina"
}

export const ESTADO_COLOR_CLASSES: Record<
  EstadoColorKey,
  { bg: string; text: string; dot: string }
> = {
  cocina: {
    bg: "bg-amber-100 hover:bg-amber-100",
    text: "text-amber-800",
    dot: "bg-amber-500",
  },
  camino: {
    bg: "bg-blue-100 hover:bg-blue-100",
    text: "text-blue-800",
    dot: "bg-blue-500",
  },
  recibido: {
    bg: "bg-green-100 hover:bg-green-100",
    text: "text-green-800",
    dot: "bg-green-500",
  },
}

export const PEDIDO_ESTADOS: PedidoEstado[] = ["En cocina", "En camino", "Recibido"]
