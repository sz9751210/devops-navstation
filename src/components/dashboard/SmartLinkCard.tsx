'use client';

import { useState } from 'react';
import { useNavStore } from '@/lib/store';
import { LinkItem } from '@/types/config';
import { resolveUrl, isLinkVisible } from '@/lib/url-resolver';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { ExternalLink, Copy, Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SmartLinkCardProps {
  item: LinkItem;
}

export function SmartLinkCard({ item }: SmartLinkCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  // 1. 從 Store 獲取當前環境完整物件
  const currentEnv = useNavStore(state => state.getCurrentEnv());

  // 2. 判斷可見性 (若不可見直接回傳 null，不渲染)
  if (!isLinkVisible(item, currentEnv.id)) {
    return null;
  }

  // 3. 核心魔術：計算最終 URL
  const resolvedUrl = resolveUrl(item.urlTemplate, currentEnv);

  // 處理複製連結到剪貼簿
  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault(); // 防止觸發外層連結跳轉
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(resolvedUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // 2秒後恢復圖示
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  // 處理切換註解顯示
  const toggleInfo = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowInfo(!showInfo);
  }

  return (
    <div className="group relative rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50">
      {/* 主要連結區域 (整個卡片可點擊) */}
      <a 
        href={resolvedUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-4 h-full"
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-md bg-muted transition-colors group-hover:bg-primary/10 group-hover:text-primary")}>
               <DynamicIcon name={item.icon || 'Link'} className="w-5 h-5" />
            </div>
            <h3 className="font-semibold leading-none tracking-tight truncate max-w-[180px]" title={item.title}>
              {item.title}
            </h3>
          </div>
          
          {/* 右上角角標區 (External Icon) */}
          <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* URL Preview (顯示解析後的網域，增加信任感) */}
        <div className="text-xs text-muted-foreground truncate pl-[44px] mb-2 opacity-70 font-mono">
          {new URL(resolvedUrl).hostname}
        </div>
      </a>

      {/* Actions Toolbar (懸浮在底部或角落的操作按鈕) 
        使用 absolute positioning 讓它不佔據 layout 空間
      */}
      <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-card/80 backdrop-blur rounded-md p-1 border shadow-sm z-10">
        {/* 註解按鈕 (如果有的話) */}
        {item.description && (
          <button 
            onClick={toggleInfo}
            className={cn("p-1.5 rounded-md hover:bg-muted transition-colors", showInfo && "bg-muted text-primary")}
            title="Toggle description"
          >
            <Info className="w-4 h-4" />
          </button>
        )}
        
        {/* 複製按鈕 */}
        <button 
          onClick={handleCopy}
          className="p-1.5 rounded-md hover:bg-muted transition-colors"
          title="Copy resolved URL"
        >
          {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* 註解展開區域 */}
      {showInfo && item.description && (
        <div className="px-4 pb-4 pt-0 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2 border-t mt-2 bg-muted/30 rounded-b-lg">
          <div className="pt-3">
             {/* 這裡未來可以接入 Markdown renderer */}
             {item.description}
          </div>
        </div>
      )}
    </div>
  );
}