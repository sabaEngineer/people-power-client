export type FactType = 'PAIN' | 'GOAL' | 'LIKE';

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
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  birthday: string | null;
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
