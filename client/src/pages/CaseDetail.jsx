import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import Timeline from '../components/Timeline';
import LoadingSpinner from '../components/LoadingSpinner';
import { format } from 'date-fns';
import { HiArrowLeft, HiSave, HiExclamation } from 'react-icons/hi';

const STATUSES = ['submitted', 'under_review', 'assigned', 'investigating', 'resolved', 'closed'];
const VIOLENCE_LABELS = {
  physical: 'Physical Violence', sexual: 'Sexual Violence',
  psychological: 'Psychological Abuse', economic: 'Economic Abuse',
  stalking: 'Stalking', online_harassment: 'Online Harassment', other: 'Other',
};

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [caseData, setCaseData]  = useState(null);
  const [officers, setOfficers]  = useState([]);
  const [loading,  setLoading]   = useState(true);
  const [saving,   setSaving]    = useState(false);

  const [form, setForm] = useState({
    status: '', assigned_officer_id: '', note: '', public_message: '', is_priority: false,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [caseRes, officerRes] = await Promise.all([
          api.get(`/cases/${id}`),
          isAdmin ? api.get('/admin/officers') : Promise.resolve({ data: [] }),
        ]);
        setCaseData(caseRes.data);
        setOfficers(officerRes.data);
        setForm((f) => ({
          ...f,
          status: caseRes.data.status,
          assigned_officer_id: caseRes.data.assigned_officer_id || '',
          is_priority: caseRes.data.is_priority,
        }));
      } catch {
        toast.error('Failed to load case.');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]); // eslint-disable-line

  const change = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        status: form.status,
        note: form.note || undefined,
        public_message: form.public_message || undefined,
        is_priority: form.is_priority,
      };
      if (isAdmin && form.assigned_officer_id !== undefined) {
        payload.assigned_officer_id = form.assigned_officer_id || null;
      }
      const { data } = await api.put(`/cases/${id}`, payload);
      setCaseData(data);
      setForm((f) => ({ ...f, note: '', public_message: '' }));
      toast.success('Case updated successfully.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading case…" />;
  if (!caseData) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* Back */}
      <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors">
        <HiArrowLeft /> Back to Dashboard
      </button>

      {/* Case header */}
      <div className="card flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-gray-400 mb-1">{caseData.case_token}</p>
          <h1 className="text-xl font-bold text-gray-900">{VIOLENCE_LABELS[caseData.violence_type]}</h1>
          <p className="text-xs text-gray-400 mt-1">
            Submitted {format(new Date(caseData.created_at), 'dd MMM yyyy HH:mm')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {caseData.is_priority && (
            <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full font-semibold">
              <HiExclamation className="w-3.5 h-3.5" /> Priority
            </span>
          )}
          <StatusBadge status={caseData.status} size="lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: details + update form */}
        <div className="lg:col-span-2 space-y-5">

          {/* Description */}
          <div className="card space-y-3">
            <h2 className="font-semibold text-gray-800">Incident Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-400">Incident Date</p>
                <p className="font-medium">{format(new Date(caseData.incident_date), 'dd MMM yyyy')}</p>
              </div>
              {caseData.location && (
                <div>
                  <p className="text-xs text-gray-400">Location</p>
                  <p className="font-medium">{caseData.location}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-400">Assigned Officer</p>
                <p className="font-medium">{caseData.officer_name || 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Last Updated</p>
                <p className="font-medium">{format(new Date(caseData.updated_at), 'dd MMM yyyy')}</p>
              </div>
            </div>
            {caseData.description && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Description</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-3 leading-relaxed">{caseData.description}</p>
              </div>
            )}
          </div>

          {/* Update form */}
          <form onSubmit={save} className="card space-y-4">
            <h2 className="font-semibold text-gray-800">Update Case</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Status</label>
                <select name="status" value={form.status} onChange={change} className="input">
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              {isAdmin && (
                <div>
                  <label className="label">Assign Officer</label>
                  <select name="assigned_officer_id" value={form.assigned_officer_id} onChange={change} className="input">
                    <option value="">— Unassigned —</option>
                    {officers.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.full_name} ({o.assigned_cases} active)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="label">Public Message <span className="text-gray-400 font-normal">(shown to reporter)</span></label>
              <textarea
                name="public_message"
                value={form.public_message}
                onChange={change}
                rows={2}
                placeholder="Optional message visible to the anonymous reporter via their token…"
                className="input resize-none"
              />
            </div>

            <div>
              <label className="label">Internal Note <span className="text-gray-400 font-normal">(staff only)</span></label>
              <textarea
                name="note"
                value={form.note}
                onChange={change}
                rows={3}
                placeholder="Internal notes — not visible to the reporter…"
                className="input resize-none"
              />
            </div>

            {isAdmin && (
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" name="is_priority" checked={form.is_priority} onChange={change} className="w-4 h-4 rounded accent-red-500" />
                <span className="text-sm text-gray-700">Mark as Priority</span>
              </label>
            )}

            <button type="submit" disabled={saving} className="btn-primary">
              {saving
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
                : <><HiSave className="w-4 h-4" /> Save Changes</>
              }
            </button>
          </form>
        </div>

        {/* Right: timeline */}
        <div className="card space-y-4 h-fit">
          <h2 className="font-semibold text-gray-800">Case Timeline</h2>
          <Timeline updates={caseData.timeline || []} showNotes={true} />
        </div>
      </div>
    </div>
  );
}
