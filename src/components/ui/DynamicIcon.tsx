import { type LucideIcon, icons } from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
}

export const DynamicIcon = ({ name, className }: DynamicIconProps) => {
  // 1. 從 lucide 的 icons 物件中動態抓取元件
  // 為了安全起見，轉型並提供預設值
  const IconComponent = (icons as unknown as Record<string, LucideIcon>)[name] || icons.HelpCircle;

  // 2. 渲染該元件
  return <IconComponent className={className} />;
};