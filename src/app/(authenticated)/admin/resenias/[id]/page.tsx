import { AdminReseniaDetailPage } from "@/features/admin/resenias/[id]/components/AdminReseniaDetailPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <AdminReseniaDetailPage id={id} />;
}
