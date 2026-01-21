'use client';

import { useEffect, useState } from 'react';
import { useNavStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { LayoutGrid, Hash, ChevronRight } from 'lucide-react';

export function Sidebar() {
  const { config } = useNavStore();
  const { categories } = config;
  const [activeId, setActiveId] = useState<string>('');

    // 簡單的 Scroll Spy: 監聽滾動位置來決定哪個分類是 Active
  useEffect(() => {
    const handleScroll = () => {
      const sections = categories.map(c => document.getElementById(c.id));
      const scrollPosition = window.scrollY + 100; // Offset

      for (const section of sections) {
        if (section && section.offsetTop <= scrollPosition && (section.offsetTop + section.offsetHeight) > scrollPosition) {
          setActiveId(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories]);

  // 處理點擊捲動 (平滑捲動)
  const scrollToCategory = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // 減去 TopBar 的高度 (約 80px) 避免標題被遮住
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(id); // 點擊時立即設為 active
    }
  };

   return (
     <aside className="hidden md:flex flex-col w-64 shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 border-r border-border/40 bg-card/10 backdrop-blur-xl">
       
       {/* 標題區 */}
       <div className="px-6 py-6">
         <h4 className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest mb-1">
            Navigation
         </h4>
         <div className="h-0.5 w-8 bg-primary/20 rounded-full"></div>
       </div>
       
       {/* 導航列表 */}
       <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
         
         {/* "All Categories" 總覽 (可選) */}
         <div className="px-3 py-2 text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
            <LayoutGrid className="w-4 h-4 text-primary" />
            <span>Categories</span>
         </div>
 
         {categories.map((category) => {
           const isActive = activeId === category.id;
 
           return (
             <a
               key={category.id}
               href={`#${category.id}`}
               onClick={(e) => scrollToCategory(e, category.id)}
               className={cn(
                 "group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 border border-transparent",
                 // 狀態樣式：
                 isActive 
                   ? "bg-primary/10 text-primary border-primary/10 shadow-sm" 
                   : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
               )}
             >
               <div className="flex items-center gap-3">
                 {/* 左側裝飾線 (Active 時顯示) */}
                 <span className={cn(
                   "w-1 h-4 rounded-full transition-all duration-300",
                   isActive ? "bg-primary" : "bg-transparent w-0"
                 )} />
                 
                 {/* 圖示與文字 */}
                 <span>{category.title}</span>
               </div>
 
               {/* 右側箭頭 (Hover 或 Active 時顯示) */}
               <ChevronRight className={cn(
                 "w-3 h-3 transition-transform duration-200 opacity-0 -translate-x-2",
                 (isActive || "group-hover:opacity-100 group-hover:translate-x-0") && "opacity-50 translate-x-0",
                 isActive && "opacity-100 text-primary"
               )} />
             </a>
           );
         })}
       </nav>
       
       {/* 底部資訊區 (增加專業感) */}
       <div className="p-4 mt-auto border-t border-border/40 bg-muted/5">
         <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-primary/20">
             DX
           </div>
           <div className="flex flex-col">
             <span className="text-xs font-medium text-foreground">Platform Eng.</span>
             <span className="text-[10px] text-muted-foreground">v2.0.0 Pro</span>
           </div>
         </div>
       </div>
     </aside>
   );
 }