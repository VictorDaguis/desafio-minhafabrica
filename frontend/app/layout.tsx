import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./providers/ThemeProvider"; // ✅ import

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sistema Admin",
  description: "Sistema de gerenciamento",
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <ThemeProvider>   {/* ✅ envolve toda a app */}
        {children}
        <Toaster position="bottom-center" />
      </ThemeProvider>
      </body>
      </html>
  );
}