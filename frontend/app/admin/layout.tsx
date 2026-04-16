"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { LayoutDashboard, Users, Package, LogOut, Sun, Moon } from "lucide-react";
import { useTheme } from "@/app/providers/ThemeProvider";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme(); // ✅ hook do dark mode

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/usuarios", label: "Usuários", icon: Users },
    { href: "/admin/products", label: "Produtos", icon: Package },
  ];

  return (
      <div className="flex min-h-screen bg-[#f4f6f9] dark:bg-gray-900 transition-colors">
        {/* Sidebar */}
        <aside className="flex w-64 flex-col bg-[#1B2A4A] dark:bg-gray-800 text-white">
          {/* Logo */}
          <div className="border-b border-white/10 px-6 py-6">
            <h1 className="text-xl font-bold">MinhaFabrica</h1>
            <p className="mt-1 text-xs text-white/50">Painel Administrativo</p>
          </div>

          {/* Nav */}
          <nav className="flex flex-1 flex-col gap-1 p-4">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                  <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                          isActive
                              ? "bg-white/20 text-white"
                              : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                  >
                    <Icon size={18} />
                    {label}
                  </Link>
              );
            })}
          </nav>

          {/* Footer com Logout e Dark Mode */}
          <div className="border-t border-white/10 p-4 space-y-2">
            {/* Botão Sair */}
            <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-red-500/20 hover:text-red-300"
            >
              <LogOut size={18} />
              Sair
            </button>

            {/* Botão Dark / Light Mode */}
            <button
                onClick={toggleTheme}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
              {theme === "light" ? "Modo Escuro" : "Modo Claro"}
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8 dark:text-gray-100 transition-colors">{children}</main>
      </div>
  );
}