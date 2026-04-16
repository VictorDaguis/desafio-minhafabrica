"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "@/app/hooks/useAuth";
import api from "@/services/api";
import { User, UserFormData } from "@/types";

interface PaginatedResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const emptyForm: UserFormData = { name: "", email: "", password: "", role: "user" };

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function UsuariosPage() {
  useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<UserFormData>(emptyForm);
  const [creating, setCreating] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<UserFormData>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function fetchUsers() {
    setLoading(true);
    try {
      const { data } = await api.get<PaginatedResponse>("/users", {
        params: { page: currentPage, limit, search: search || undefined },
      });
      setUsers(data.data);
      setTotalPages(data.totalPages);
      setTotalItems(data.total);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : "Erro ao carregar usuários";
      toast.error(message || "Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [currentPage, search]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!createForm.name || !createForm.email || !createForm.password) {
      toast.error("Nome, e-mail e senha são obrigatórios");
      return;
    }
    if (!isValidEmail(createForm.email)) {
      toast.error("E-mail inválido");
      return;
    }
    setCreating(true);
    try {
      await api.post("/users", createForm);
      toast.success("Usuário criado!");
      setCreateForm(emptyForm);
      setCreateOpen(false);
      fetchUsers();
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : "Erro ao criar usuário";
      toast.error(message || "Erro ao criar usuário");
    } finally {
      setCreating(false);
    }
  }

  function openEdit(user: User) {
    setEditId(user._id);
    setEditForm({ name: user.name, email: user.email, password: "", role: user.role });
    setEditOpen(true);
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editForm.name || !editForm.email) {
      toast.error("Nome e e-mail são obrigatórios");
      return;
    }
    if (!isValidEmail(editForm.email)) {
      toast.error("E-mail inválido");
      return;
    }
    setEditing(true);
    try {
      const body: Partial<UserFormData> = { name: editForm.name, email: editForm.email, role: editForm.role };
      if (editForm.password) body.password = editForm.password;
      await api.put(`/users/${editId}`, body);
      toast.success("Usuário atualizado!");
      setEditOpen(false);
      fetchUsers();
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : "Erro ao atualizar usuário";
      toast.error(message || "Erro ao atualizar usuário");
    } finally {
      setEditing(false);
    }
  }

  function openConfirm(id: string) {
    setDeleteId(id);
    setConfirmOpen(true);
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await api.delete(`/users/${deleteId}`);
      toast.success("Usuário excluído!");
      setConfirmOpen(false);
      fetchUsers();
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : "Erro ao excluir usuário";
      toast.error(message || "Erro ao excluir usuário");
    }
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  }

  return (
      <div className="text-gray-900 dark:text-gray-100">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#1B2A4A] dark:text-white">Usuários</h1>
          <button
              onClick={() => setCreateOpen(true)}
              className="rounded bg-[#F47920] px-4 py-2 font-semibold text-white hover:bg-[#d4661a] dark:bg-orange-600 dark:hover:bg-orange-700"
          >
            Novo Usuário
          </button>
        </div>

        <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="mb-4 w-full max-w-md rounded border p-2 text-gray-800 dark:text-gray-200 dark:bg-gray-800 dark:border-gray-600"
        />

        {loading ? (
            <div className="flex items-center gap-2 text-[#1B2A4A] dark:text-gray-300">
              <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Carregando usuários...
            </div>
        ) : (
            <>
              <div className="overflow-x-auto rounded shadow">
                <table className="w-full bg-white dark:bg-gray-800">
                  <thead>
                  <tr className="bg-[#1B2A4A] dark:bg-gray-900 text-left text-white">
                    <th className="p-3">Nome</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Perfil</th>
                    <th className="p-3">Ações</th>
                  </tr>
                  </thead>
                  <tbody>
                  {users.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-gray-500 dark:text-gray-400">
                          Nenhum usuário encontrado.
                        </td>
                      </tr>
                  ) : (
                      users.map((user) => (
                          <tr key={user._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="p-3 text-gray-800 dark:text-gray-200">{user.name}</td>
                            <td className="p-3 text-gray-800 dark:text-gray-200">{user.email}</td>
                            <td className="p-3 capitalize text-gray-800 dark:text-gray-200">{user.role}</td>
                            <td className="flex gap-2 p-3">
                              <button
                                  onClick={() => openEdit(user)}
                                  className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
                              >
                                Editar
                              </button>
                              <button
                                  onClick={() => openConfirm(user._id)}
                                  className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                              >
                                Excluir
                              </button>
                            </td>
                          </tr>
                      ))
                  )}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Mostrando {users.length} de {totalItems} usuário(s)
                </div>
                <div className="flex gap-2">
                  <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="rounded border px-3 py-1 text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <span className="px-3 py-1 text-gray-700 dark:text-gray-300">
                Página {currentPage} de {totalPages}
              </span>
                  <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="rounded border px-3 py-1 text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            </>
        )}

        {/* MODAL CRIAR */}
        {createOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
              <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-bold text-[#1B2A4A] dark:text-white">Novo Usuário</h2>
                <form onSubmit={handleCreate} className="flex flex-col gap-3">
                  <input
                      placeholder="Nome *"
                      value={createForm.name}
                      onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                      className="rounded border p-2 text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <input
                      type="email"
                      placeholder="E-mail *"
                      value={createForm.email}
                      onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                      className="rounded border p-2 text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <input
                      type="password"
                      placeholder="Senha *"
                      value={createForm.password}
                      onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                      className="rounded border p-2 text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <select
                      value={createForm.role}
                      onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                      className="rounded border p-2 text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="user">Usuário</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setCreateOpen(false)}
                        className="flex-1 rounded border px-4 py-2 text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={creating}
                        className="flex-1 rounded bg-[#F47920] px-4 py-2 font-semibold text-white hover:bg-[#d4661a] dark:bg-orange-600 dark:hover:bg-orange-700 disabled:opacity-50"
                    >
                      {creating ? "Criando..." : "Criar"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {/* MODAL EDITAR */}
        {editOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
              <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-bold text-[#1B2A4A] dark:text-white">Editar Usuário</h2>
                <form onSubmit={handleEdit} className="flex flex-col gap-3">
                  <input
                      placeholder="Nome *"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="rounded border p-2 text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <input
                      type="email"
                      placeholder="E-mail *"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="rounded border p-2 text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <input
                      type="password"
                      placeholder="Nova senha (deixe vazio para não alterar)"
                      value={editForm.password}
                      onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                      className="rounded border p-2 text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <select
                      value={editForm.role}
                      onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                      className="rounded border p-2 text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="user">Usuário</option>
                    <option value="admin">Admin</option>
                  </select>
                  <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => setEditOpen(false)}
                        className="flex-1 rounded border px-4 py-2 text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={editing}
                        className="flex-1 rounded bg-[#1B2A4A] px-4 py-2 font-semibold text-white hover:bg-[#243660] dark:bg-blue-800 dark:hover:bg-blue-900 disabled:opacity-50"
                    >
                      {editing ? "Salvando..." : "Salvar"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {/* MODAL DELETE */}
        {confirmOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
              <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg">
                <h2 className="mb-2 text-lg font-bold text-[#1B2A4A] dark:text-white">Confirmar exclusão</h2>
                <p className="mb-4 text-gray-600 dark:text-gray-300">Tem certeza que deseja excluir este usuário?</p>
                <div className="flex gap-2">
                  <button
                      onClick={() => setConfirmOpen(false)}
                      className="flex-1 rounded border px-4 py-2 text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                      onClick={handleDelete}
                      className="flex-1 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}