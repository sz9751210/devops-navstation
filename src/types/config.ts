// src/types/config.ts

export type EnvironmentKey = 'local' | 'dev' | 'staging' | 'prod';

export interface Environment {
  id: EnvironmentKey;
  label: string;
  themeColor: string; // 用於 UI 邊框或標籤顏色
  variables: {
    [key: string]: string; // 環境變數，如 { "base_url": "api.dev.com" }
  };
}

export interface LinkItem {
  id: string;
  title: string;
  description?: string; // Markdown 支援
  icon?: string; // Lucide icon name (e.g., 'Activity')
  urlTemplate: string; // 核心：支援 {{variable}} 的 URL
  visibleIn?: EnvironmentKey[]; // 若未定義則全環境顯示
  tags?: string[];
}

export interface LinkGroup {
  id: string;
  title: string;
  items: LinkItem[];
}

export interface Category {
  id: string;
  title: string;
  groups: LinkGroup[];
}

export interface AppConfig {
  environments: Environment[];
  categories: Category[];
}
