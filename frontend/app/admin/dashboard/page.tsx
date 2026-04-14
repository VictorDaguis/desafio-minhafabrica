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

  if (loading) return <p className="text-[#1B2A4A]">Carregando dashboard...</p>;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-[#1B2A4A]">Dashboard</h1>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-[#1B2A4A]">Total de Usuários</h2>
          <p className="mt-2 text-3xl font-bold text-[#1B2A4A]">{data?.totalUsers}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-[#1B2A4A]">Total de Produtos</h2>
          <p className="mt-2 text-3xl font-bold text-[#1B2A4A]">{data?.totalProducts}</p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-2 text-lg font-semibold text-[#1B2A4A]">Usuário Logado</h2>
        <p className="text-gray-700"><strong>Email:</strong> {data?.loggedUser.email}</p>
        <p className="text-gray-700"><strong>Perfil:</strong> {data?.loggedUser.role}</p>
      </div>
    </div>
  );
}