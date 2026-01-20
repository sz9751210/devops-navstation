'use client';

import { Terminal } from 'lucide-react';
import { EnvironmentSwitcher } from '@/components/dashboard/EnvironmentSwitcher';

export function TopBar() {
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
           <button className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full md:w-[240px] lg:w-[320px] text-muted-foreground justify-between">
              <span>Search documentation...</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
           </button>
        </div>

        {/* Right Section: Environment Switcher */}
        <div className="flex items-center gap-2">
           <EnvironmentSwitcher />
        </div>
      </div>
    </header>
  );
}