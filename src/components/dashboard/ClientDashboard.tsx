'use client';

import { useEffect } from 'react';
import { useNavStore } from '@/lib/store';
import { CategorySection } from '@/components/dashboard/GridSections';
import { Category } from '@/types/config';

export default function ClientDashboard({ initialCategories }: { initialCategories: Category[] }) {
  const { config, setCategories } = useNavStore();

  // 當組件掛載時，把 Server 抓來的 DB 資料塞進 Zustand Store
  // 這樣之後 Sidebar, Search 都能拿到最新資料
  useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories, setCategories]);

  return (
    <div>
      {config.categories.map(category => (
        <CategorySection key={category.id} category={category} />
      ))}
    </div>
  );
}