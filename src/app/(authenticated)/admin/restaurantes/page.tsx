import type { Metadata } from "next";
import { RestaurantesPage } from "@/features/admin/restaurantes/components/RestaurantesPage";

export const metadata: Metadata = {
  title: "Restaurantes — Sweet Lab",
};

export default function Page() {
  return <RestaurantesPage />;
}