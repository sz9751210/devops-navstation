'use client';

import * as React from 'react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from 'cmdk';
import { useNavStore } from '@/lib/store';
import { resolveUrl, isLinkVisible } from '@/lib/url-resolver';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

// 簡單的樣式包裝 (為了配合 Tailwind dark mode)
// cmdk 預設沒有樣式，這些 class 讓它看起來像 VS Code / Raycast
const commandDialogClass = "fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-background/80 backdrop-blur-sm p-4";
const commandContentClass = "w-full max-w-lg rounded-xl border bg-popover text-popover-foreground shadow-2xl overflow-hidden";

export function CommandMenu() {
  const { config, isSearchOpen, setSearchOpen, getCurrentEnv } = useNavStore();
  
  // 為了避免 Hydration Mismatch，我們確保只在 Client 端渲染
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // 監聽鍵盤快捷鍵 (Cmd+K / Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(!isSearchOpen); // Toggle
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isSearchOpen, setSearchOpen]);

  if (!mounted) return null;

  const currentEnv = getCurrentEnv();

  // 執行跳轉
  const runCommand = (urlTemplate: string) => {
    const url = resolveUrl(urlTemplate, currentEnv);
    window.open(url, '_blank');
    setSearchOpen(false);
  };

  return (
    <CommandDialog 
      open={isSearchOpen} 
      onOpenChange={setSearchOpen}
      label="Global Search"
    >
      {/* 注意：cmdk 的 class 需要在 global css 設定，
        或是直接使用它的 components 並用 className 覆寫。
        這裡我們為了簡便，使用 inline style 或者簡單的 div 包裝，
        正規作法是在 components/ui/command.tsx 封裝 shadcn/ui 風格。
        
        下面是簡化版實作，為了讓你在沒有 shadcn 的情況下也能跑起來：
      */}
      <div className={commandDialogClass} onClick={(e) => {
          if(e.target === e.currentTarget) setSearchOpen(false)
      }}>
        <div className={commandContentClass}>
            <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <CommandInput 
                    placeholder="Search tools, docs, and links..." 
                    className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                />
            </div>
            
            <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden py-2 px-2">
                <CommandEmpty className="py-6 text-center text-sm">No results found.</CommandEmpty>
                
                {/* 扁平化資料結構進行搜尋 */}
                {config.categories.map((category) => (
                    <CommandGroup key={category.id} heading={category.title} className="text-xs font-medium text-muted-foreground px-2 py-1.5">
                        {category.groups.flatMap(group => 
                            group.items
                                .filter(item => isLinkVisible(item, currentEnv.id))
                                .map(item => (
                                    <CommandItem
                                        key={item.id}
                                        value={`${category.title} ${item.title} ${item.description}`} // 搜尋關鍵字
                                        onSelect={() => runCommand(item.urlTemplate)}
                                        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer"
                                    >
                                        <div className="mr-2 flex h-4 w-4 items-center justify-center">
                                            <DynamicIcon name={item.icon || 'Link'} className="h-4 w-4" />
                                        </div>
                                        <span>{item.title}</span>
                                        {item.description && (
                                            <span className="ml-2 text-xs text-muted-foreground truncate max-w-[200px]">
                                                — {item.description}
                                            </span>
                                        )}
                                    </CommandItem>
                                ))
                        )}
                    </CommandGroup>
                ))}
            </CommandList>
        </div>
      </div>
    </CommandDialog>
  );
}