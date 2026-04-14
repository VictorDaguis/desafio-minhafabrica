"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/app/hooks/useAuth";
import api from "@/services/api";
import { DashboardData } from "@/types";

export default function DashboardPage() {
  useAuth();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const { data } = await api.get<DashboardData>("/dashboard");
        setData(data);
      } catch {
        toast.error("Erro ao carregar dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  return (
    <div className="p-6">
      {/* O título agora fica fora do loading, garantindo que apareça sempre */}
      <h1 className="mb-6 text-3xl font-bold text-[#1B2A4A]">Dashboard</h1>

      {loading ? (
        // Estado de Loading
        <div className="flex items-center gap-2 text-gray-500">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span>Carregando dashboard...</span>
        </div>
      ) : (
        // Conteúdo do Dashboard após carregar
        <div className="grid gap-6">
          {/* Aqui você insere seus cards, gráficos e dados vindos da variável 'data' */}
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-gray-600">Bem-vindo ao painel de controle.</p>
          </div>
        </div>
      )}
    </div>
  );
}