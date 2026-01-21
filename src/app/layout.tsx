import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { CommandMenu } from "@/components/dashboard/CommandMenu"; // 這是下一步要做的，先寫好

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

        {/* 主要佈局容器：Flex Row */}
        <div className="flex-1 flex items-start">

          {/* 左側：Sidebar */}
          <Sidebar />

          {/* 右側：主內容 */}
          <main className="flex-1 min-w-0 px-8 py-8 md:px-12 lg:px-16">
            <div className="max-w-6xl mx-auto"> {/* 限制內容最大寬度，避免在大螢幕太散 */}
              {children}
            </div>
          </main>
        </div>

        {/* 全域搜尋組件 (掛載在最外層即可) */}
        <CommandMenu />

      </body>
    </html>
  );
}