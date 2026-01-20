'use client';

import { Terminal, Edit3 } from 'lucide-react';
import { EnvironmentSwitcher } from '@/components/dashboard/EnvironmentSwitcher';
import { useNavStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function TopBar() {
    // 2. 獲取 setSearchOpen Action
    const { setSearchOpen, isEditMode, toggleEditMode } = useNavStore();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center px-4">
                {/* Logo Section */}
                <div className="mr-4 hidden md:flex items-center gap-2 font-bold text-lg">
                    <div className="p-1 bg-primary text-primary-foreground rounded">
                        <Terminal className="w-5 h-5" />
                    </div>
                    <span>DevOps Nav</span>
                </div>

                {/* Search Placeholder (我們稍後再做 Cmd+K) */}
                <div className="flex-1 flex items-center justify-center md:justify-start">
                    <button onClick={() => setSearchOpen(true)} className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full md:w-[240px] lg:w-[320px] text-muted-foreground justify-between">
                        <span>Search documentation...</span>
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    </button>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2">
                
                {/* ⬇️ [新增] Edit Mode Toggle Button */}
                <button
                    onClick={toggleEditMode}
                    title={isEditMode ? "Exit Edit Mode" : "Enter Edit Mode"}
                    className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-9 w-9",
                    "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    // 當編輯模式開啟時，按鈕變成琥珀色/橘色，強烈提示使用者
                    isEditMode 
                        ? "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50" 
                        : "text-muted-foreground"
                    )}
                >
                    <Edit3 className="w-4 h-4" />
                </button>

                {/* Environment Switcher (保持不變) */}
                <EnvironmentSwitcher />
                </div>
            </div>
        </header>
    );
}