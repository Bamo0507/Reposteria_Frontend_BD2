import type { Metadata } from "next";
import { AdminReseniasListPage } from "@/features/admin/resenias/list/components/AdminReseniasListPage";

export const metadata: Metadata = {
  title: "Reseñas — Sweet Lab",
};

export default function Page() {
  return <AdminReseniasListPage />;
}
