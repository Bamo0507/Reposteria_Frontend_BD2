import type { Metadata } from "next";
import { ProductosPage } from "@/features/admin/productos/components/ProductosPage";

export const metadata: Metadata = {
  title: "Productos — Sweet Lab",
};

export default function Page() {
  return <ProductosPage />;
}