import type { Metadata } from "next";
import { ClientPedidosPage } from "@/features/client/pedidos/components/ClientPedidosPage";

export const metadata: Metadata = {
  title: "Mis Pedidos — Sweet Lab",
};

export default function Page() {
  return <ClientPedidosPage />;
}