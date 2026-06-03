import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend,
} from 'chart.js';
import {
  HiUserAdd, HiUsers, HiFolder, HiCheckCircle,
  HiRefresh, HiBan, HiCheck,
} from 'react-icons/hi';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const CHART_COLORS = ['#6366f1', '#f59e0b', '#8b5cf6', '#f97316', '#10b981', '#6b7280'];

export default function AdminDashboard() {
  const [stats,        setStats]        = useState(null);
  const [users,        setUsers]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [tab,          setTab]          = useState('overview'); // overview | users | audit
  const [newUser,      setNewUser]      = useState({ username: '', password: '', full_name: '', role: 'officer' });
  const [creating,     setCreating]     = useState(false);
  const [showForm,     setShowForm]     = useState(false);

  // Audit Logs state
  const [auditLogs,    setAuditLogs]    = useState([]);
  const [auditPage,    setAuditPage]    = useState(1);
  const [auditTotal,   setAuditTotal]   = useState(0);
  const [loadingAudit, setLoadingAudit] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data.users);
    } catch {
      // handled globally
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAuditLogs = useCallback(async (page = 1) => {
    setLoadingAudit(true);
    try {
      const { data } = await api.get(`/admin/audit-logs?page=${page}&limit=15`);
      setAuditLogs(data.logs);
      setAuditTotal(data.total);
      setAuditPage(data.page);
    } catch {
      // handled globally
    } finally {
      setLoadingAudit(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    if (tab === 'audit') {
      loadAuditLogs(1);
    }
  }, [tab, loadAuditLogs]);

  const createUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/admin/users', newUser);
      toast.success(`User "${newUser.username}" created.`);
      setNewUser({ username: '', password: '', full_name: '', role: 'officer' });
      setShowForm(false);
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user.');
    } finally {
      setCreating(false);
    }
  };

  const toggleUser = async (userId) => {
    try {
      const { data } = await api.patch(`/admin/users/${userId}/toggle`);
      toast.success(`User ${data.is_active ? 'activated' : 'deactivated'}.`);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, is_active: data.is_active } : u)));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Toggle failed.');
    }
  };

  if (loading) return <LoadingSpinner text="Loading admin dashboard…" />;

  const s = stats?.stats || {};
  const statCards = [
    { label: 'Total Cases',   value: s.total,       icon: <HiFolder   className="w-6 h-6 text-primary dark:text-indigo-400" />,  bg: 'bg-primary/5 dark:bg-indigo-950/20' },
    { label: 'Submitted',     value: s.submitted,   icon: <HiFolder   className="w-6 h-6 text-blue-500" />, bg: 'bg-blue-50 dark:bg-blue-950/20' },
    { label: 'Resolved',      value: s.resolved,    icon: <HiCheckCircle className="w-6 h-6 text-safe" />,  bg: 'bg-green-50 dark:bg-emerald-950/20' },
    { label: 'Last 30 Days',  value: s.last_30_days,icon: <HiRefresh  className="w-6 h-6 text-warm" />,     bg: 'bg-amber-50 dark:bg-amber-950/20' },
  ];

  const donutData = {
    labels: (s.by_type || []).map((t) => t.violence_type.replace('_', ' ')),
    datasets: [{ data: (s.by_type || []).map((t) => t.count), backgroundColor: CHART_COLORS, borderWidth: 2 }],
  };

  const statusLabels = ['submitted', 'under_review', 'assigned', 'investigating', 'resolved', 'closed'];
  const barData = {
    labels: statusLabels.map((l) => l.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())),
    datasets: [{
      label: 'Cases by Status',
      data: statusLabels.map((l) => parseInt(s[l]) || 0),
      backgroundColor: CHART_COLORS,
      borderRadius: 8,
    }],
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">System overview, audit logs and user management</p>
        </div>
        <button onClick={loadAll} className="btn-outline text-xs py-2">
          <HiRefresh className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl w-fit transition-colors">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'users', label: 'User Management' },
          { key: 'audit', label: 'Audit Logs' }
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all
              ${tab === t.key 
                ? 'bg-white dark:bg-gray-800 text-primary dark:text-indigo-400 shadow-sm' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Overview tab ── */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((c) => (
              <div key={c.label} className={`card ${c.bg} flex items-center gap-3 dark:border-transparent`}>
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm shrink-0">
                  {c.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{c.value ?? 0}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{c.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card dark:bg-gray-950 dark:border-gray-900">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Cases by Status</h3>
              <Bar data={barData} options={{ plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
            </div>
            <div className="card dark:bg-gray-950 dark:border-gray-900">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Cases by Type</h3>
              {donutData.labels.length ? (
                <Doughnut data={donutData} options={{ plugins: { legend: { position: 'bottom', labels: { color: '#9ca3af' } } } }} />
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-10">No data yet</p>
              )}
            </div>
          </div>

          {/* Officers table */}
          {stats?.officers?.length > 0 && (
            <div className="card dark:bg-gray-950 dark:border-gray-900">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                <HiUsers className="w-5 h-5 text-gray-500" /> Officer Workload
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-gray-100 dark:border-gray-900">
                    <tr>
                      {['Officer', 'Username', 'Active Cases'].map((h) => (
                        <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
                    {stats.officers.map((o) => (
                      <tr key={o.id}>
                        <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">{o.full_name}</td>
                        <td className="px-3 py-2 text-gray-500 dark:text-gray-400 font-mono text-xs">{o.username}</td>
                        <td className="px-3 py-2">
                          <span className="badge bg-primary/10 text-primary dark:bg-indigo-950/40 dark:text-indigo-400">{o.assigned_cases}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── User management tab ── */}
      {tab === 'users' && (
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200">Staff Accounts</h2>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary text-xs py-2">
              <HiUserAdd className="w-4 h-4" /> New User
            </button>
          </div>

          {/* Create user form */}
          {showForm && (
            <form onSubmit={createUser} className="card space-y-4 dark:bg-gray-950 dark:border-gray-900">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Create Staff Account</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name</label>
                  <input className="input" value={newUser.full_name} onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })} required placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="label">Username</label>
                  <input className="input" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} required placeholder="janedoe" />
                </div>
                <div>
                  <label className="label">Password</label>
                  <input type="password" className="input" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required placeholder="Min 8 chars, upper+lower+digit" />
                </div>
                <div>
                  <label className="label">Role</label>
                  <select className="input" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                    <option value="officer">Case Officer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={creating} className="btn-primary">
                  {creating ? 'Creating…' : 'Create User'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
              </div>
            </form>
          )}

          {/* Users table */}
          <div className="card !p-0 overflow-hidden dark:bg-gray-950 dark:border-gray-900">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-900">
                <tr>
                  {['Name', 'Username', 'Role', 'Status', 'Last Login', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
                {users.map((u) => (
                  <tr key={u.id} className={u.is_active ? '' : 'opacity-50'}>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{u.full_name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">{u.username}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${u.role === 'admin' ? 'bg-primary/10 text-primary dark:bg-indigo-950/40 dark:text-indigo-400' : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-450'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${u.is_active ? 'bg-green-50 text-green-700 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-red-50 text-red-650 dark:bg-red-950/30 dark:text-red-400'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-450 dark:text-gray-500">
                      {u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleUser(u.id)}
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg transition-colors
                          ${u.is_active ? 'text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30' : 'text-green-650 dark:text-emerald-400 hover:bg-green-50 dark:hover:bg-emerald-950/30'}`}
                      >
                        {u.is_active ? <><HiBan className="w-3.5 h-3.5" /> Deactivate</> : <><HiCheck className="w-3.5 h-3.5" /> Activate</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Audit Logs tab ── */}
      {tab === 'audit' && (
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200">System Activity Audit Log</h2>
            <button onClick={() => loadAuditLogs(auditPage)} className="btn-outline text-xs py-2 px-4">
              <HiRefresh className="w-4 h-4" /> Refresh Logs
            </button>
          </div>

          <div className="card !p-0 overflow-hidden dark:bg-gray-950 dark:border-gray-900 transition-colors">
            {loadingAudit ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-450">Loading audit records...</div>
            ) : auditLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-900">
                    <tr>
                      {['Actor', 'Action', 'Resource', 'ID', 'Details', 'IP Hash', 'Timestamp'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
                    {auditLogs.map((l) => (
                      <tr key={l.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-medium text-gray-900 dark:text-white">{l.actor_full_name || 'System'}</span>
                          {l.actor_username && (
                            <span className="block text-xs text-gray-400 dark:text-gray-500 font-mono">@{l.actor_username}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="badge bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 capitalize">
                            {l.action.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">{l.resource || '-'}</td>
                        <td className="px-4 py-3 text-xs text-gray-400 dark:text-gray-500 font-mono">{l.resource_id || '-'}</td>
                        <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate" title={JSON.stringify(l.metadata)}>
                          {Object.keys(l.metadata || {}).length > 0 ? (
                            <span className="font-mono text-[10px] text-gray-500 dark:text-gray-400">
                              {JSON.stringify(l.metadata)}
                            </span>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs font-mono text-gray-400 dark:text-gray-500" title={l.ip_hash || 'None'}>
                          {l.ip_hash ? `${l.ip_hash.substring(0, 10)}…` : '-'}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400 dark:text-gray-500">
                          {new Date(l.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-gray-450">No audit logs found.</div>
            )}
          </div>

          {/* Pagination */}
          {auditTotal > 15 && (
            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Showing {auditLogs.length} of {auditTotal} logs
              </span>
              <div className="flex gap-2">
                <button
                  disabled={auditPage === 1 || loadingAudit}
                  onClick={() => loadAuditLogs(auditPage - 1)}
                  className="btn-outline text-xs py-1.5 px-3 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  disabled={auditPage * 15 >= auditTotal || loadingAudit}
                  onClick={() => loadAuditLogs(auditPage + 1)}
                  className="btn-outline text-xs py-1.5 px-3 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
