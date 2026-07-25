import type { BirthdayReminderType, Tag } from '../lib/types';
import {
  BIRTHDAY_REMINDER_OPTIONS,
  DEFAULT_BIRTHDAY_REMINDERS,
} from '../lib/types';
import TagPicker from './TagPicker';

export interface ContactFormValues {
  firstName: string;
  lastName: string;
  birthday: string;
  birthdayReminders: BirthdayReminderType[];
  phone: string;
  socialUrl: string;
  description: string;
  tagIds: string[];
}

interface ContactFormProps {
  values: ContactFormValues;
  onChange: (values: ContactFormValues) => void;
  allTags: Tag[];
  onCreateTag: (name: string) => Promise<Tag>;
  submitLabel: string;
  onSubmit: () => void;
  loading?: boolean;
}

export default function ContactForm({
  values,
  onChange,
  allTags,
  onCreateTag,
  submitLabel,
  onSubmit,
  loading,
}: ContactFormProps) {
  const set = (patch: Partial<ContactFormValues>) =>
    onChange({ ...values, ...patch });

  const handleBirthdayChange = (birthday: string) => {
    if (!birthday) {
      set({ birthday: '', birthdayReminders: [] });
      return;
    }
    set({
      birthday,
      birthdayReminders:
        values.birthdayReminders.length > 0
          ? values.birthdayReminders
          : DEFAULT_BIRTHDAY_REMINDERS,
    });
  };

  const toggleReminder = (type: BirthdayReminderType) => {
    const selected = values.birthdayReminders.includes(type)
      ? values.birthdayReminders.filter((t) => t !== type)
      : [...values.birthdayReminders, type];
    set({ birthdayReminders: selected });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            First name
          </label>
          <input
            required
            type="text"
            value={values.firstName}
            onChange={(e) => set({ firstName: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Last name
          </label>
          <input
            required
            type="text"
            value={values.lastName}
            onChange={(e) => set({ lastName: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Birthday
          </label>
          <input
            type="date"
            value={values.birthday}
            onChange={(e) => handleBirthdayChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={values.phone}
            onChange={(e) => set({ phone: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {values.birthday && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Birthday reminders
          </label>
          <p className="text-xs text-slate-500 mb-2">
            Choose when you want an email reminder
          </p>
          <div className="flex flex-wrap gap-2">
            {BIRTHDAY_REMINDER_OPTIONS.map((opt) => {
              const selected = values.birthdayReminders.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleReminder(opt.value)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    selected
                      ? 'bg-indigo-100 border-indigo-300 text-indigo-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Description
        </label>
        <textarea
          value={values.description}
          onChange={(e) => set({ description: e.target.value })}
          rows={3}
          placeholder="How you met, context, notes…"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Social profile
        </label>
        <input
          type="url"
          value={values.socialUrl}
          onChange={(e) => set({ socialUrl: e.target.value })}
          placeholder="Facebook, Instagram, LinkedIn, etc."
          className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <TagPicker
        allTags={allTags}
        selectedIds={values.tagIds}
        onChange={(tagIds) => set({ tagIds })}
        onCreateTag={onCreateTag}
      />

      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
