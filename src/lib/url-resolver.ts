// src/lib/url-resolver.ts
import { Environment, LinkItem } from '@/types/config';

/**
 * Utility: 處理 CSS Class 合併 (Tailwind 必備)
 * 雖然這通常放在 utils.ts，但我先寫在這裡讓你知道需要它
 */
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ==========================================
// 核心邏輯開始
// ==========================================

/**
 * 解析 URL 樣板，將 {{variable}} 替換為當前環境的值
 */
export function resolveUrl(template: string, env: Environment): string {
  // 1. 準備變數池：預設包含 'env' (即 id) 以及該環境定義的所有 variables
  const variables: Record<string, string> = {
    env: env.id,
    ...env.variables
  };

  // 2. Regex 替換邏輯
  // 匹配 {{ key }}，容許 key 前後有空白
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, key) => {
    const value = variables[key];
    
    // 如果找不到變數，印出警告並保留原樣 (方便 Debug)
    if (value === undefined) {
      console.warn(`[DevOps Nav] Variable {{${key}}} not found in env: ${env.id}`);
      return match; 
    }
    
    return value;
  });
}

/**
 * 檢查連結在當前環境是否可見
 */
export function isLinkVisible(link: LinkItem, currentEnvId: EnvironmentKey): boolean {
  if (!link.visibleIn || link.visibleIn.length === 0) return true;
  return link.visibleIn.includes(currentEnvId);
}