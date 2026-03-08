import type { Metadata } from "next"
import { ClientReseniaDetailPage } from "@/features/client/resenias/[id]/components/ClientReseniaDetailPage"

export const metadata: Metadata = {
  title: "Detalle de reseña — Sweet Lab",
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
  const { id } = await params
  return <ClientReseniaDetailPage id={id} />
}
