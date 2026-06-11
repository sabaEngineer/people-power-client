import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthCallback from './pages/AuthCallback';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import ContactsPage from './pages/ContactsPage';
import NewContactPage from './pages/NewContactPage';
import ContactDetailPage from './pages/ContactDetailPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/contacts/new" element={<NewContactPage />} />
          <Route path="/contacts/:id" element={<ContactDetailPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
