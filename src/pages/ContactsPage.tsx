import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { apiFetch } from '../lib/api';
import type { Contact, Tag } from '../lib/types';
import ContactFilters from '../components/ContactFilters';
import SocialLinks from '../components/SocialLinks';

function formatBirthday(date: string | null): string | null {
  if (!date) return null;
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

export default function ContactsPage() {
  const { token } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTags = useCallback(async () => {
    const data = await apiFetch<Tag[]>('/tags', token);
    setTags(data ?? []);
  }, [token]);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (selectedTags.length) params.set('tags', selectedTags.join(','));
      const qs = params.toString();
      const data = await apiFetch<Contact[]>(
        `/contacts${qs ? `?${qs}` : ''}`,
        token,
      );
      setContacts(data ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [token, query, selectedTags]);

  useEffect(() => {
    void loadTags();
  }, [loadTags]);

  useEffect(() => {
    const t = setTimeout(() => void loadContacts(), 200);
    return () => clearTimeout(t);
  }, [loadContacts]);

  const toggleTag = (name: string) => {
    setSelectedTags((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name],
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Contacts</h1>
        <Link
          to="/contacts/new"
          className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          + Add contact
        </Link>
      </div>

      <ContactFilters
        query={query}
        onQueryChange={setQuery}
        allTags={tags}
        selectedTagNames={selectedTags}
        onTagToggle={toggleTag}
      />

      {error && (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      )}

      {loading ? (
        <p className="mt-8 text-slate-400">Loading…</p>
      ) : contacts.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-slate-500">No contacts found.</p>
          <Link
            to="/contacts/new"
            className="inline-block mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Add your first contact
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {contacts.map((contact) => (
            <li key={contact.id}>
              <Link
                to={`/contacts/${contact.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-indigo-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      {contact.firstName} {contact.lastName}
                    </h2>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                      {contact.phone && <span>{contact.phone}</span>}
                      {contact.birthday && (
                        <span>Birthday: {formatBirthday(contact.birthday)}</span>
                      )}
                    </div>
                    {contact.description && (
                      <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                        {contact.description}
                      </p>
                    )}
                    <SocialLinks
                      socialUrl={contact.socialUrl}
                      className="mt-2"
                      onLinkClick={(e) => e.stopPropagation()}
                    />
                    {contact.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {contact.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {contact.facts.length > 0 && (
                    <span className="text-xs text-slate-400 shrink-0">
                      {contact.facts.length} fact{contact.facts.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
