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

// --- UPDATE LINK ---
export async function updateLink(categoryId: string, groupId: string, linkId: string, formData: any) {
  await connectDB();

  // 準備要更新的資料物件
  const updatedFields = {
    "groups.$[g].items.$[i].title": formData.title,
    "groups.$[g].items.$[i].urlTemplate": formData.urlTemplate,
    "groups.$[g].items.$[i].description": formData.description,
    "groups.$[g].items.$[i].icon": formData.icon,
    "groups.$[g].items.$[i].tags": formData.tags ? formData.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t) : [],
    // 這裡我們保留原本的 visibleIn，除非你也想在表單編輯它
  };

  await CategoryModel.updateOne(
    { "id": categoryId }, // 1. 找到該 Category Document
    { $set: updatedFields }, // 2. 設定新值
    { 
      // 3. 定義過濾條件 (變數 g 代表 group, i 代表 item)
      arrayFilters: [
        { "g.id": groupId },
        { "i.id": linkId }
      ]
    }
  );

  revalidatePath('/');
  return { success: true };
}

// --- REORDER LINKS ---
export async function reorderLinks(categoryId: string, groupId: string, orderedLinkIds: string[]) {
  await connectDB();

  // 1. 找到該分類
  const category = await CategoryModel.findOne({ id: categoryId });
  if (!category) throw new Error("Category not found");

  // 2. 找到該群組
  const group = category.groups.find((g: any) => g.id === groupId);
  if (!group) throw new Error("Group not found");

  // 3. 根據傳入的 ID 列表，重新排列 items
  // 我們建立一個 Map 來快速查找現有物件
  const itemMap = new Map(group.items.map((item: any) => [item.id, item]));
  
  // 重組陣列
  const newItems = orderedLinkIds
    .map(id => itemMap.get(id))
    .filter(item => item !== undefined); // 過濾掉可能的錯誤

  // 4. 更新資料庫
  // 這裡我們直接替換整個 items 陣列
  await CategoryModel.updateOne(
    { "id": categoryId, "groups.id": groupId },
    { $set: { "groups.$.items": newItems } }
  );

  revalidatePath('/');
  return { success: true };
}

// --- CREATE CATEGORY ---
export async function addCategory(title: string) {
  await connectDB();

  // 自動生成 ID: "My Tools" -> "my-tools"
  // 加上隨機數避免重複 (簡單實作)
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);

  // 取得目前最大的 order，排在最後面
  const lastCategory = await CategoryModel.findOne().sort({ order: -1 });
  const newOrder = lastCategory ? lastCategory.order + 1 : 1;

  await CategoryModel.create({
    id,
    title,
    order: newOrder,
    groups: [] // 初始為空群組
  });

  revalidatePath('/');
  return { success: true };
}

// --- DELETE CATEGORY ---
export async function deleteCategory(categoryId: string) {
  await connectDB();
  
  await CategoryModel.deleteOne({ id: categoryId });

  revalidatePath('/');
  return { success: true };
}

export async function addGroup(categoryId: string, title: string) {
  await connectDB();
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  
  await CategoryModel.updateOne(
    { id: categoryId },
    { $push: { groups: { id, title, items: [] } } }
  );
  revalidatePath('/');
}
