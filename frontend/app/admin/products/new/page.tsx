"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function NewProduct() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await fetch("http://localhost:5000/api/v1/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          price: Number(price),
        }),
      });

      toast.success("Produto criado com sucesso!");
      router.push("/admin/products");
    } catch (error) {
      toast.error("Erro ao criar produto");
    }
  };

  return (
    <div className="text-white">
      <h1 className="text-2xl mb-6 font-bold">Novo Produto</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          placeholder="Nome do produto"
          className="p-3 rounded bg-gray-800 outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Preço"
          className="p-3 rounded bg-gray-800 outline-none"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <button className="bg-green-600 p-3 rounded hover:bg-green-700">
          Salvar Produto
        </button>
      </form>
    </div>
  );
}