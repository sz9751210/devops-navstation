'use client';

import { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { updateLink } from '@/lib/actions'; // 改用 updateLink
import { DynamicIcon } from '@/components/ui/DynamicIcon';
import { LinkItem } from '@/types/config';

interface EditLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
  groupId: string;
  item: LinkItem; // 必須傳入原始資料
}

export function EditLinkDialog({ isOpen, onClose, categoryId, groupId, item }: EditLinkDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // 初始化表單狀態
  const [formData, setFormData] = useState({
    title: '',
    urlTemplate: '',
    description: '',
    icon: '',
    tags: ''
  });

  // 當視窗打開或 item 改變時，將原始資料填入表單
  useEffect(() => {
    if (isOpen && item) {
      setFormData({
        title: item.title,
        urlTemplate: item.urlTemplate,
        description: item.description || '',
        icon: item.icon || 'Link',
        tags: item.tags ? item.tags.join(', ') : ''
      });
    }
  }, [isOpen, item]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 呼叫 updateLink
      await updateLink(categoryId, groupId, item.id, formData);
      onClose();
    } catch (error) {
      alert('Failed to update link');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-background border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
          <h2 className="text-lg font-semibold">Edit Link</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="space-y-1">
            <label className="text-sm font-medium">Title</label>
            <input 
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">URL Template</label>
            <input 
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
              value={formData.urlTemplate}
              onChange={e => setFormData({...formData, urlTemplate: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium flex items-center gap-2">
                Icon <DynamicIcon name={formData.icon} className="w-4 h-4 text-muted-foreground" />
              </label>
              <input 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.icon}
                onChange={e => setFormData({...formData, icon: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Tags</label>
              <input 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.tags}
                onChange={e => setFormData({...formData, tags: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Description</label>
            <textarea 
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors flex items-center gap-2">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Update Link
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}