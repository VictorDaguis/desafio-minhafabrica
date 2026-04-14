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
    <div>
      {/* Header idêntico ao de Produtos */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#1B2A4A]">Dashboard</h1>
      </div>

      {loading ? (
        // Spinner com a mesma cor e estilo de Produtos
        <div className="flex items-center gap-2 text-[#1B2A4A]">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Carregando dashboard...
        </div>
      ) : (
        <div className="grid gap-6 text-gray-800">
           {/* Seus cards e gráficos entram aqui */}
           <p>Dashboard pronto!</p>
        </div>
      )}
    </div>
  );
}