import type { Metadata } from "next"
import { AdminRestaurantesListPage } from "@/features/admin/restaurantes/list/components/AdminRestaurantesListPage"

export const metadata: Metadata = {
  title: "Restaurantes — Sweet Lab",
}

export default function Page() {
  return <AdminRestaurantesListPage />
}