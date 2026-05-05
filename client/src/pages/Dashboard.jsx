import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import { format } from 'date-fns';
import { HiFilter, HiRefresh, HiEye } from 'react-icons/hi';

const STATUSES = ['', 'submitted', 'under_review', 'assigned', 'investigating', 'resolved', 'closed'];

const VIOLENCE_LABELS = {
  physical: 'Physical', sexual: 'Sexual', psychological: 'Psychological',
  economic: 'Economic', stalking: 'Stalking', online_harassment: 'Online', other: 'Other',
};

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [cases,   setCases]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [status,  setStatus]  = useState('');
  const [page,    setPage]    = useState(1);
  const [total,   setTotal]   = useState(0);
  const LIMIT = 15;

  const fetchCases = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (status) params.status = status;
      const { data } = await api.get('/cases', { params });
      setCases(data.cases);
      setTotal(data.total);
    } catch {
      // error handled globally
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => { fetchCases(); }, [fetchCases]);

  const handleStatus = (s) => { setStatus(s); setPage(1); };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Case Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isAdmin ? 'All cases' : `Cases assigned to ${user?.full_name}`}
          </p>
        </div>
        <button onClick={fetchCases} className="btn-outline text-xs py-2 self-start sm:self-auto">
          <HiRefresh className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="card !p-4 flex flex-wrap gap-2 items-center">
        <HiFilter className="w-4 h-4 text-gray-400" />
        <span className="text-xs font-medium text-gray-500 mr-1">Status:</span>
        {STATUSES.map((s) => (
          <button
            key={s || 'all'}
            onClick={() => handleStatus(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors
              ${status === s
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {s ? s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'All'}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <LoadingSpinner text="Loading cases…" />
      ) : cases.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-3xl mb-2">📁</p>
          <p className="font-medium text-gray-600">No cases found</p>
          <p className="text-sm text-gray-400 mt-1">
            {status ? 'Try a different status filter.' : 'No cases have been submitted yet.'}
          </p>
        </div>
      ) : (
        <div className="card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Token', 'Type', 'Location', 'Date', 'Status', 'Officer', ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {cases.map((c) => (
                  <tr key={c.id} className={`hover:bg-gray-50 transition-colors ${c.is_priority ? 'bg-red-50/30' : ''}`}>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">
                      {c.is_priority && <span className="text-red-500 mr-1">🔴</span>}
                      {c.case_token}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{VIOLENCE_LABELS[c.violence_type] || c.violence_type}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs max-w-[120px] truncate">{c.location || '—'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                      {format(new Date(c.incident_date), 'dd MMM yyyy')}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3 text-xs text-gray-500">{c.officer_name || <span className="text-gray-300">Unassigned</span>}</td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/dashboard/${c.id}`}
                        className="inline-flex items-center gap-1 text-primary text-xs font-medium hover:underline"
                      >
                        <HiEye className="w-3.5 h-3.5" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-100">
            <Pagination page={page} total={total} limit={LIMIT} onPage={setPage} />
          </div>
        </div>
      )}
    </div>
  );
}
