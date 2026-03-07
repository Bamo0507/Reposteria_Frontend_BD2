import { AdminRestauranteDetailPage } from "@/features/admin/restaurantes/[id]/components/AdminRestauranteDetailPage"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <AdminRestauranteDetailPage id={id} />
}
