import type { Metadata } from "next";
import { AdminPedidoDetailPage } from "@/features/admin/pedidos/[id]/components/AdminPedidoDetailPage";

export const metadata: Metadata = {
  title: "Pedido — Sweet Lab",
};

export default function Page({ params }: { params: { id: string } }) {
  return <AdminPedidoDetailPage id={params.id} />;
}
