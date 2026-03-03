import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Portal — Repostería",
  description: "Gestión de pedidos y reseñas para tu pastelería.",
};

export default function LoginPage() {
  return <LoginForm />;
}
