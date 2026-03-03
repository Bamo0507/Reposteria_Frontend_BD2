import { apiClient } from "@/lib/api/apiClient";
import type { LoginRequest, LoginResponse } from "./types/auth.types";

export async function loginUser(body: LoginRequest): Promise<LoginResponse> {
  return apiClient.post<LoginResponse>("/auth/login", body);
}