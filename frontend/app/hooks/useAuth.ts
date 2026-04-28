"use client";
//hook customizado que verifica se o usuário está autenticado. Ele lê o token do localStorage, verifica se não expirou decodificando o payload do JWT, e redireciona para /login se não estiver autenticado. É chamado no topo de cada página protegida com useAuth().
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    //  Sem token
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      //  Decodifica token
      const payload = JSON.parse(atob(token.split(".")[1]));

      const isExpired = payload.exp * 1000 < Date.now();

      //  Token expirado
      if (isExpired) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    } catch {
      //  Token inválido
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, []);
}
