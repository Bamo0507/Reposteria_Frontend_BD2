import type { Metadata } from "next";
import { AdminProductosListPage } from "@/features/admin/productos/list/components/AdminProductosListPage";

export const metadata: Metadata = {
  title: "Productos — Sweet Lab",
};

export default function Page() {
  return <AdminProductosListPage />;
}
