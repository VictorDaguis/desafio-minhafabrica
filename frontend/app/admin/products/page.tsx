"use client";

import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Package } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import api from "@/services/api";
import { Product, ProductFormData } from "@/types";

interface PaginatedResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const emptyForm: ProductFormData = { name: "", description: "", price: "", stock: "", category: "" };

// ✅ Componente para placeholder de imagem (caixinha com ícone)
function ImagePlaceholder({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-24 w-24",
  };
  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };
  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded border dark:border-gray-600`}>
      <Package className={`${iconSizes[size]} text-gray-400 dark:text-gray-500`} />
    </div>
  );
}

// ✅ Componente para exibir imagem na tabela (com fallback)
function ProductImage({ productId, alt }: { productId: string; alt: string }) {
  const [error, setError] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
  const imageUrl = error ? null : `${baseUrl}/products/${productId}/image?t=${Date.now()}`;

  if (error || !productId) {
    return <ImagePlaceholder size="md" />;
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className="h-12 w-12 object-cover rounded border dark:border-gray-600"
      onError={() => setError(true)}
    />
  );
}

// ✅ Componente para pré-visualização de arquivo selecionado (com fallback para currentUrl)
function FilePreview({ file, currentUrl, onRemove }: { file: File | null; currentUrl: string | null; onRemove?: () => void }) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentError, setCurrentError] = useState(false);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  // Se há um arquivo selecionado, mostra sua pré-visualização
  if (previewUrl) {
    return (
      <div className="relative">
        <img
          src={previewUrl}
          alt="Pré-visualização"
          className="h-24 w-24 object-cover rounded border dark:border-gray-600"
        />
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  // Se não há arquivo, mas há uma URL atual e ainda não falhou, tenta exibi-la
  if (currentUrl && !currentError) {
    return (
      <img
        src={currentUrl + "?t=" + Date.now()}
        alt="Imagem atual"
        className="h-24 w-24 object-cover rounded border dark:border-gray-600"
        onError={() => setCurrentError(true)}
      />
    );
  }

  // Se não há arquivo, nem URL atual (ou a URL atual falhou), mostra placeholder
  return <ImagePlaceholder size="lg" />;
}

export default function ProductsPage() {
  useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<ProductFormData>(emptyForm);
  const [createImage, setCreateImage] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<ProductFormData>(emptyForm);
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const createFileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  async function fetchProducts() {
    setLoading(true);
    try {
      const { data } = await api.get<PaginatedResponse>("/products", {
        params: { page: currentPage, limit, search: search || undefined },
      });
      setProducts(data.data);
      setTotalPages(data.totalPages);
      setTotalItems(data.total);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : "Erro ao carregar produtos";
      toast.error(message || "Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, [currentPage, search]);

  function handleSearchChange(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  function getImageUrl(productId: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    return `${baseUrl}/products/${productId}/image`;
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!createForm.name || !createForm.price) {
      toast.error("Nome e preço são obrigatórios");
      return;
    }
    if (Number(createForm.price) < 0) {
      toast.error("Preço deve ser positivo");
      return;
    }
    if (Number(createForm.stock) < 0) {
      toast.error("Estoque não pode ser negativo");
      return;
    }

    setCreating(true);
    try {
      const formData = new FormData();
      formData.append("name", createForm.name);
      formData.append("description", createForm.description);
      formData.append("price", String(createForm.price));
      formData.append("stock", String(createForm.stock));
      formData.append("category", createForm.category);
      if (createImage) formData.append("image", createImage);

      await api.post("/products", formData);

      toast.success("Produto criado!");
      setCreateForm(emptyForm);
      setCreateImage(null);
      if (createFileInputRef.current) createFileInputRef.current.value = "";
      setCreateOpen(false);
      fetchProducts();
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : "Erro ao criar produto";
      toast.error(message || "Erro ao criar produto");
    } finally {
      setCreating(false);
    }
  }

  function openEdit(product: Product) {
    setEditId(product._id);
    setEditForm({
      name: product.name,
      description: product.description || "",
      price: String(product.price),
      stock: String(product.stock),
      category: product.category || "",
    });
    setEditImage(null);
    setRemoveImage(false);
    // ✅ Só define URL se o produto realmente tem imagem
    setCurrentImageUrl(product.image ? getImageUrl(product._id) : null);
    setEditOpen(true);
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editForm.name || !editForm.price) {
      toast.error("Nome e preço são obrigatórios");
      return;
    }
    if (Number(editForm.price) < 0) {
      toast.error("Preço deve ser positivo");
      return;
    }
    if (Number(editForm.stock) < 0) {
      toast.error("Estoque não pode ser negativo");
      return;
    }

    setEditing(true);
    try {
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("description", editForm.description);
      formData.append("price", String(editForm.price));
      formData.append("stock", String(editForm.stock));
      formData.append("category", editForm.category);
      if (editImage) formData.append("image", editImage);
      if (removeImage) formData.append("removeImage", "true");

      await api.put(`/products/${editId}`, formData);

      toast.success("Produto atualizado!");
      setEditOpen(false);
      setEditImage(null);
      setCurrentImageUrl(null);
      setRemoveImage(false);

      await new Promise(resolve => setTimeout(resolve, 50));
      fetchProducts();
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : "Erro ao atualizar produto";
      toast.error(message || "Erro ao atualizar produto");
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
      await api.delete(`/products/${deleteId}`);
      toast.success("Produto excluído!");
      setConfirmOpen(false);
      fetchProducts();
    } catch (err: unknown) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : "Erro ao excluir produto";
      toast.error(message || "Erro ao excluir produto");
    }
  }

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  }

  return (
    <div className="text-gray-900 dark:text-gray-100">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#1B2A4A] dark:text-white">Produtos</h1>
        <button
          onClick={() => setCreateOpen(true)}
          className="rounded bg-[#F47920] px-4 py-2 font-semibold text-white hover:bg-[#d4661a] dark:bg-orange-600 dark:hover:bg-orange-700"
        >
          Novo Produto
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar produto..."
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
          Carregando produtos...
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded shadow">
            <table className="w-full bg-white dark:bg-gray-800">
              <thead>
                <tr className="bg-[#1B2A4A] dark:bg-gray-900 text-left text-white">
                  <th className="p-3">Imagem</th>
                  <th className="p-3">Nome</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Preço</th>
                  <th className="p-3">Estoque</th>
                  <th className="p-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500 dark:text-gray-400">
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="p-3">
                        <ProductImage productId={product._id} alt={product.name} />
                      </td>
                      <td className="p-3 text-gray-800 dark:text-gray-200">{product.name}</td>
                      <td className="p-3 text-gray-800 dark:text-gray-200">{product.category || "—"}</td>
                      <td className="p-3 text-gray-800 dark:text-gray-200">R$ {Number(product.price).toFixed(2)}</td>
                      <td className="p-3 text-gray-800 dark:text-gray-200">{product.stock}</td>
                      <td className="flex gap-2 p-3">
                        <button
                          onClick={() => openEdit(product)}
                          className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => openConfirm(product._id)}
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
              Mostrando {products.length} de {totalItems} produto(s)
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
          <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-xl font-bold text-[#1B2A4A] dark:text-white">Novo Produto</h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <input
                placeholder="Nome *"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                className="rounded border p-2 text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
              />
              <input
                placeholder="Descrição"
                value={createForm.description}
                onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                className="rounded border p-2 text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
              />
              <input
                type="number"
                placeholder="Preço *"
                value={createForm.price}
                onChange={(e) => setCreateForm({ ...createForm, price: e.target.value })}
                className="rounded border p-2 text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
              />
              <input
                type="number"
                placeholder="Estoque"
                value={createForm.stock}
                onChange={(e) => setCreateForm({ ...createForm, stock: e.target.value })}
                className="rounded border p-2 text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
              />
              <input
                placeholder="Categoria"
                value={createForm.category}
                onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                className="rounded border p-2 text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Imagem do produto
                </label>
                <FilePreview file={createImage} currentUrl={null} />
                <input
                  type="file"
                  accept="image/*"
                  ref={createFileInputRef}
                  onChange={(e) => setCreateImage(e.target.files?.[0] || null)}
                  className="mt-2 w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#1B2A4A] file:text-white hover:file:bg-[#243660] dark:file:bg-gray-700 dark:hover:file:bg-gray-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCreateOpen(false);
                    setCreateImage(null);
                    if (createFileInputRef.current) createFileInputRef.current.value = "";
                  }}
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
          <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-xl font-bold text-[#1B2A4A] dark:text-white">Editar Produto</h2>
            <form onSubmit={handleEdit} className="flex flex-col gap-3">
              <input
                placeholder="Nome *"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="rounded border p-2 text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
              />
              <input
                placeholder="Descrição"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="rounded border p-2 text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
              />
              <input
                type="number"
                placeholder="Preço *"
                value={editForm.price}
                onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                className="rounded border p-2 text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
              />
              <input
                type="number"
                placeholder="Estoque"
                value={editForm.stock}
                onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                className="rounded border p-2 text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
              />
              <input
                placeholder="Categoria"
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                className="rounded border p-2 text-gray-800 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Imagem atual
                </label>
                {/* ✅ Exibe pré-visualização com fallback de placeholder se necessário */}
                {!editImage && <FilePreview file={null} currentUrl={currentImageUrl} />}
                {editImage && (
                  <FilePreview
                    file={editImage}
                    currentUrl={null}
                    onRemove={() => {
                      setEditImage(null);
                      if (editFileInputRef.current) editFileInputRef.current.value = "";
                    }}
                  />
                )}

                {currentImageUrl && !editImage && (
                  <label className="flex items-center gap-2 mt-2 mb-3">
                    <input
                      type="checkbox"
                      checked={removeImage}
                      onChange={(e) => setRemoveImage(e.target.checked)}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Remover imagem atual</span>
                  </label>
                )}

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 mt-2">
                  Nova imagem (opcional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  ref={editFileInputRef}
                  onChange={(e) => setEditImage(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#1B2A4A] file:text-white hover:file:bg-[#243660] dark:file:bg-gray-700 dark:hover:file:bg-gray-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditOpen(false);
                    setEditImage(null);
                    setCurrentImageUrl(null);
                    setRemoveImage(false);
                  }}
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
            <p className="mb-4 text-gray-600 dark:text-gray-300">Tem certeza que deseja excluir este produto?</p>
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