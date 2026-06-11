import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/auth';

export default function ProtectedRoute() {
  const { token } = useAuth();
  if (!token) return <Navigate to="/" replace />;
  return <Outlet />;
}
