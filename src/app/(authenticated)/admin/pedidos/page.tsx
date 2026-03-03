import type { Metadata } from "next";
import { AdminPedidosPage } from "@/features/admin/pedidos/components/AdminPedidosPage";

export const metadata: Metadata = {
  title: "Pedidos — Sweet Lab",
};

export default function Page() {
  return <AdminPedidosPage />;
}