import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { apiFetch } from '../lib/api';
import type { Tag } from '../lib/types';
import ContactForm, { type ContactFormValues } from '../components/ContactForm';

const emptyValues: ContactFormValues = {
  firstName: '',
  lastName: '',
  birthday: '',
  phone: '',
  socialUrl: '',
  description: '',
  tagIds: [],
};

export default function NewContactPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState<ContactFormValues>(emptyValues);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTags = useCallback(async () => {
    const data = await apiFetch<Tag[]>('/tags', token);
    setTags(data ?? []);
  }, [token]);

  useEffect(() => {
    void loadTags();
  }, [loadTags]);

  const createTag = async (name: string) => {
    const tag = await apiFetch<Tag>('/tags', token, {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    if (!tag) throw new Error('Failed to create tag');
    setTags((prev) => [...prev, tag].sort((a, b) => a.name.localeCompare(b.name)));
    return tag;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const contact = await apiFetch<{ id: string }>('/contacts', token, {
        method: 'POST',
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          birthday: values.birthday || undefined,
          phone: values.phone || undefined,
          socialUrl: values.socialUrl || undefined,
          description: values.description || undefined,
          tagIds: values.tagIds,
        }),
      });
      if (contact) navigate(`/contacts/${contact.id}`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Link to="/contacts" className="text-sm text-indigo-600 hover:text-indigo-800">
        ← Back to contacts
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 mt-4 mb-6">New contact</h1>
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <ContactForm
        values={values}
        onChange={setValues}
        allTags={tags}
        onCreateTag={createTag}
        submitLabel="Create contact"
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
