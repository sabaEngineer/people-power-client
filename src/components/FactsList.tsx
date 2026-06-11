import { useState } from 'react';
import type { Fact, FactType } from '../lib/types';
import { FACT_TYPE_LABELS } from '../lib/types';

interface FactsListProps {
  facts: Fact[];
  onAdd: (data: { type: FactType; content: string; reminderDate?: string }) => Promise<void>;
  onUpdate: (
    factId: string,
    data: { type?: FactType; content?: string; reminderDate?: string | null },
  ) => Promise<void>;
  onDelete: (factId: string) => Promise<void>;
}

const FACT_TYPES: FactType[] = ['PAIN', 'GOAL', 'LIKE'];

export default function FactsList({ facts, onAdd, onUpdate, onDelete }: FactsListProps) {
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<FactType>('PAIN');
  const [content, setContent] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setType('PAIN');
    setContent('');
    setReminderDate('');
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      if (editingId) {
        await onUpdate(editingId, {
          type,
          content: content.trim(),
          reminderDate: reminderDate || null,
        });
      } else {
        await onAdd({
          type,
          content: content.trim(),
          reminderDate: reminderDate || undefined,
        });
      }
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (fact: Fact) => {
    setEditingId(fact.id);
    setType(fact.type);
    setContent(fact.content);
    setReminderDate(fact.reminderDate?.slice(0, 10) ?? '');
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Facts</h3>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            + Add fact
          </button>
        )}
      </div>

      {showForm && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as FactType)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            {FACT_TYPES.map((t) => (
              <option key={t} value={t}>
                {FACT_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            placeholder="What do you want to remember?"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Reminder date (optional)
            </label>
            <input
              type="date"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving || !content.trim()}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Saving…' : editingId ? 'Update' : 'Add'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {facts.length === 0 && !showForm && (
        <p className="text-sm text-slate-400">No facts yet. Add their pain points, goals, or likes.</p>
      )}

      <ul className="space-y-3">
        {facts.map((fact) => (
          <li
            key={fact.id}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 mb-2">
                  {FACT_TYPE_LABELS[fact.type]}
                </span>
                <p className="text-sm text-slate-800 whitespace-pre-wrap">{fact.content}</p>
                {fact.reminderDate && (
                  <p className="text-xs text-slate-400 mt-2">
                    Reminder: {fact.reminderDate.slice(0, 10)}
                    {fact.reminderSent && ' (sent)'}
                  </p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => startEdit(fact)}
                  className="text-xs text-indigo-600 hover:text-indigo-800"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(fact.id)}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
