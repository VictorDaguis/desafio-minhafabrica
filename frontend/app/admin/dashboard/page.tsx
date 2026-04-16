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

  if (loading) return (
      <div className="flex items-center gap-2 text-[#1B2A4A] dark:text-gray-300">
        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Carregando dashboard...
      </div>
  );

  return (
      <div className="text-gray-900 dark:text-gray-100">
        <h1 className="mb-6 text-3xl font-bold text-[#1B2A4A] dark:text-white">Dashboard</h1>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
            <h2 className="text-lg font-semibold text-[#1B2A4A] dark:text-white">Total de Usuários</h2>
            <p className="mt-2 text-3xl font-bold text-[#1B2A4A] dark:text-white">{data?.totalUsers}</p>
          </div>
          <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
            <h2 className="text-lg font-semibold text-[#1B2A4A] dark:text-white">Total de Produtos</h2>
            <p className="mt-2 text-3xl font-bold text-[#1B2A4A] dark:text-white">{data?.totalProducts}</p>
          </div>
        </div>

        <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow">
          <h2 className="mb-2 text-lg font-semibold text-[#1B2A4A] dark:text-white">Usuário Logado</h2>
          <p className="text-gray-700 dark:text-gray-300"><strong>Email:</strong> {data?.loggedUser.email}</p>
          <p className="text-gray-700 dark:text-gray-300"><strong>Perfil:</strong> {data?.loggedUser.role}</p>
        </div>
      </div>
  );
}