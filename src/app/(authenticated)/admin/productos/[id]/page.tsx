import { AdminProductoDetailPage } from "@/features/admin/productos/[id]/components/AdminProductoDetailPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <AdminProductoDetailPage id={id} />;
}
