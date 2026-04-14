"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ❌ Sem token
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      // 🔍 Decodifica token
      const payload = JSON.parse(atob(token.split(".")[1]));

      const isExpired = payload.exp * 1000 < Date.now();

      // ❌ Token expirado
      if (isExpired) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    } catch {
      // ❌ Token inválido
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, []);
}