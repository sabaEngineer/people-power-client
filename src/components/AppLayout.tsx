import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/contacts" className="text-lg font-semibold text-indigo-600">
            People Power
          </Link>
          <div className="flex items-center gap-4">
            {user?.name && (
              <span className="text-sm text-slate-500 hidden sm:inline">
                {user.name}
              </span>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
