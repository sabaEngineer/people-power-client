import { useState } from 'react';
import type { Tag } from '../lib/types';

interface TagPickerProps {
  allTags: Tag[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  onCreateTag: (name: string) => Promise<Tag>;
}

export default function TagPicker({
  allTags,
  selectedIds,
  onChange,
  onCreateTag,
}: TagPickerProps) {
  const [newTag, setNewTag] = useState('');
  const [creating, setCreating] = useState(false);

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((t) => t !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const handleCreate = async () => {
    const name = newTag.trim();
    if (!name) return;
    setCreating(true);
    try {
      const tag = await onCreateTag(name);
      setNewTag('');
      if (!selectedIds.includes(tag.id)) {
        onChange([...selectedIds, tag.id]);
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">Tags</label>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => {
          const selected = selectedIds.includes(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggle(tag.id)}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                selected
                  ? 'bg-indigo-100 border-indigo-300 text-indigo-800'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {tag.name}
            </button>
          );
        })}
        {allTags.length === 0 && (
          <span className="text-sm text-slate-400">No tags yet</span>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleCreate())}
          placeholder="New tag name"
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="button"
          onClick={handleCreate}
          disabled={creating || !newTag.trim()}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50"
        >
          Add
        </button>
      </div>
    </div>
  );
}
