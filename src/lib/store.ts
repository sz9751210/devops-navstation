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

  // Actions
  setEnvironment: (id: EnvironmentKey) => void;
  setSearchQuery: (query: string) => void;
  
  // [新增] 切換搜尋視窗
  setSearchOpen: (isOpen: boolean) => void;

  // Selectors (Helpers)
  getCurrentEnv: () => Environment;
}

export const useNavStore = create<NavState>((set, get) => ({
  // 1. Initial State
  config: initialConfigData as AppConfig,
  currentEnvId: 'dev', // 預設環境
  searchQuery: '',

  // [新增] 預設關閉
  isSearchOpen: false,

  // 2. Actions
  setEnvironment: (id) => set({ currentEnvId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  // [新增] Action
  setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),
  
  // 3. Helper to get the full Environment object
  getCurrentEnv: () => {
    const { config, currentEnvId } = get();
    return config.environments.find(e => e.id === currentEnvId) || config.environments[0];
  }
}));