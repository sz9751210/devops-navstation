'use client';

import { useState } from 'react';
import { X, Save, Loader2, FolderPlus } from 'lucide-react';
import { addCategory } from '@/lib/actions';

interface AddCategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddCategoryDialog({ isOpen, onClose }: AddCategoryDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addCategory(title);
      onClose();
      setTitle('');
    } catch (error) {
      alert('Failed to add category');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-background border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/30">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FolderPlus className="w-5 h-5" />
            New Category
          </h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Category Title</label>
            <input 
              required
              autoFocus
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="e.g. Back Office Tools"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors flex items-center gap-2">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
