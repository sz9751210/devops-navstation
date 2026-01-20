import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/layout/TopBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevOps NavStation",
  description: "Internal Tools Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark"> 
      {/* ^ 強制加入 dark class，因為我們是 DX 工具 */}
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground`}>
        {/* 1. Top Navigation */}
        <TopBar />

        {/* 2. Main Content Area */}
        <main className="flex-1 container py-6">
          {children}
        </main>
      </body>
    </html>
  );
}