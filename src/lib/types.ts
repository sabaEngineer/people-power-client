export type FactType = 'PAIN' | 'GOAL' | 'LIKE';

export type ReminderTiming =
  | 'ON_DAY'
  | 'DAY_BEFORE'
  | 'ONE_WEEK_BEFORE'
  | 'ONE_MONTH_BEFORE';

/** @deprecated Use ReminderTiming — kept as alias for birthday fields */
export type BirthdayReminderType = ReminderTiming;

export interface Tag {
  id: string;
  name: string;
}

export interface Fact {
  id: string;
  contactId: string;
  type: FactType;
  content: string;
  reminderDate: string | null;
  reminderTimings: ReminderTiming[];
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  birthday: string | null;
  birthdayReminders: ReminderTiming[];
  phone: string | null;
  socialUrl: string | null;
  description: string | null;
  facts: Fact[];
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  timeZone: string;
}

export const FACT_TYPE_LABELS: Record<FactType, string> = {
  PAIN: 'Pain / Problem',
  GOAL: 'Goal / Target',
  LIKE: 'Likes',
};

export const REMINDER_TIMING_OPTIONS: {
  value: ReminderTiming;
  label: string;
}[] = [
  { value: 'ON_DAY', label: 'On this day' },
  { value: 'DAY_BEFORE', label: 'The day before' },
  { value: 'ONE_WEEK_BEFORE', label: '1 week before' },
  { value: 'ONE_MONTH_BEFORE', label: '1 month before' },
];

export const BIRTHDAY_REMINDER_OPTIONS = REMINDER_TIMING_OPTIONS;

export const DEFAULT_BIRTHDAY_REMINDERS: ReminderTiming[] = [
  'ON_DAY',
  'ONE_WEEK_BEFORE',
];

export const DEFAULT_FACT_REMINDERS: ReminderTiming[] = ['ON_DAY'];
