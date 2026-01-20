import { Category, LinkGroup as LinkGroupType } from '@/types/config';
import { SmartLinkCard } from './SmartLinkCard';

// --- Molecule: LinkGroup ---
// 負責一個小群組標題和底下的 Grid
function LinkGroup({ group, categoryId }: { group: LinkGroupType, categoryId: string }) {
  if (group.items.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider pl-1">
        {group.title}
      </h3>
      {/* 響應式 Grid 佈局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {group.items.map(item => (
          <SmartLinkCard 
            key={item.id} 
            item={item} 
            categoryId={categoryId} 
            groupId={group.id} 
          />
        ))}
      </div>
    </div>
  );
}

// --- Organism: CategorySection ---
// 負責一大分類標題和底下的多個群組
export function CategorySection({ category }: { category: Category }) {
  // 如果該分類下沒有群組，就不渲染
  if (!category.groups || category.groups.length === 0) return null;

  return (
    <section id={category.id} className="mb-12 scroll-mt-20">
      <h2 className="text-2xl font-bold tracking-tight mb-6 border-b pb-2">
        {category.title}
      </h2>
      <div className="space-y-8">
        {category.groups.map(group => (
           <LinkGroup 
             key={group.id} 
             group={group} 
             categoryId={category.id} 
           />
        ))}
      </div>
    </section>
  );
}