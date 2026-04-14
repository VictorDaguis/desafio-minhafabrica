"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/app/hooks/useAuth";
import api from "@/services/api";
import { User } from "@/types";

const emptyForm = { name: "", email: "", password: "", role: "user" };

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function UsuariosPage() {
  useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function fetchUsers() {
    try {
      const { data } = await api.get<User[]>("/users");
      setUsers(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchUsers(); }, []);

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
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao criar usuário");
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
      const body: any = { name: editForm.name, email: editForm.email, role: editForm.role };
      if (editForm.password) body.password = editForm.password;
      await api.put(`/users/${editId}`, body);
      toast.success("Usuário atualizado!");
      setEditOpen(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Erro ao atualizar usuário");
    } finally {
      setEditing(false);
    }
  }

  function openConfirm(id: string) { setDeleteId(id); setConfirmOpen(true); }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await api.delete(`/users/${deleteId}`);
      toast.success("Usuário excluído!");
      setConfirmOpen(false);
      fetchUsers();
    } catch {
      toast.error("Erro ao excluir usuário");
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#1B2A4A]">Usuários</h1>
        <button
          onClick={() => setCreateOpen(true)}
          className="rounded bg-[#F47920] px-4 py-2 font-semibold text-white hover:bg-[#d4661a]"
        >
          Novo Usuário
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-[#1B2A4A]">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Carregando usuários...
        </div>
      ) : (
        <div className="overflow-x-auto rounded shadow">
          <table className="w-full bg-white">
            <thead>
              <tr className="bg-[#1B2A4A] text-left text-white">
                <th className="p-3">Nome</th>
                <th className="p-3">Email</th>
                <th className="p-3">Perfil</th>
                <th className="p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-gray-800">{user.name}</td>
                  <td className="p-3 text-gray-800">{user.email}</td>
                  <td className="p-3 capitalize text-gray-800">{user.role}</td>
                  <td className="flex gap-2 p-3">
                    <button onClick={() => openEdit(user)} className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600">Editar</button>
                    <button onClick={() => openConfirm(user._id)} className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL CRIAR */}
      {createOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-[#1B2A4A]">Novo Usuário</h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <input placeholder="Nome *" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} className="rounded border p-2 text-gray-800" />
              <input type="email" placeholder="E-mail *" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} className="rounded border p-2 text-gray-800" />
              <input type="password" placeholder="Senha *" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} className="rounded border p-2 text-gray-800" />
              <select value={createForm.role} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })} className="rounded border p-2 text-gray-800">
                <option value="user">Usuário</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex gap-2">
                <button type="button" onClick={() => setCreateOpen(false)} className="flex-1 rounded border px-4 py-2 text-gray-700 hover:bg-gray-100">Cancelar</button>
                <button type="submit" disabled={creating} className="flex-1 rounded bg-[#F47920] px-4 py-2 font-semibold text-white hover:bg-[#d4661a] disabled:opacity-50">{creating ? "Criando..." : "Criar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {editOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-[#1B2A4A]">Editar Usuário</h2>
            <form onSubmit={handleEdit} className="flex flex-col gap-3">
              <input placeholder="Nome *" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="rounded border p-2 text-gray-800" />
              <input type="email" placeholder="E-mail *" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="rounded border p-2 text-gray-800" />
              <input type="password" placeholder="Nova senha (deixe vazio para não alterar)" value={editForm.password} onChange={(e) => setEditForm({ ...editForm, password: e.target.value })} className="rounded border p-2 text-gray-800" />
              <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} className="rounded border p-2 text-gray-800">
                <option value="user">Usuário</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex gap-2">
                <button type="button" onClick={() => setEditOpen(false)} className="flex-1 rounded border px-4 py-2 text-gray-700 hover:bg-gray-100">Cancelar</button>
                <button type="submit" disabled={editing} className="flex-1 rounded bg-[#1B2A4A] px-4 py-2 font-semibold text-white hover:bg-[#243660] disabled:opacity-50">{editing ? "Salvando..." : "Salvar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DELETE */}
      {confirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-2 text-lg font-bold text-[#1B2A4A]">Confirmar exclusão</h2>
            <p className="mb-4 text-gray-600">Tem certeza que deseja excluir este usuário?</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmOpen(false)} className="flex-1 rounded border px-4 py-2 text-gray-700 hover:bg-gray-100">Cancelar</button>
              <button onClick={handleDelete} className="flex-1 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}