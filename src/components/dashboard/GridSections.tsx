'use client';

import { useState } from 'react';
import { Category, LinkGroup as LinkGroupType } from '@/types/config';
import { SmartLinkCard } from './SmartLinkCard';
import { useNavStore } from '@/lib/store';
import { Plus } from 'lucide-react';
import { AddLinkDialog } from './AddLinkDialog';
import { DragDropContext, Draggable, DropResult } from '@hello-pangea/dnd';
import { StrictModeDroppable } from '@/components/ui/StrictModeDroppable';
import { reorderLinks } from '@/lib/actions';
import { deleteCategory } from '@/lib/actions';
import { Trash2 } from 'lucide-react';
import { addGroup } from '@/lib/actions';
import { FolderPlus } from 'lucide-react';

// --- Molecule: LinkGroup ---
// 負責一個小群組標題和底下的 Grid
function LinkGroup({ group, categoryId }: { group: LinkGroupType, categoryId: string }) {
  const { isEditMode } = useNavStore(); // 1. 讀取編輯模式
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // 2. 控制 Modal 開關

  if (group.items.length === 0 && !isEditMode) return null;

  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider pl-1">
        {group.title}
      </h3>
      {/* 1. Droppable ID 必須唯一，我們用 groupId。
         2. direction="horizontal" 是因為我們是 Grid 佈局，但這在 Grid 有點tricky，
            如果你的 grid 是多行的，dnd 預設的鍵盤導航可能怪怪的，但滑鼠拖曳通常沒問題。
      */}
      <StrictModeDroppable droppableId={group.id} direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {group.items.map((item, index) => {
              // 如果不是編輯模式，就不要渲染 Draggable wrapper，直接渲染卡片
              // 這樣可以保持效能，且避免 DOM 結構複雜
              if (!isEditMode) {
                return <SmartLinkCard key={item.id} item={item} categoryId={categoryId} groupId={group.id} />;
              }

              return (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        // 拖曳時稍微改變透明度或縮放，增加手感
                        opacity: snapshot.isDragging ? 0.8 : 1,
                        transform: snapshot.isDragging ? `${provided.draggableProps.style?.transform} scale(1.02)` : provided.draggableProps.style?.transform
                      }}
                    >
                      <SmartLinkCard
                        item={item}
                        categoryId={categoryId}
                        groupId={group.id}
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}

            {provided.placeholder}


            {/* 3. ⬇️ [新增] Add Button Card (只在 Edit Mode 顯示) */}
            {isEditMode && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="group flex flex-col items-center justify-center min-h-[120px] rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50 transition-all"
              >
                <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="mt-2 text-sm font-medium text-muted-foreground">Add Link</span>
              </button>
            )}
          </div>
        )}
      </StrictModeDroppable>
      {/* 4. ⬇️ [新增] Modal Component */}
      <AddLinkDialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        categoryId={categoryId}
        groupId={group.id}
      />
    </div >
  );
}


// --- CategorySection (這裡處理 Context) ---
export function CategorySection({ category }: { category: Category }) {
  const { reorderGroupItems, isEditMode } = useNavStore();


  // 處理刪除分類
  const handleDeleteCategory = async () => {
    const confirmMsg = `Are you sure you want to delete category "${category.title}"? \nAll links inside will be removed permanently.`;
    if (!confirm(confirmMsg)) return;

    await deleteCategory(category.id);
  };

  // 即使 groups 是空的，如果是 Edit Mode 也要顯示分類，這樣才能看得到「刪除按鈕」或之後的「新增群組」
  if ((!category.groups || category.groups.length === 0) && !isEditMode) return null;

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    // 如果沒有目的地 (拖到外面) 或 位置沒變
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    const groupId = source.droppableId; // 我們把 droppableId 設為 groupId
    const sourceIndex = source.index;
    const destIndex = destination.index;

    // 1. Optimistic Update (前端先動)
    reorderGroupItems(category.id, groupId, sourceIndex, destIndex);

    // 2. 準備新的 ID 順序發給後端
    // 這裡我們需要從 Store 取得最新的狀態，或者簡單地在 local 計算
    // 為了簡單起見，我們重新計算一下順序 ID
    const group = category.groups.find(g => g.id === groupId);
    if (group) {
      const newOrderIds = Array.from(group.items);
      const [removed] = newOrderIds.splice(sourceIndex, 1);
      newOrderIds.splice(destIndex, 0, removed);
      const orderedIds = newOrderIds.map(item => item.id);

      // 3. Backend Update (後端存檔)
      try {
        await reorderLinks(category.id, groupId, orderedIds);
      } catch (error) {
        console.error("Failed to reorder:", error);
        alert("Failed to save order");
        // 這裡理論上應該要 rollback state，但為了教學簡化先略過
      }
    }

  };
  const handleAddGroup = async () => {
    const title = prompt("Enter new group name (e.g. 'Documentation')");
    if (title) {
      await addGroup(category.id, title);
    }
  }

  return (
    <section id={category.id} className="mb-12 scroll-mt-20 group/category">

      {/* 標題列 */}
      <div className="flex items-center gap-4 mb-6 border-b pb-2">
        <h2 className="text-2xl font-bold tracking-tight">
          {category.title}
        </h2>

        {/* 2. 刪除分類按鈕 (Edit Mode Only) */}
        {isEditMode && (
          <button
            onClick={handleDeleteCategory}
            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors opacity-0 group-hover/category:opacity-100"
            title="Delete Category"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="space-y-8">
        {/* 我們把 Context 放在 Category 層級，
          這樣如果未來要做「跨群組拖曳」會比較容易擴充。
          目前每個 Category 都有獨立的 Context，互不干擾。
        */}
        <DragDropContext onDragEnd={onDragEnd}>
          {/* 3. 安全性檢查：如果 groups 存在才 map，避免新分類報錯 */}
          {category.groups?.map(group => (
            <LinkGroup
              key={group.id}
              group={group}
              categoryId={category.id}
            />
          ))}
        </DragDropContext>

        {/* 新增群組按鈕 */}
        {isEditMode && (
          <button
            onClick={handleAddGroup}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors px-1"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Add Group</span>
          </button>
        )}
      </div>
    </section>
  );
}
