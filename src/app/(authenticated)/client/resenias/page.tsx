import type { Metadata } from "next";
import { ClientReseniasPage } from "@/features/client/resenias/list/components/ClientReseniasPage";

export const metadata: Metadata = {
  title: "Mis Reseñas — Sweet Lab",
};

export default function Page() {
  return <ClientReseniasPage />;
}