// src/lib/store.ts
import { create } from 'zustand';
import { AppConfig, Environment, EnvironmentKey } from '@/types/config';

// 這裡我們暫時先 Hardcode 一個初始 Config，之後會從 JSON 讀取
// 這是為了讓 App 一跑起來就有東西看
import initialConfigData from '@/config/data.json';

interface NavState {
  config: AppConfig;
  currentEnvId: EnvironmentKey;
  searchQuery: string;

  // [新增] 搜尋視窗狀態
  isSearchOpen: boolean;

  // ⬇️ [新增] 編輯模式狀態
  isEditMode: boolean;

  // Actions
  setEnvironment: (id: EnvironmentKey) => void;
  setSearchQuery: (query: string) => void;

  // [新增] 切換搜尋視窗
  setSearchOpen: (isOpen: boolean) => void;

  // Selectors (Helpers)
  getCurrentEnv: () => Environment;

  // ⬇️ [新增] 切換動作
  toggleEditMode: () => void;

  setCategories: (categories: Category[]) => void;

  // [新增] 本地更新排序
  reorderGroupItems: (categoryId: string, groupId: string, sourceIndex: number, destinationIndex: number) => void;
}

export const useNavStore = create<NavState>((set, get) => ({
  // 1. Initial State
  config: initialConfigData as AppConfig,
  currentEnvId: 'dev', // 預設環境
  searchQuery: '',

  // [新增] 預設關閉
  isSearchOpen: false,

  // ⬇️ [新增] 預設關閉
  isEditMode: false,

  // 2. Actions
  setEnvironment: (id) => set({ currentEnvId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  // [新增] Action
  setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),

  // ⬇️ [新增] 切換邏輯
  toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),

  // 3. Helper to get the full Environment object
  getCurrentEnv: () => {
    const { config, currentEnvId } = get();
    return config.environments.find(e => e.id === currentEnvId) || config.environments[0];
  },

  setCategories: (categories) => set((state) => ({
    config: { ...state.config, categories }
  })),

  // [新增] 重新排列陣列邏輯
  reorderGroupItems: (categoryId, groupId, sourceIndex, destIndex) => set((state) => {
    // 深拷貝 config (為了 immutability)
    const newConfig = JSON.parse(JSON.stringify(state.config));

    // 找到目標陣列
    const category = newConfig.categories.find((c: any) => c.id === categoryId);
    const group = category?.groups.find((g: any) => g.id === groupId);

    if (group) {
      // 陣列搬移魔法
      const [removed] = group.items.splice(sourceIndex, 1);
      group.items.splice(destIndex, 0, removed);
    }

    return { config: newConfig };
  }),
}));