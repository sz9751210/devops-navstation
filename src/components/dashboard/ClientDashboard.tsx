'use client';

import { useEffect, useState } from 'react';
import { useNavStore } from '@/lib/store';
import { CategorySection } from '@/components/dashboard/GridSections';
import { Category } from '@/types/config';
import { AddCategoryDialog } from './AddCategoryDialog';
import { Plus } from 'lucide-react';

export default function ClientDashboard({ initialCategories }: { initialCategories: Category[] }) {
  const { config, setCategories, isEditMode } = useNavStore(); // 1. 取得 isEditMode
  const [isAddCatOpen, setIsAddCatOpen] = useState(false); // 2. Dialog 狀態

  // 當組件掛載時，把 Server 抓來的 DB 資料塞進 Zustand Store
  // 這樣之後 Sidebar, Search 都能拿到最新資料
  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories, setCategories]);


  return (
    <div className="pb-20"> {/* 增加底部 padding 以免按鈕貼底 */}
      
      {/* 渲染現有分類 */}
      {config.categories.map(category => (
        <CategorySection key={category.id} category={category} />
      ))}

      {/* 3. 新增分類區塊 (Edit Mode Only) */}
      {isEditMode && (
        <div className="mt-8 border-t-2 border-dashed border-muted pt-8">
          <button
            onClick={() => setIsAddCatOpen(true)}
            className="w-full py-12 border-2 border-dashed border-muted-foreground/20 rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:border-primary/50 hover:bg-accent/30 hover:text-primary transition-all group"
          >
            <div className="p-4 rounded-full bg-muted group-hover:bg-primary/10 mb-3 transition-colors">
               <Plus className="w-8 h-8" />
            </div>
            <span className="text-lg font-medium">Create New Category</span>
          </button>
        </div>
      )}

      {/* 4. Dialog */}
      <AddCategoryDialog 
        isOpen={isAddCatOpen}
        onClose={() => setIsAddCatOpen(false)}
      />
    </div>
  );
}
