import { getCategories } from '@/lib/actions'; // Server Action
import ClientDashboard from '@/components/dashboard/ClientDashboard'; // 下一步建立

// 這是 Server Component (預設)
export default async function Home() {
  // 直接從 DB 拿資料
  const categories = await getCategories();

  return (
    <div className="max-w-7xl mx-auto py-4">
      {/* 將資料傳給 Client Component 進行渲染與 Zustand 初始化 */}
      <ClientDashboard initialCategories={categories} />
    </div>
  );
}