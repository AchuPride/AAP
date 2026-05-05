import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import {
  HiShieldCheck, HiDocumentReport, HiClipboardCopy,
  HiCheckCircle, HiEyeOff, HiUpload,
} from 'react-icons/hi';

const VIOLENCE_TYPES = [
  { value: 'physical',          label: 'Physical Violence' },
  { value: 'sexual',            label: 'Sexual Violence' },
  { value: 'psychological',     label: 'Psychological / Emotional Abuse' },
  { value: 'economic',          label: 'Economic Abuse' },
  { value: 'stalking',          label: 'Stalking / Harassment' },
  { value: 'online_harassment', label: 'Online Harassment / Cyberbullying' },
  { value: 'other',             label: 'Other' },
];

export default function ReportIncident() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = form, 2 = success
  const [loading, setLoading] = useState(false);
  const [caseToken, setCaseToken] = useState('');
  const [copied, setCopied]     = useState(false);
  const [errors, setErrors]     = useState({});

  const [form, setForm] = useState({
    violence_type: '',
    description:   '',
    location:      '',
    incident_date: '',
  });
  const [files, setFiles] = useState([]);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.violence_type) errs.violence_type = 'Please select an incident type.';
    if (!form.description || form.description.length < 20)
      errs.description = 'Please provide at least 20 characters.';
    if (!form.incident_date) errs.incident_date = 'Please enter the incident date.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      files.forEach((f) => fd.append('evidence', f));

      const { data } = await api.post('/report', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setCaseToken(data.case_token);
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Submission failed. Please try again.';
      const errs = err.response?.data?.errors;
      if (errs) {
        toast.error('Please fix the errors below.');
        setErrors({ _general: errs.join(' ') });
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(caseToken);
    setCopied(true);
    toast.success('Token copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  if (step === 2) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="card text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto">
            <HiCheckCircle className="w-10 h-10 text-safe" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted</h1>
            <p className="text-sm text-gray-500">
              Your report has been received. Save your unique case token below — it is the only way to track your case.
            </p>
          </div>

          <div className="bg-primary/5 border-2 border-primary/20 rounded-2xl p-5">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Your Case Token</p>
            <p className="text-2xl font-mono font-bold text-gray-900 tracking-wider break-all">{caseToken}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={copyToken} className="btn-primary">
              {copied ? <HiCheckCircle className="w-4 h-4" /> : <HiClipboardCopy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Token'}
            </button>
            <button onClick={() => navigate('/track', { state: { token: caseToken } })} className="btn-outline">
              Track Case
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-left">
            <p className="text-xs font-semibold text-amber-700 mb-1">⚠ Important</p>
            <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
              <li>Store your token somewhere safe (screenshot, notes app).</li>
              <li>We do not store your identity — if you lose the token, we cannot link you to this case.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <HiDocumentReport className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report an Incident</h1>
          <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1">
            <HiEyeOff className="w-4 h-4" /> Your identity will never be collected or stored.
          </p>
        </div>
      </div>

      {/* Privacy notice */}
      <div className="flex items-center gap-3 bg-safe/5 border border-safe/20 rounded-xl px-4 py-3">
        <HiShieldCheck className="w-5 h-5 text-safe shrink-0" />
        <p className="text-xs text-safe-DEFAULT leading-relaxed">
          This form collects <strong>no personal information</strong>. After submission you'll receive a unique token to track your case.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={submit} className="card space-y-5">

        {/* Type of violence */}
        <div>
          <label className="label">Type of Incident <span className="text-red-400">*</span></label>
          <select name="violence_type" value={form.violence_type} onChange={change} className="input">
            <option value="">Select incident type…</option>
            {VIOLENCE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          {errors.violence_type && <p className="text-xs text-red-500 mt-1">{errors.violence_type}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="label">Describe what happened <span className="text-red-400">*</span></label>
          <textarea
            name="description"
            value={form.description}
            onChange={change}
            rows={5}
            placeholder="Describe the incident in your own words. Do not include names or identifying details if you wish to remain fully anonymous."
            className="input resize-none"
          />
          <div className="flex justify-between mt-1">
            {errors.description
              ? <p className="text-xs text-red-500">{errors.description}</p>
              : <p className="text-xs text-gray-400">Minimum 20 characters</p>}
            <p className="text-xs text-gray-400">{form.description.length}/5000</p>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="label">General Location <span className="text-gray-400 font-normal">(optional)</span></label>
          <input
            type="text"
            name="location"
            value={form.location}
            onChange={change}
            placeholder="e.g. Johannesburg CBD, Cape Town, Durban North…"
            className="input"
          />
          <p className="text-xs text-gray-400 mt-1">General area only — do not enter your home address.</p>
        </div>

        {/* Date */}
        <div>
          <label className="label">Date of Incident <span className="text-red-400">*</span></label>
          <input
            type="date"
            name="incident_date"
            value={form.incident_date}
            onChange={change}
            max={new Date().toISOString().split('T')[0]}
            className="input"
          />
          {errors.incident_date && <p className="text-xs text-red-500 mt-1">{errors.incident_date}</p>}
        </div>

        {/* Evidence upload */}
        <div>
          <label className="label">
            Evidence <span className="text-gray-400 font-normal">(optional — photos, documents, video)</span>
          </label>
          <label className="flex flex-col items-center gap-2 border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-primary/40 transition-colors">
            <HiUpload className="w-8 h-8 text-gray-300" />
            <span className="text-sm text-gray-500">Click to upload files</span>
            <span className="text-xs text-gray-400">JPG, PNG, PDF, MP4 · Max 10 MB each · Up to 5 files</span>
            <input
              type="file"
              multiple
              accept="image/*,application/pdf,video/mp4"
              className="hidden"
              onChange={(e) => setFiles(Array.from(e.target.files).slice(0, 5))}
            />
          </label>
          {files.length > 0 && (
            <ul className="mt-2 space-y-1">
              {files.map((f, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-center gap-2">
                  <HiCheckCircle className="w-3 h-3 text-safe" /> {f.name} ({(f.size / 1024).toFixed(1)} KB)
                </li>
              ))}
            </ul>
          )}
        </div>

        {errors._general && (
          <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2">{errors._general}</p>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full py-3 rounded-xl text-base">
          {loading ? (
            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting…</>
          ) : (
            <><HiShieldCheck className="w-5 h-5" /> Submit Report Anonymously</>
          )}
        </button>
      </form>
    </div>
  );
}
