import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginUser } from "../auth-api";
import type { LoginRequest } from "../types/auth.types";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => loginUser(credentials),
    onSuccess: (data) => {
      localStorage.setItem("_id", data._id);
      localStorage.setItem("nombre_usuario", data.nombre_usuario);
      localStorage.setItem("tipo_usuario", data.tipo_usuario);
      router.push(data.tipo_usuario === "admin" ? "/admin" : "/client");
    },
  });
}