'use client';

import { useState } from 'react';
import { useNavStore } from '@/lib/store';
import { LinkItem } from '@/types/config';
import { resolveUrl, isLinkVisible } from '@/lib/url-resolver';
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { ExternalLink, Copy, Check, Info, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { deleteLink } from '@/lib/actions';
import { Trash2 } from 'lucide-react';
import { EditLinkDialog } from './EditLinkDialog';

interface SmartLinkCardProps {
    item: LinkItem;
    categoryId: string;
    groupId: string;
}

export function SmartLinkCard({ item, categoryId, groupId }: SmartLinkCardProps) {
    const [isCopied, setIsCopied] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    const { getCurrentEnv, isEditMode } = useNavStore();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // 1. 從 Store 獲取當前環境完整物件
    const currentEnv = useNavStore(state => state.getCurrentEnv());

    // 2. 判斷可見性 (若不可見直接回傳 null，不渲染)
    if (!isLinkVisible(item, currentEnv.id)) {
        return null;
    }

    // 3. 核心魔術：計算最終 URL
    const resolvedUrl = resolveUrl(item.urlTemplate, currentEnv);

    // ⬇️ [新增] 安全的 Hostname 解析邏輯
    // 這樣就算網址格式錯誤，或是還沒填寫，也不會讓整個頁面當機
    let displayHostname = '';
    try {
        if (resolvedUrl) {
            displayHostname = new URL(resolvedUrl).hostname;
        }
    } catch (e) {
        // 如果解析失敗 (例如使用者只填了 'localhost' 沒填 'http://')
        // 我們就直接顯示原始字串，或者顯示 'Invalid URL'
        displayHostname = resolvedUrl || 'No URL';
    }

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
    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!confirm('Sure to delete?')) return;

        // 呼叫 Server Action
        // 注意：這裡需要你知道 categoryId 和 groupId。
        // 建議將這兩個 ID 也傳入 SmartLinkCard 的 props 中
        await deleteLink(categoryId, groupId, item.id);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEditModalOpen(true);
    };

    return (
        <div className="group relative rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50">
            {/* 主要連結區域 (整個卡片可點擊) */}
            <a
                href={resolvedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 h-full flex flex-col"
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
                    {displayHostname}
                </div>

                {/* ⬇️ [新增] Tags Display Area */}
                {item.tags && item.tags.length > 0 && (
                    <div className="pl-[44px] flex flex-wrap gap-1.5 mt-auto pt-2">
                        {item.tags.map(tag => (
                            <span
                                key={tag}
                                className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-secondary text-secondary-foreground opacity-80"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

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

            {isEditMode && (
                <div className="absolute top-2 right-2 flex gap-1 z-20">
                    {/* Edit Button */}
                    <button
                        onClick={handleEdit}
                        className="p-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded shadow-sm"
                        title="Edit Link"
                    >
                        <Pencil className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                        onClick={handleDelete}
                        className="p-1.5 bg-red-500 text-white hover:bg-red-600 rounded shadow-sm"
                        title="Delete Link"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}

            {/* 註解展開區域 */}
            {showInfo && item.description && (
                <div className="px-4 pb-4 pt-0 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-2 border-t mt-2 bg-muted/30 rounded-b-lg">
                    <div className="pt-3">
                        {/* 這裡未來可以接入 Markdown renderer */}
                        {item.description}
                    </div>
                </div>
            )}

            {/* ⬇️ [新增] 掛載編輯視窗 */}
            <EditLinkDialog
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                categoryId={categoryId}
                groupId={groupId}
                item={item}
            />
        </div>
    );
}