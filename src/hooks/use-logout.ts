"use client"

import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();

  const logout = () => {
    // Redirect to login page
    router.push("/");
    router.refresh(); // Ensure client-side state is updated
  };

  return logout;
}
