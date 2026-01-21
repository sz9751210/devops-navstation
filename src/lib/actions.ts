'use server';

import connectDB from '@/lib/db';
import CategoryModel from '@/models/Category';
import { revalidatePath } from 'next/cache';
import { v4 as uuidv4 } from 'uuid';

// --- READ ---
export async function getCategories() {
  await connectDB();
  // 這裡需要做深拷貝轉成 Plain Object，因為 Mongoose Document 不能直接傳給 Client Component
  const categories = await CategoryModel.find({}).sort({ order: 1 }).lean();
  
  // 轉換 _id 為 string (Next.js 傳輸限制)
  return JSON.parse(JSON.stringify(categories));
}

// --- CREATE LINK ---
// 這是一個範例：新增連結到指定分類的指定群組
export async function addLink(categoryId: string, groupId: string, formData: any) {
  await connectDB();
  
  const newLink = {
    id: uuidv4(),
    title: formData.title,
    urlTemplate: formData.urlTemplate,
    description: formData.description,
    icon: formData.icon || 'Link', // 預設 Icon
    tags: formData.tags ? formData.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t) : [],
    visibleIn: [] // 預設全環境顯示，進階可再加 checkbox
  };

  await CategoryModel.updateOne(
    { "id": categoryId, "groups.id": groupId },
    { 
      $push: { "groups.$.items": newLink } 
    }
  );

  // 關鍵：告訴 Next.js 頁面資料變了，重新抓取 (Server Component 刷新)
  revalidatePath('/');
  return { success: true };
}

// --- DELETE LINK ---
export async function deleteLink(categoryId: string, groupId: string, linkId: string) {
  await connectDB();

  await CategoryModel.updateOne(
    { "id": categoryId, "groups.id": groupId },
    {
      $pull: { "groups.$.items": { id: linkId } }
    }
  );

  revalidatePath('/');
}