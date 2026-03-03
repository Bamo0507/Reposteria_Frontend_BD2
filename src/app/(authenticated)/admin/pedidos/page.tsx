import type { Metadata } from "next";
import { AdminPedidosListPage } from "@/features/admin/pedidos/list/components/AdminPedidosListPage";

export const metadata: Metadata = {
  title: "Pedidos — Sweet Lab",
};

export default function Page() {
  return <AdminPedidosListPage />;
}