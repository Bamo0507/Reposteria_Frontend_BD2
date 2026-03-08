import type { Metadata } from "next"
import { ClientPedidoDetailPage } from "@/features/client/pedidos/[id]/components/ClientPedidoDetailPage"

export const metadata: Metadata = {
  title: "Detalle de pedido — Sweet Lab",
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
  const { id } = await params
  return <ClientPedidoDetailPage id={id} />
}
