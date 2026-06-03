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
  HiRefresh, HiBan, HiCheck, HiPlus, HiTrash, HiShieldCheck, HiPencil
} from 'react-icons/hi';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const CHART_COLORS = ['#6366f1', '#f59e0b', '#8b5cf6', '#f97316', '#10b981', '#6b7280'];

export default function AdminDashboard() {
  const [stats,        setStats]        = useState(null);
  const [users,        setUsers]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [tab,          setTab]          = useState('overview'); // overview | users | partners | news | testimonials | audit
  
  // Create user
  const [newUser,      setNewUser]      = useState({ username: '', password: '', full_name: '', role: 'officer' });
  const [creating,     setCreating]     = useState(false);
  const [showForm,     setShowForm]     = useState(false);

  // Partners states
  const [partners,     setPartners]     = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(false);
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [newPartner,   setNewPartner]   = useState({ name: '', category: 'civil_society', description: '', contact_phone: '', website_url: '' });
  const [creatingPartner, setCreatingPartner] = useState(false);

  // News states
  const [newsList,     setNewsList]     = useState([]);
  const [loadingNews,  setLoadingNews]  = useState(false);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [newNews,      setNewNews]      = useState({ title: '', content: '', category: 'news' });
  const [creatingNews, setCreatingNews] = useState(false);

  // Testimonials states
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(false);

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

  const loadPartners = useCallback(async () => {
    setLoadingPartners(true);
    try {
      const { data } = await api.get('/partners');
      setPartners(data);
    } catch {
      toast.error('Failed to load partners.');
    } finally {
      setLoadingPartners(false);
    }
  }, []);

  const loadNews = useCallback(async () => {
    setLoadingNews(true);
    try {
      const { data } = await api.get('/news?limit=100');
      setNewsList(data.articles || []);
    } catch {
      toast.error('Failed to load news.');
    } finally {
      setLoadingNews(false);
    }
  }, []);

  const loadTestimonials = useCallback(async () => {
    setLoadingTestimonials(true);
    try {
      const { data } = await api.get('/testimonials/all');
      setTestimonials(data);
    } catch {
      toast.error('Failed to load testimonials.');
    } finally {
      setLoadingTestimonials(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    if (tab === 'audit') loadAuditLogs(1);
    if (tab === 'partners') loadPartners();
    if (tab === 'news') loadNews();
    if (tab === 'testimonials') loadTestimonials();
  }, [tab, loadAuditLogs, loadPartners, loadNews, loadTestimonials]);

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

  // Partners handlers
  const createPartnerHandler = async (e) => {
    e.preventDefault();
    setCreatingPartner(true);
    try {
      await api.post('/partners', newPartner);
      toast.success('Partner created successfully.');
      setNewPartner({ name: '', category: 'civil_society', description: '', contact_phone: '', website_url: '' });
      setShowPartnerForm(false);
      loadPartners();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create partner.');
    } finally {
      setCreatingPartner(false);
    }
  };

  const deletePartnerHandler = async (id) => {
    if (!window.confirm('Are you sure you want to delete this partner?')) return;
    try {
      await api.delete(`/partners/${id}`);
      toast.success('Partner deleted.');
      loadPartners();
    } catch {
      toast.error('Failed to delete partner.');
    }
  };

  // News handlers
  const createNewsHandler = async (e) => {
    e.preventDefault();
    setCreatingNews(true);
    try {
      await api.post('/news', newNews);
      toast.success('News article published.');
      setNewNews({ title: '', content: '', category: 'news' });
      setShowNewsForm(false);
      loadNews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish news.');
    } finally {
      setCreatingNews(false);
    }
  };

  const deleteNewsHandler = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;
    try {
      await api.delete(`/news/${id}`);
      toast.success('Article deleted.');
      loadNews();
    } catch {
      toast.error('Failed to delete article.');
    }
  };

  // Testimonials handlers
  const approveTestimonialHandler = async (id) => {
    try {
      await api.patch(`/testimonials/${id}/approve`);
      toast.success('Testimonial approved.');
      loadTestimonials();
    } catch {
      toast.error('Failed to approve testimonial.');
    }
  };

  const deleteTestimonialHandler = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await api.delete(`/testimonials/${id}`);
      toast.success('Testimonial deleted.');
      loadTestimonials();
    } catch {
      toast.error('Failed to delete testimonial.');
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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-905 dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Control panel for cases, staff, partners, campaigns, and testimonials</p>
        </div>
        <button onClick={loadAll} className="btn-outline text-xs py-2">
          <HiRefresh className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl w-fit transition-colors">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'users', label: 'User Management' },
          { key: 'partners', label: 'Partners' },
          { key: 'news', label: 'News Publisher' },
          { key: 'testimonials', label: 'Testimonials' },
          { key: 'audit', label: 'Audit Logs' }
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all
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
                    <td className="px-4 py-3 text-right">
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

      {/* ── Partners tab ── */}
      {tab === 'partners' && (
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200">NGOs & Agencies Network</h2>
            <button onClick={() => setShowPartnerForm(!showPartnerForm)} className="btn-primary text-xs py-2">
              <HiPlus className="w-4 h-4" /> Add Partner
            </button>
          </div>

          {showPartnerForm && (
            <form onSubmit={createPartnerHandler} className="card space-y-4 dark:bg-gray-950 dark:border-gray-900">
              <h3 className="font-bold text-sm text-gray-850 dark:text-gray-200">Register Support Network Partner</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Partner Name</label>
                  <input className="input" value={newPartner.name} onChange={(e) => setNewPartner({ ...newPartner, name: e.target.value })} required placeholder="e.g. MINPROFF Cameroon" />
                </div>
                <div>
                  <label className="label">Category</label>
                  <select className="input" value={newPartner.category} onChange={(e) => setNewPartner({ ...newPartner, category: e.target.value })}>
                    <option value="government_agency">Government Agency</option>
                    <option value="civil_society">Civil Society / NGO</option>
                    <option value="medical">Medical Center</option>
                    <option value="legal">Legal Aid</option>
                    <option value="psychosocial">Psychosocial Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label">Contact Phone</label>
                  <input className="input" value={newPartner.contact_phone} onChange={(e) => setNewPartner({ ...newPartner, contact_phone: e.target.value })} placeholder="+237 600 000 000" />
                </div>
                <div>
                  <label className="label">Website URL</label>
                  <input className="input" value={newPartner.website_url} onChange={(e) => setNewPartner({ ...newPartner, website_url: e.target.value })} placeholder="https://example.org" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Description</label>
                  <textarea className="input resize-none" rows={3} value={newPartner.description} onChange={(e) => setNewPartner({ ...newPartner, description: e.target.value })} placeholder="Describe support capabilities..." />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={creatingPartner} className="btn-primary">
                  {creatingPartner ? 'Registering...' : 'Add Partner'}
                </button>
                <button type="button" onClick={() => setShowPartnerForm(false)} className="btn-outline">Cancel</button>
              </div>
            </form>
          )}

          <div className="card !p-0 overflow-hidden dark:bg-gray-950 dark:border-gray-900">
            {loadingPartners ? (
              <div className="p-8 text-center text-gray-500">Loading partners...</div>
            ) : partners.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-900">
                  <tr>
                    {['Name', 'Category', 'Contact', 'Website', ''].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
                  {partners.map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-3">
                        <span className="font-bold text-gray-850 dark:text-white">{p.name}</span>
                        <span className="block text-[10px] text-gray-400 max-w-xs truncate">{p.description}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge bg-indigo-50 dark:bg-indigo-950/45 text-primary dark:text-indigo-400 uppercase tracking-wider text-[9px] font-bold">
                          {p.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300">{p.contact_phone || '-'}</td>
                      <td className="px-4 py-3 text-xs text-primary dark:text-indigo-400 truncate max-w-xs">{p.website_url || '-'}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => deletePartnerHandler(p.id)}
                          className="p-1 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/30 rounded"
                          title="Delete partner"
                        >
                          <HiTrash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">No support partners registered yet.</div>
            )}
          </div>
        </div>
      )}

      {/* ── News Publisher tab ── */}
      {tab === 'news' && (
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200">Campaigns & Security Alerts</h2>
            <button onClick={() => setShowNewsForm(!showNewsForm)} className="btn-primary text-xs py-2">
              <HiPlus className="w-4 h-4" /> New Article
            </button>
          </div>

          {showNewsForm && (
            <form onSubmit={createNewsHandler} className="card space-y-4 dark:bg-gray-950 dark:border-gray-900">
              <h3 className="font-bold text-sm text-gray-850 dark:text-gray-200">Publish News or Security Alert</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="label">Title</label>
                  <input className="input" value={newNews.title} onChange={(e) => setNewNews({ ...newNews, title: e.target.value })} required placeholder="e.g. SafeReport Cameroon Launch" />
                </div>
                <div>
                  <label className="label">Category</label>
                  <select className="input" value={newNews.category} onChange={(e) => setNewNews({ ...newNews, category: e.target.value })}>
                    <option value="news">News Update</option>
                    <option value="campaign">Awareness Campaign</option>
                    <option value="update">Platform update</option>
                    <option value="alert">Security Alert</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label className="label">Content Body</label>
                  <textarea className="input resize-none" rows={6} value={newNews.content} onChange={(e) => setNewNews({ ...newNews, content: e.target.value })} required placeholder="Write article content..." />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={creatingNews} className="btn-primary">
                  {creatingNews ? 'Publishing...' : 'Publish Article'}
                </button>
                <button type="button" onClick={() => setShowNewsForm(false)} className="btn-outline">Cancel</button>
              </div>
            </form>
          )}

          <div className="card !p-0 overflow-hidden dark:bg-gray-950 dark:border-gray-900">
            {loadingNews ? (
              <div className="p-8 text-center text-gray-500">Loading articles...</div>
            ) : newsList.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-900">
                  <tr>
                    {['Article', 'Category', 'Published At', 'Author', ''].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
                  {newsList.map((n) => (
                    <tr key={n.id}>
                      <td className="px-4 py-3">
                        <span className="font-bold text-gray-850 dark:text-white block max-w-sm truncate">{n.title}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge bg-indigo-50 dark:bg-indigo-950/45 text-primary dark:text-indigo-400 uppercase tracking-wider text-[9px] font-bold">
                          {n.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-450">
                        {new Date(n.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400 font-semibold">{n.author_name || 'Staff'}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => deleteNewsHandler(n.id)}
                          className="p-1 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/30 rounded"
                          title="Delete article"
                        >
                          <HiTrash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">No awareness articles published yet.</div>
            )}
          </div>
        </div>
      )}

      {/* ── Testimonials tab ── */}
      {tab === 'testimonials' && (
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200">Survivor Testimonials Moderation</h2>
          </div>

          <div className="card !p-0 overflow-hidden dark:bg-gray-950 dark:border-gray-900">
            {loadingTestimonials ? (
              <div className="p-8 text-center text-gray-500">Loading testimonials...</div>
            ) : testimonials.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-900">
                  <tr>
                    {['Content', 'Author', 'Status', 'Submitted At', ''].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-900">
                  {testimonials.map((t) => (
                    <tr key={t.id}>
                      <td className="px-4 py-3 max-w-sm">
                        <p className="text-xs text-gray-650 dark:text-gray-300 italic">"{t.content}"</p>
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-gray-800 dark:text-gray-200">{t.author_name}</td>
                      <td className="px-4 py-3">
                        <span className={`badge ${t.is_approved ? 'bg-green-50 text-green-700 dark:bg-emerald-950/30' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30'}`}>
                          {t.is_approved ? 'Approved' : 'Pending Review'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-450">
                        {new Date(t.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex gap-2 justify-end">
                          {!t.is_approved && (
                            <button
                              onClick={() => approveTestimonialHandler(t.id)}
                              className="p-1 text-emerald-650 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded"
                              title="Approve testimonial"
                            >
                              <HiCheck className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteTestimonialHandler(t.id)}
                            className="p-1 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/30 rounded"
                            title="Delete testimonial"
                          >
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">No survivor testimonials submitted yet.</div>
            )}
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
