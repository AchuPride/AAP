import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout        from './components/Layout';
import PrivateRoute  from './components/PrivateRoute';
import Home          from './pages/Home';
import ReportIncident from './pages/ReportIncident';
import TrackCase     from './pages/TrackCase';
import Login         from './pages/Login';
import Dashboard     from './pages/Dashboard';
import CaseDetail    from './pages/CaseDetail';
import AdminDashboard from './pages/AdminDashboard';
import NotFound      from './pages/NotFound';

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading SafeReport…</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/"        element={<Home />} />
        <Route path="/report"  element={<ReportIncident />} />
        <Route path="/track"   element={<TrackCase />} />
        <Route path="/login"   element={<Login />} />

        {/* Protected: officer + admin */}
        <Route element={<PrivateRoute roles={['officer', 'admin']} />}>
          <Route path="/dashboard"        element={<Dashboard />} />
          <Route path="/dashboard/:id"    element={<CaseDetail />} />
        </Route>

        {/* Protected: admin only */}
        <Route element={<PrivateRoute roles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
