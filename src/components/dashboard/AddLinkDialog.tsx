'use client';

import { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { addLink } from '@/lib/actions';
import { DynamicIcon } from '@/components/ui/DynamicIcon';

interface AddLinkDialogProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
  groupId: string;
}

export function AddLinkDialog({ isOpen, onClose, categoryId, groupId }: AddLinkDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // 表單狀態
  const [formData, setFormData] = useState({
    title: '',
    urlTemplate: '',
    description: '',
    icon: 'Link', // 預設值
    tags: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 呼叫 Server Action
      await addLink(categoryId, groupId, formData);
      onClose(); // 關閉視窗
      // 重置表單
      setFormData({ title: '', urlTemplate: '', description: '', icon: 'Link', tags: '' });
    } catch (error) {
      alert('Failed to add link');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Backdrop (遮罩)
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      
      {/* Modal Content */}
      <div className="w-full max-w-md bg-background border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
          <h2 className="text-lg font-semibold">Add New Link</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* 1. Title */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Title</label>
            <input 
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="e.g. Jenkins Master"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          {/* 2. URL Template */}
          <div className="space-y-1">
            <label className="text-sm font-medium">URL Template</label>
            <input 
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
              placeholder="https://{{base_url}}/..."
              value={formData.urlTemplate}
              onChange={e => setFormData({...formData, urlTemplate: e.target.value})}
            />
            <p className="text-[10px] text-muted-foreground">Available variables: <code>{'{{env}}'}</code>, <code>{'{{base_url}}'}</code></p>
          </div>

          {/* 3. Icon & Tags (Row) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium flex items-center gap-2">
                Icon 
                <DynamicIcon name={formData.icon} className="w-4 h-4 text-muted-foreground" />
              </label>
              <input 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Lucide Name"
                value={formData.icon}
                onChange={e => setFormData({...formData, icon: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Tags</label>
              <input 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="ops, daily"
                value={formData.tags}
                onChange={e => setFormData({...formData, tags: e.target.value})}
              />
            </div>
          </div>

          {/* 4. Description */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Description</label>
            <textarea 
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Markdown supported..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex justify-end gap-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Link
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}