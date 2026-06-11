import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { apiFetch } from '../lib/api';
import type { Contact, FactType, Tag } from '../lib/types';
import ContactForm, { type ContactFormValues } from '../components/ContactForm';
import FactsList from '../components/FactsList';
import SocialLinks from '../components/SocialLinks';

function contactToForm(contact: Contact): ContactFormValues {
  return {
    firstName: contact.firstName,
    lastName: contact.lastName,
    birthday: contact.birthday?.slice(0, 10) ?? '',
    phone: contact.phone ?? '',
    socialUrl: contact.socialUrl ?? '',
    description: contact.description ?? '',
    tagIds: contact.tags.map((t) => t.id),
  };
}

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [contact, setContact] = useState<Contact | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [values, setValues] = useState<ContactFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [contactData, tagsData] = await Promise.all([
        apiFetch<Contact>(`/contacts/${id}`, token),
        apiFetch<Tag[]>('/tags', token),
      ]);
      if (contactData) {
        setContact(contactData);
        setValues(contactToForm(contactData));
      }
      setTags(tagsData ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    void load();
  }, [load]);

  const createTag = async (name: string) => {
    const tag = await apiFetch<Tag>('/tags', token, {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
    if (!tag) throw new Error('Failed to create tag');
    setTags((prev) => [...prev, tag].sort((a, b) => a.name.localeCompare(b.name)));
    return tag;
  };

  const handleSave = async () => {
    if (!id || !values) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await apiFetch<Contact>(`/contacts/${id}`, token, {
        method: 'PATCH',
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
      if (updated) {
        setContact(updated);
        setValues(contactToForm(updated));
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('Delete this contact?')) return;
    await apiFetch(`/contacts/${id}`, token, { method: 'DELETE' });
    navigate('/contacts');
  };

  const handleAddFact = async (data: {
    type: FactType;
    content: string;
    reminderDate?: string;
  }) => {
    if (!id) return;
    await apiFetch(`/contacts/${id}/facts`, token, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    await load();
  };

  const handleUpdateFact = async (
    factId: string,
    data: { type?: FactType; content?: string; reminderDate?: string | null },
  ) => {
    if (!id) return;
    await apiFetch(`/contacts/${id}/facts/${factId}`, token, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    await load();
  };

  const handleDeleteFact = async (factId: string) => {
    if (!id || !confirm('Delete this fact?')) return;
    await apiFetch(`/contacts/${id}/facts/${factId}`, token, {
      method: 'DELETE',
    });
    await load();
  };

  if (loading) {
    return <p className="text-slate-400">Loading…</p>;
  }

  if (!contact || !values) {
    return (
      <div>
        <p className="text-red-600">{error ?? 'Contact not found'}</p>
        <Link to="/contacts" className="text-indigo-600 mt-4 inline-block">
          ← Back to contacts
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/contacts" className="text-sm text-indigo-600 hover:text-indigo-800">
        ← Back to contacts
      </Link>
      <div className="flex items-start justify-between mt-4 mb-2 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {contact.firstName} {contact.lastName}
          </h1>
          <SocialLinks socialUrl={contact.socialUrl} className="mt-2" />
        </div>
        <button
          type="button"
          onClick={handleDelete}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      </div>

      {error && <p className="mb-4 mt-4 text-sm text-red-600">{error}</p>}

      <ContactForm
        values={values}
        onChange={setValues}
        allTags={tags}
        onCreateTag={createTag}
        submitLabel="Save changes"
        onSubmit={handleSave}
        loading={saving}
      />

      <hr className="my-10 border-slate-200" />

      <FactsList
        facts={contact.facts}
        onAdd={handleAddFact}
        onUpdate={handleUpdateFact}
        onDelete={handleDeleteFact}
      />
    </div>
  );
}
