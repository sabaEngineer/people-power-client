import type { Tag } from '../lib/types';

interface ContactFiltersProps {
  query: string;
  onQueryChange: (q: string) => void;
  allTags: Tag[];
  selectedTagNames: string[];
  onTagToggle: (name: string) => void;
}

export default function ContactFilters({
  query,
  onQueryChange,
  allTags,
  selectedTagNames,
  onTagToggle,
}: ContactFiltersProps) {
  return (
    <div className="space-y-4">
      <input
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search by name…"
        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const selected = selectedTagNames.includes(tag.name);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => onTagToggle(tag.name)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  selected
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
