'use client';

import { useNavStore } from '@/lib/store';
import { CategorySection } from '@/components/dashboard/GridSections';
import { AlertTriangle } from 'lucide-react';

export default function Home() {
  // 1. 從 Store 獲取完整設定檔
  const { config } = useNavStore();
  const { categories } = config;

  // 處理空資料狀態 (DX 友善提示)
  if (!categories || categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground">
        <AlertTriangle className="w-12 h-12 mb-4 opacity-50" />
        <h2 className="text-xl font-semibold">No links configuration found</h2>
        <p>Please check your <code>data.json</code> file.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* 這裡未來可以放一個 Page Header，例如「早安，工程師」 
        或者顯示一些系統公告
      */}
      
      {/* 主 Grid 區域 */}
      <div className="py-4">
        {categories.map(category => (
          <CategorySection key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}