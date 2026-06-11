import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <nav className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
        <span className="text-xl font-bold text-indigo-600">People Power</span>
        {user ? (
          <Link
            to="/contacts"
            className="text-sm font-medium px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            My contacts
          </Link>
        ) : (
          <a
            href={`${import.meta.env.VITE_API_URL ?? ''}/auth/google`}
            className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 bg-white text-slate-800 rounded-lg border border-slate-200 hover:bg-slate-50 shadow-sm"
          >
            <GoogleIcon />
            Sign in with Google
          </a>
        )}
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight">
          Remember the people{' '}
          <span className="text-indigo-600">who matter</span>
        </h1>
        <p className="mt-6 text-lg text-slate-600 leading-relaxed">
          A personal CRM for the people you meet. Save their birthdays, what they care about,
          and what they need — with reminders so you never forget to follow up.
        </p>

        {!user && (
          <a
            href={`${import.meta.env.VITE_API_URL ?? ''}/auth/google`}
            className="inline-flex items-center gap-2 mt-10 text-base font-medium px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md"
          >
            <GoogleIcon />
            Get started with Google
          </a>
        )}

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <Feature
            title="Track what matters"
            description="Record pain points, goals, and likes for every person you meet."
          />
          <Feature
            title="Never miss a birthday"
            description="Automatic reminders one week before and on the day."
          />
          <Feature
            title="Organize with tags"
            description="Filter and search your network by work, family, hobbies, and more."
          />
        </div>
      </div>
    </div>
  );
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-800">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59a14.5 14.5 0 0 1 0-9.18l-7.98-6.19a24.01 24.01 0 0 0 0 21.56l7.98-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}
