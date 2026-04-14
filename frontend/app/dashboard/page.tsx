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

  if (loading) return <p>Carregando dashboard...</p>;

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold">Total de Usuários</h2>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {data?.totalUsers}
          </p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold">Total de Produtos</h2>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {data?.totalProducts}
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-2 text-lg font-semibold">Usuário Logado</h2>
        <p><strong>Email:</strong> {data?.loggedUser.email}</p>
        <p><strong>Perfil:</strong> {data?.loggedUser.role}</p>
      </div>
    </div>
  );
}