'use client';

import { useNavStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { LayoutGrid } from 'lucide-react';

export function Sidebar() {
  const { config } = useNavStore();
  const { categories } = config;

  // 處理點擊捲動 (平滑捲動)
  const scrollToCategory = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // 減去 TopBar 的高度 (約 80px) 避免標題被遮住
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <aside className="hidden md:block w-64 shrink-0 border-r bg-background/50 h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto py-6 pr-6">
      <nav className="space-y-1">
        <h4 className="mb-4 px-4 text-sm font-semibold tracking-tight text-muted-foreground flex items-center gap-2">
           <LayoutGrid className="w-4 h-4" />
           Categories
        </h4>
        
        {categories.map((category) => (
          <a
            key={category.id}
            href={`#${category.id}`}
            onClick={(e) => scrollToCategory(e, category.id)}
            className={cn(
              "block px-4 py-2 text-sm font-medium rounded-md transition-colors",
              "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
            )}
          >
            {category.title}
          </a>
        ))}
      </nav>
      
      {/* 底部可以放一些連結，例如 Repo 連結或維護者資訊 */}
      <div className="mt-8 px-4 text-xs text-muted-foreground">
        <p>Managed by Platform Team</p>
        <p className="mt-1 opacity-50">v1.0.0</p>
      </div>
    </aside>
  );
}