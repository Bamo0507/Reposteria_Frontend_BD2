import type { Metadata } from "next";
import { DashboardPage } from "@/features/admin/dashboard/components/DashboardPage";

export const metadata: Metadata = {
  title: "Dashboard — Sweet Lab",
};

export default function Page() {
  return <DashboardPage />;
}