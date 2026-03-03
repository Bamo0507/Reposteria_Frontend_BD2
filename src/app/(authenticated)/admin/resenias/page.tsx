import type { Metadata } from "next";
import { AdminReseniasPage } from "@/features/admin/resenias/components/AdminReseniasPage";

export const metadata: Metadata = {
  title: "Reseñas — Sweet Lab",
};

export default function Page() {
  return <AdminReseniasPage />;
}