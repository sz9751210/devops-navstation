import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
}

export const DynamicIcon = ({ name, className }: DynamicIconProps) => {
  // 1. 動態抓取元件
  // 為了 TypeScript 安全，我們將 Icons 視為一個 Record
  const IconComponent = (Icons as unknown as Record<string, LucideIcon>)[name];

  // 2. 如果找不到對應的 Icon，顯示預設的 HelpCircle，避免整個 App 崩潰
  if (!IconComponent) {
    // 開發模式下印出警告，方便除錯
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[DynamicIcon] Icon not found: "${name}". Using fallback.`);
    }
    return <Icons.HelpCircle className={className} />;
  }

  // 3. 渲染該元件
  return <IconComponent className={className} />;
};