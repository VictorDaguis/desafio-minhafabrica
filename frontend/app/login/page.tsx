"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/services/api";
import { LoginResponse } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post<LoginResponse>("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      router.push("/admin/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Credenciais inválidas");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f6f9]">

      {/* Traços decorativos laranja */}
      <div className="absolute left-0 top-0 h-2 w-full bg-[#F47920]" />
      <div className="absolute -left-10 top-20 h-1 w-48 rotate-45 bg-[#F47920] opacity-40" />
      <div className="absolute -left-5 top-32 h-1 w-32 rotate-45 bg-[#1B2A4A] opacity-30" />
      <div className="absolute right-0 bottom-0 h-2 w-full bg-[#F47920]" />
      <div className="absolute -right-10 bottom-20 h-1 w-48 rotate-45 bg-[#F47920] opacity-40" />
      <div className="absolute -right-5 bottom-32 h-1 w-32 rotate-45 bg-[#1B2A4A] opacity-30" />

      <div className="w-full max-w-md px-4">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-1 text-4xl font-bold tracking-tight">
            <span className="text-[#F47920]">minha</span>
            <span className="text-[#1B2A4A]">fabrica</span>
            <span className="text-gray-400">.com</span>
          </div>
          <p className="text-sm text-gray-500">Painel Administrativo</p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4 rounded-2xl bg-white p-8 shadow-lg"
        >
          <h1 className="mb-2 text-xl font-semibold text-[#1B2A4A]">Entrar na sua conta</h1>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">E-mail</label>
            <input
              type="email"
              placeholder="admin@minhafabrica.com"
              className="rounded-lg border border-gray-300 p-3 text-gray-800 outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              className="rounded-lg border border-gray-300 p-3 text-gray-800 outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-[#F47920] p-3 font-semibold text-white transition hover:bg-[#d4661a] disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}