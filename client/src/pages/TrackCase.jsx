import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Timeline from '../components/Timeline';
import LoadingSpinner from '../components/LoadingSpinner';
import { format } from 'date-fns';
import { HiSearch, HiShieldCheck, HiCalendar, HiLocationMarker } from 'react-icons/hi';

const VIOLENCE_LABELS = {
  physical: 'Physical Violence', sexual: 'Sexual Violence',
  psychological: 'Psychological Abuse', economic: 'Economic Abuse',
  stalking: 'Stalking', online_harassment: 'Online Harassment', other: 'Other',
};

export default function TrackCase() {
  const location = useLocation();
  const [token,   setToken]   = useState(location.state?.token || '');
  const [loading, setLoading] = useState(false);
  const [caseData, setCaseData] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (location.state?.token) lookup(location.state.token);
  }, []); // eslint-disable-line

  const lookup = async (tok = token) => {
    const t = tok.trim().toUpperCase();
    if (!t) { toast.error('Please enter a case token.'); return; }
    setLoading(true);
    setSearched(true);
    setCaseData(null);
    try {
      const { data } = await api.get(`/cases/track/${encodeURIComponent(t)}`);
      setCaseData(data);
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error('Case not found. Please check your token.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); lookup(); };

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Track Your Case</h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter the token you received when you submitted your report.
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSubmit} className="card">
        <label className="label">Case Token</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value.toUpperCase())}
            placeholder="GBV-XXXXXXXX-XXXXXXXX-XXXXXXXX"
            className="input flex-1 font-mono tracking-wider"
            spellCheck={false}
          />
          <button type="submit" disabled={loading} className="btn-primary px-6 shrink-0">
            {loading
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><HiSearch className="w-4 h-4" /> Search</>
            }
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
          <HiShieldCheck className="w-3 h-3" />
          Your identity is never stored. Only your token links you to this case.
        </p>
      </form>

      {loading && <LoadingSpinner text="Looking up your case…" />}

      {/* No result */}
      {!loading && searched && !caseData && (
        <div className="card text-center py-10">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-semibold text-gray-700">Case Not Found</p>
          <p className="text-sm text-gray-500 mt-1">
            Please double-check your token. Tokens are case-sensitive.
          </p>
        </div>
      )}

      {/* Case result */}
      {caseData && (
        <div className="space-y-4">
          {/* Status card */}
          <div className="card space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-mono text-gray-400 mb-1">{caseData.case_token}</p>
                <p className="font-semibold text-gray-800">{VIOLENCE_LABELS[caseData.violence_type] || caseData.violence_type}</p>
              </div>
              <StatusBadge status={caseData.status} size="lg" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {caseData.incident_date && (
                <div className="flex items-center gap-2 text-gray-600">
                  <HiCalendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Incident Date</p>
                    <p className="font-medium">{format(new Date(caseData.incident_date), 'dd MMM yyyy')}</p>
                  </div>
                </div>
              )}
              {caseData.location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <HiLocationMarker className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-400">Location</p>
                    <p className="font-medium">{caseData.location}</p>
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-400">Submitted</p>
                <p className="font-medium">{format(new Date(caseData.submitted_at), 'dd MMM yyyy')}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Last Updated</p>
                <p className="font-medium">{format(new Date(caseData.last_updated), 'dd MMM yyyy')}</p>
              </div>
            </div>

            {caseData.assigned_to && (
              <div className="bg-purple-50 rounded-xl px-4 py-2 text-sm">
                <span className="text-purple-600 font-medium">Assigned Officer: </span>
                <span className="text-purple-800">{caseData.assigned_to}</span>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="card space-y-4">
            <h2 className="font-semibold text-gray-800">Case Timeline</h2>
            <Timeline updates={caseData.timeline} showNotes={false} />
          </div>
        </div>
      )}
    </div>
  );
}
