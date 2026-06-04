import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
  HiShieldCheck, HiDocumentReport, HiClipboardCopy,
  HiCheckCircle, HiEyeOff, HiUpload, HiLockClosed
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



const PLATFORMS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter_x', label: 'Twitter / X' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'offline', label: 'Offline / In-Person' },
  { value: 'other', label: 'Other Platform' },
];

export default function ReportIncident() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = form, 2 = success
  const [loading, setLoading] = useState(false);
  const [caseToken, setCaseToken] = useState('');
  const [copied, setCopied]     = useState(false);
  const [errors, setErrors]     = useState({});

  const [form, setForm] = useState({
    violence_type: '',
    platform_involved: '',
    description:   '',
    location:      '',
    incident_date: '',
    anonymous_toggle: true,
  });
  const [files, setFiles] = useState([]);
  const [detectingLoc, setDetectingLoc] = useState(false);

  const autoDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }
    
    setDetectingLoc(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`, {
            headers: {
              'Accept-Language': language === 'en' ? 'en' : 'fr'
            }
          });
          if (!res.ok) throw new Error('Geocoding failed');
          const data = await res.json();
          
          const addr = data.address || {};
          const cityPart = addr.city || addr.town || addr.village || addr.county || '';
          const neighborhoodPart = addr.suburb || addr.neighbourhood || addr.quarter || '';
          
          let formattedLoc = '';
          if (neighborhoodPart && cityPart) {
            formattedLoc = `${neighborhoodPart}, ${cityPart}`;
          } else if (cityPart) {
            formattedLoc = cityPart;
          } else if (data.display_name) {
            formattedLoc = data.display_name.split(',').slice(0, 2).map(s => s.trim()).join(', ');
          } else {
            formattedLoc = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          }

          setForm(prev => ({ ...prev, location: formattedLoc }));
          toast.success(language === 'en' ? 'Location detected successfully!' : 'Localisation détectée avec succès !');
        } catch (error) {
          console.error(error);
          setForm(prev => ({ ...prev, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
          toast.success(language === 'en' ? 'Coordinates detected.' : 'Coordonnées détectées.');
        } finally {
          setDetectingLoc(false);
        }
      },
      (error) => {
        setDetectingLoc(false);
        toast.error(language === 'en' ? 'Could not retrieve location. Please check your permissions.' : 'Impossible d\'obtenir la localisation. Veuillez vérifier vos permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const change = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
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
    if (!validateForm()) return;

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== undefined && v !== '') {
          fd.append(k, v);
        }
      });
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
      <div className="max-w-lg mx-auto py-8">
        <div className="card text-center space-y-6 dark:bg-gray-950 dark:border-gray-900 p-8 shadow-lg">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center mx-auto">
            <HiCheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {language === 'en' ? 'Report Submitted' : 'Signalement Soumis'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {language === 'en' 
                ? 'Your report has been received. Save your unique case token below — it is the only way to track your case.'
                : 'Votre signalement a été reçu. Enregistrez votre jeton de dossier unique ci-dessous — c\'est le seul moyen de suivre votre dossier.'}
            </p>
          </div>

          <div className="bg-primary/5 dark:bg-indigo-950/30 border-2 border-primary/20 dark:border-indigo-900/30 rounded-2xl p-5">
            <p className="text-xs font-semibold text-primary dark:text-indigo-400 uppercase tracking-widest mb-2">Your Case Token</p>
            <p className="text-2xl font-mono font-bold text-gray-900 dark:text-white tracking-wider break-all">{caseToken}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={copyToken} className="btn-primary py-2.5 rounded-xl text-sm justify-center">
              {copied ? <HiCheckCircle className="w-4 h-4" /> : <HiClipboardCopy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Token'}
            </button>
            <button onClick={() => navigate('/track', { state: { token: caseToken } })} className="btn-outline py-2.5 rounded-xl text-sm justify-center">
              {t('navTrack')}
            </button>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-xl p-4 text-left">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">⚠ {language === 'en' ? 'Important Notice' : 'Avis Important'}</p>
            <ul className="text-xs text-amber-700 dark:text-amber-400/80 space-y-1 list-disc list-inside">
              <li>{language === 'en' ? 'Store your token somewhere safe (screenshot, notes app).' : 'Conservez votre jeton dans un endroit sûr (capture d\'écran, application de notes).'}</li>
              <li>{language === 'en' ? 'We do not store your identity — if you lose the token, we cannot link you to this case.' : 'Nous ne stockons pas votre identité — si vous perdez le jeton, nous ne pourrons pas vous associer à ce dossier.'}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left Form Column */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-indigo-950/30 flex items-center justify-center shrink-0">
            <HiDocumentReport className="w-6 h-6 text-primary dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">{t('reportTitle')}</h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
              <HiEyeOff className="w-4 h-4 text-gray-400" /> {t('reportSubtitle')}
            </p>
          </div>
        </div>

        {/* Privacy badge */}
        <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-250/20 dark:border-emerald-900/30 rounded-xl px-4 py-3">
          <HiShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
            {language === 'en' 
              ? 'This system is cryptographically secure. No tracking headers or personal identifiers are stored.' 
              : 'Ce système est cryptographiquement sécurisé. Aucun en-tête de suivi ou identifiant personnel n\'est stocké.'}
          </p>
        </div>

        {/* Form container */}
        <form onSubmit={submit} className="card space-y-6 dark:bg-gray-950 dark:border-gray-900 p-6 sm:p-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Violence type */}
            <div>
              <label className="label">{t('labelViolenceType')} <span className="text-red-400">*</span></label>
              <select name="violence_type" value={form.violence_type} onChange={change} className="input dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100">
                <option value="">{language === 'en' ? 'Select type...' : 'Sélectionner le type...'}</option>
                {VIOLENCE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              {errors.violence_type && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.violence_type}</p>}
            </div>

            {/* Date */}
            <div>
              <label className="label">{t('labelIncidentDate')} <span className="text-red-400">*</span></label>
              <input
                type="date"
                name="incident_date"
                value={form.incident_date}
                onChange={change}
                max={new Date().toISOString().split('T')[0]}
                className="input dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100"
              />
              {errors.incident_date && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.incident_date}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Platform involved */}
            <div>
              <label className="label">{t('labelPlatform')}</label>
              <select name="platform_involved" value={form.platform_involved} onChange={change} className="input dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100">
                <option value="">{language === 'en' ? 'Select platform...' : 'Sélectionner la plateforme...'}</option>
                {PLATFORMS.map((plat) => (
                  <option key={plat.value} value={plat.value}>{plat.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label">{t('labelDescription')} <span className="text-red-400">*</span></label>
            <textarea
              name="description"
              value={form.description}
              onChange={change}
              rows={5}
              placeholder={language === 'en' ? 'Describe the incident in detail...' : 'Décrivez l\'incident en détail...'}
              className="input resize-none dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100"
            />
            <div className="flex justify-between mt-1">
              {errors.description
                ? <p className="text-xs text-red-500 dark:text-red-400">{errors.description}</p>
                : <p className="text-xs text-gray-400 dark:text-gray-500">{t('descMinChars')}</p>}
              <p className="text-xs text-gray-400 dark:text-gray-500">{form.description.length}/5000</p>
            </div>
          </div>

          {/* Location */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="label mb-0">{t('labelLocation')}</label>
              <button
                type="button"
                onClick={autoDetectLocation}
                disabled={detectingLoc}
                className="text-xs font-semibold text-primary dark:text-indigo-400 hover:underline flex items-center gap-1 focus:outline-none disabled:opacity-50"
              >
                {detectingLoc ? (
                  <>
                    <span className="w-3 h-3 border border-primary dark:border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    {language === 'en' ? 'Detecting...' : 'Détection...'}
                  </>
                ) : (
                  <>
                    <span>📍</span>
                    {language === 'en' ? 'Auto-detect location' : 'Détecter automatiquement'}
                  </>
                )}
              </button>
            </div>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={change}
              placeholder={t('placeholderLocation')}
              className="input dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{t('descLocationHelper')}</p>
          </div>

          {/* Evidence Upload */}
          <div>
            <label className="label">
              {t('labelEvidence')}
            </label>
            <label className="flex flex-col items-center gap-2 border-2 border-dashed border-gray-200 dark:border-gray-850 rounded-xl p-6 cursor-pointer hover:border-primary/45 dark:hover:border-indigo-500/40 transition-colors">
              <HiUpload className="w-8 h-8 text-gray-300 dark:text-gray-700" />
              <span className="text-xs sm:text-sm text-gray-550 dark:text-gray-400">{language === 'en' ? 'Click to select files' : 'Cliquez pour sélectionner les fichiers'}</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">{t('descEvidenceHelper')}</span>
              <input
                type="file"
                multiple
                accept="image/*,application/pdf,video/mp4,audio/mp3,audio/wav"
                className="hidden"
                onChange={(e) => setFiles(Array.from(e.target.files).slice(0, 5))}
              />
            </label>
            {files.length > 0 && (
              <ul className="mt-3 space-y-1 bg-gray-50 dark:bg-gray-900/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-900">
                {files.map((f, i) => (
                  <li key={i} className="text-xs text-gray-650 dark:text-gray-400 flex items-center gap-2">
                    <HiCheckCircle className="w-3.5 h-3.5 text-emerald-500" /> {f.name} ({(f.size / 1024).toFixed(1)} KB)
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Anonymous Toggle */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              name="anonymous_toggle"
              id="anonymous_toggle"
              checked={form.anonymous_toggle}
              onChange={change}
              className="w-4 h-4 rounded text-primary border-gray-300 dark:border-gray-800 dark:bg-gray-900 focus:ring-primary"
            />
            <label htmlFor="anonymous_toggle" className="text-xs font-semibold text-gray-600 dark:text-gray-400 cursor-pointer">
              {t('anonToggleLabel')}
            </label>
          </div>

          {errors._general && (
            <p className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/20 rounded-xl px-4 py-2">{errors._general}</p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 rounded-xl text-sm sm:text-base justify-center shadow-lg shadow-primary/10">
            {loading ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> {t('submitting')}</>
            ) : (
              <><HiLockClosed className="w-5 h-5 shrink-0" /> {t('btnSubmitReport')}</>
            )}
          </button>
        </form>
      </div>

      {/* Right Sidebar Info Column */}
      <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-250/20 dark:border-gray-850">
          <img
            src="/images/img4.jpg"
            alt="End the Silence"
            className="w-full aspect-[4/3] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent flex items-end p-6">
            <h3 className="text-white font-extrabold text-lg leading-snug">
              {language === 'en' ? 'Breaking the Silence on Online Gender-Based Violence' : 'Briser le silence sur la violence basée sur le genre en ligne'}
            </h3>
          </div>
        </div>

        <div className="card space-y-4 dark:bg-gray-950 dark:border-gray-900 p-6">
          <h3 className="font-extrabold text-sm uppercase tracking-wider text-gray-400 dark:text-gray-500">
            {language === 'en' ? 'How Safe is SafeReport?' : 'Quelle est la sécurité de SafeReport?'}
          </h3>
          <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-3">
            <li className="flex gap-2">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span><strong>{language === 'en' ? 'No Access Logs:' : 'Aucun log d\'accès:'}</strong> {language === 'en' ? 'IP addresses and session identifiers are discarded immediately.' : 'Les adresses IP et identifiants de session sont supprimés immédiatement.'}</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span><strong>{language === 'en' ? 'EXIF Strip:' : 'Nettoyage EXIF:'}</strong> {language === 'en' ? 'Uploaded screenshots automatically have geolocation and device metadata removed.' : 'Les captures d\'écran ont leurs métadonnées géographiques et d\'appareil supprimées.'}</span>
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500 font-bold shrink-0">✓</span>
              <span><strong>{language === 'en' ? 'Safe Storage:' : 'Stockage sécurisé:'}</strong> {language === 'en' ? 'Files are encrypted using AES-256 standard and stored in a private container.' : 'Les fichiers sont chiffrés selon la norme AES-256 et stockés dans un conteneur privé.'}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
