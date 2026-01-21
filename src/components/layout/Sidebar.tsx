'use client';

import { useEffect, useState } from 'react';
import { useNavStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { LayoutGrid, ChevronRight, Hash, Folder, FolderOpen } from 'lucide-react';

export function Sidebar() {
  const { config } = useNavStore();
  const { categories } = config;
  
  // 1. 狀態管理
  const [activeId, setActiveId] = useState<string>(''); // 目前滾動到的位置
  const [expandedIds, setExpandedIds] = useState<string[]>([]); // 哪些分類是展開的

  // 初始化：預設展開所有分類 (或是你可以預設只展開第一個)
  useEffect(() => {
    if (categories.length > 0) {
      setExpandedIds(categories.map(c => c.id));
    }
  }, [categories]);

  // 2. Scroll Spy (滾動監聽) - 邏輯升級：監聽 Group 而不是 Category
  useEffect(() => {
    const handleScroll = () => {
      // 收集所有 group 的 ID
      const groupIds = categories.flatMap(c => c.groups.map(g => g.id));
      const scrollPosition = window.scrollY + 150; // Offset

      for (const id of groupIds) {
        const element = document.getElementById(id); // 注意：GridSections 需確保 ID 是 group.id
        // 如果找不到 group id，嘗試找 category id 作為 fallback
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveId(id);
          // 選擇性功能：滾動時自動展開該分類 (如果不想要自動展開，這行可註解)
          // const parentCat = categories.find(c => c.groups.some(g => g.id === id));
          // if (parentCat && !expandedIds.includes(parentCat.id)) {
          //   setExpandedIds(prev => [...prev, parentCat.id]);
          // }
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories, expandedIds]);

  // 處理點擊分類標題 (切換展開/收合)
  const toggleCategory = (e: React.MouseEvent, categoryId: string) => {
    e.preventDefault();
    if (expandedIds.includes(categoryId)) {
      setExpandedIds(prev => prev.filter(id => id !== categoryId));
    } else {
      setExpandedIds(prev => [...prev, categoryId]);
    }
  };

  // 處理點擊子連結 (滾動)
  const scrollToGroup = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    // 這裡假設我們在 GridSections 裡有給 Group 一個 ID
    // 或是我們直接滾動到 Category
    const element = document.getElementById(id); 
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(id);
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 border-r border-border/40 bg-card/10 backdrop-blur-xl">
      
      {/* Header */}
      <div className="px-6 py-6">
        <h4 className="text-xs font-bold text-muted-foreground/70 uppercase tracking-widest mb-1">
           Navigation
        </h4>
        <div className="h-0.5 w-8 bg-primary/20 rounded-full"></div>
      </div>
      
      {/* Nav List */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-4">
        
        {/* 總覽按鈕 (Optional) */}
        {/* <div className="px-2 py-2 text-sm font-semibold text-foreground flex items-center gap-2 mb-2 opacity-50">
           <LayoutGrid className="w-4 h-4" />
           <span>Categories</span>
        </div> */}

        {categories.map((category) => {
          const isExpanded = expandedIds.includes(category.id);
          // 檢查該分類下的子群組是否有一個是 active
          const hasActiveChild = category.groups.some(g => g.id === activeId);

          return (
            <div key={category.id} className="mb-1">
              {/* 1. Category Header (可點擊摺疊) */}
              <button
                onClick={(e) => toggleCategory(e, category.id)}
                className={cn(
                  "w-full flex items-center justify-between px-2 py-2 text-sm font-semibold rounded-lg transition-colors group select-none",
                  // 如果收合起來且裡面有 active 項目，標題要亮起來提示使用者
                  (!isExpanded && hasActiveChild) ? "text-primary bg-primary/5" : "text-foreground hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-2">
                  {/* Icon 變換 */}
                  {isExpanded 
                    ? <FolderOpen className="w-4 h-4 text-muted-foreground" /> 
                    : <Folder className="w-4 h-4 text-muted-foreground" />
                  }
                  <span>{category.title}</span>
                </div>

                {/* 旋轉箭頭 */}
                <ChevronRight className={cn(
                  "w-3.5 h-3.5 text-muted-foreground transition-transform duration-200",
                  isExpanded && "rotate-90"
                )} />
              </button>

              {/* 2. Groups List (子選單) */}
              <div className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out pl-6 border-l border-border/30 ml-3.5 space-y-0.5",
                isExpanded ? "max-h-[500px] opacity-100 mt-1" : "max-h-0 opacity-0"
              )}>
                {category.groups.map(group => {
                    const isActive = activeId === group.id;
                    return (
                        <a
                            key={group.id}
                            href={`#${group.id}`} // 這裡需要配合 GridSections 的 ID
                            onClick={(e) => scrollToGroup(e, group.id)} // 改用 group.id 導航
                            className={cn(
                                "block px-3 py-1.5 text-sm rounded-md transition-colors relative",
                                isActive 
                                    ? "text-primary font-medium bg-primary/10" 
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                            )}
                        >
                            {group.title}
                        </a>
                    )
                })}
                
                {/* 處理空分類的情況 */}
                {category.groups.length === 0 && (
                    <span className="block px-3 py-1.5 text-xs text-muted-foreground/50 italic">
                        No groups
                    </span>
                )}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 mt-auto border-t border-border/40 bg-muted/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-primary/20">
            DX
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-foreground">Platform Eng.</span>
            <span className="text-[10px] text-muted-foreground">v2.1.0</span>
          </div>
        </div>
      </div>
    </aside>
  );
}