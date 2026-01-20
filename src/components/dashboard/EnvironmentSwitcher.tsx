'use client'; // 因為有互動 (Hooks)，必須是 Client Component

import { useNavStore } from '@/lib/store';
import { ChevronDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils'; // 記得我們在 Step 4 建立的 utility
import { EnvironmentKey } from '@/types/config';

export function EnvironmentSwitcher() {
  // 從 Store 提取狀態與 Action
  const { config, currentEnvId, setEnvironment, getCurrentEnv } = useNavStore();
  
  const currentEnv = getCurrentEnv();

  // 根據 themeColor 決定邊框與文字顏色 (Tailwind 動態 class)
  // 注意：這需要你的 data.json 裡的 themeColor 是有效的 tailwind class (如 text-red-500)
  // 為了簡單起見，我們這裡做一個簡單的 Mapping 或直接使用 style
  const colorClass = currentEnv.themeColor || 'border-gray-500';

  return (
    <div className="relative group">
      <div className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-md border bg-background transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        // 這裡動態套用環境顏色到邊框，增強提示效果
        colorClass
      )}>
        
        {/* Icon & Label */}
        <Globe className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium min-w-[80px]">
          {currentEnv.label}
        </span>

        {/* Native Select (Hidden but functional) 
            使用 opacity-0 的原生 select 覆蓋在上面，這是實現「自訂 UI + 原生無障礙」最快的方式
        */}
        <select
          value={currentEnvId}
          onChange={(e) => setEnvironment(e.target.value as EnvironmentKey)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        >
          {config.environments.map((env) => (
            <option key={env.id} value={env.id}>
              {env.label}
            </option>
          ))}
        </select>

        <ChevronDown className="w-4 h-4 text-muted-foreground opacity-50" />
      </div>
      
      {/* (Optional) 額外的狀態指示燈，如果是 Prod 顯示紅點 */}
      {currentEnv.id === 'prod' && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}
    </div>
  );
}