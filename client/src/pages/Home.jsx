import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  HiShieldCheck, HiLockClosed, HiEyeOff, HiDocumentReport,
  HiSearch, HiArrowRight, HiPhone, HiUserGroup, HiLibrary, HiChatAlt2
} from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function Home() {
  const { t, language } = useLanguage();
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    under_review: 0,
    investigating: 0,
  });
  const [partners, setPartners] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingPartners, setLoadingPartners] = useState(true);

  useEffect(() => {
    // Fetch statistics
    fetch('/api/report/stats')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
      })
      .then(data => {
        setStats(data);
        setLoadingStats(false);
      })
      .catch(err => {
        console.error(err);
        // Set mock/fallback values for demonstration
        setStats({ total: 0, resolved: 0, under_review: 0, investigating: 0 });
        setLoadingStats(false);
      });

    // Fetch partners
    fetch('/api/partners')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch partners');
        return res.json();
      })
      .then(data => {
        setPartners(data);
        setLoadingPartners(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingPartners(false);
      });
  }, []);

  return (
    <div className="space-y-20 pb-12">
      {/* Hero Section */}
      <section className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-8 md:py-16 px-4 max-w-6xl mx-auto">
        <div className="absolute inset-0 -z-10 flex items-center justify-center filter blur-3xl opacity-20 pointer-events-none">
          <div className="w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-primary to-indigo-500" />
        </div>

        {/* Hero Left Content */}
        <div className="space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30 rounded-full text-emerald-700 dark:text-emerald-400 text-xs font-semibold tracking-wide shadow-sm hover:scale-[1.02] transition-transform duration-300">
            <HiShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            {t('heroSubtitle')}
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
            {language === 'en' ? (
              <>
                Report Gender-Based Violence <br />
                <span className="bg-gradient-to-r from-primary via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                  Safely & Anonymously
                </span>
              </>
            ) : (
              <>
                Signalez la violence basée sur le genre <br />
                <span className="bg-gradient-to-r from-primary via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                  En toute sécurité et anonymat
                </span>
              </>
            )}
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
            {t('heroDesc')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link to="/report" className="btn-primary text-sm px-6 py-3 rounded-xl shadow-md shadow-primary/20 hover:shadow-primary/35 hover:-translate-y-0.5 transition-all duration-200 justify-center">
              <HiDocumentReport className="w-5 h-5 shrink-0" />
              {t('btnReportNow')}
            </Link>
            <Link to="/track" className="btn-outline text-sm px-6 py-3 rounded-xl border-gray-250 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 hover:-translate-y-0.5 transition-all duration-200 justify-center">
              <HiSearch className="w-5 h-5 text-gray-400 shrink-0" />
              {t('btnTrack')}
            </Link>
          </div>
        </div>

        {/* Hero Right Image */}
        <div className="relative flex justify-center">
          <div className="absolute -inset-1.5 bg-gradient-to-tr from-primary to-indigo-500 rounded-3xl blur-md opacity-25" />
          <div className="relative aspect-[4/3] w-full max-w-lg bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-200/50 dark:border-gray-800/50">
            <img
              src="/images/img1.jpg"
              alt="STOP GBV Protest"
              className="w-full h-full object-cover object-center transform hover:scale-[1.03] transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* Impact/Stats Dashboard Section */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-gray-100">{t('statsSectionTitle')}</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-450 max-w-md mx-auto">{t('statsSectionDesc')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="card text-center p-6 bg-white dark:bg-gray-950 dark:border-gray-900 shadow-sm flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-indigo-400 flex items-center justify-center mb-1">
              <HiDocumentReport className="w-5 h-5" />
            </div>
            <span className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white font-mono">
              {loadingStats ? '...' : stats.total}
            </span>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t('statReports')}</span>
          </div>

          <div className="card text-center p-6 bg-white dark:bg-gray-950 dark:border-gray-900 shadow-sm flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1">
              <HiShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-2xl md:text-3xl font-black text-emerald-650 dark:text-emerald-405 font-mono">
              {loadingStats ? '...' : stats.resolved}
            </span>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t('statAssisted')}</span>
          </div>

          <div className="card text-center p-6 bg-white dark:bg-gray-950 dark:border-gray-900 shadow-sm flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1">
              <HiUserGroup className="w-5 h-5" />
            </div>
            <span className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white font-mono">
              {loadingPartners ? '...' : partners.length}
            </span>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t('statPartners')}</span>
          </div>

          <div className="card text-center p-6 bg-white dark:bg-gray-950 dark:border-gray-900 shadow-sm flex flex-col items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-150 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-1">
              <HiLibrary className="w-5 h-5" />
            </div>
            <span className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white font-mono">0</span>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{t('statResources')}</span>
          </div>
        </div>
      </section>

      {/* How It Works (Visual Steps) */}
      <section className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-900 p-8 md:p-12 shadow-sm max-w-6xl mx-auto space-y-10">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-gray-100 text-center">{t('howTitle')}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {[
            { step: '01', title: t('howStep1Title'), desc: t('howStep1Desc') },
            { step: '02', title: t('howStep2Title'), desc: t('howStep2Desc') },
            { step: '03', title: t('howStep3Title'), desc: t('howStep3Desc') },
            { step: '04', title: t('howStep4Title'), desc: t('howStep4Desc') },
          ].map((s) => (
            <div key={s.step} className="flex flex-col items-center text-center gap-3 relative group">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-primary dark:text-indigo-400 flex items-center justify-center text-base font-extrabold shadow-sm group-hover:bg-primary group-hover:text-white dark:group-hover:bg-primary dark:group-hover:text-white transition-all duration-300">
                {s.step}
              </div>
              <h3 className="font-bold text-base text-gray-800 dark:text-gray-200">{s.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 px-2 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Trust Us Section */}
      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Why Trust Us Left Info */}
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-850 dark:text-gray-100">{t('trustTitle')}</h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-450">{t('trustDesc')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-650 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <HiEyeOff className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">{t('trust1Title')}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{t('trust1Desc')}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <HiLockClosed className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">{t('trust2Title')}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{t('trust2Desc')}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-50 dark:bg-cyan-950/40 text-cyan-650 dark:text-cyan-400 flex items-center justify-center shrink-0">
                <HiUserGroup className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">{t('trust3Title')}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{t('trust3Desc')}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-650 dark:text-amber-400 flex items-center justify-center shrink-0">
                <HiShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">{t('trust4Title')}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{t('trust4Desc')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Trust Us Right Image (img3.jpg) */}
        <div className="relative flex justify-center">
          <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500 to-primary rounded-3xl blur opacity-20" />
          <div className="relative aspect-[4/3] w-full max-w-lg bg-gray-150 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg border border-gray-200/50 dark:border-gray-800/50">
            <img
              src="/images/img3.jpg"
              alt="Together Let us End Gender Based Violence"
              className="w-full h-full object-cover object-center transform hover:scale-[1.03] transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* Partners Showcase Section */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-extrabold text-gray-850 dark:text-gray-100">
            {language === 'en' ? 'Our Vetted Support Network' : 'Notre Réseau de Soutien Agréé'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-450 max-w-md mx-auto">
            {language === 'en' 
              ? 'We work closely with these organizations to provide legal support, temporary shelter, and mental healthcare.' 
              : 'Nous travaillons en étroite collaboration avec ces organisations pour offrir un soutien juridique, des abris temporaires et des soins mentaux.'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
          {partners.length > 0 ? (
            partners.map((p) => (
              <a
                key={p.id}
                href={p.website_url || '#'}
                target="_blank"
                rel="noreferrer"
                className="card p-6 flex flex-col items-center justify-between text-center gap-3 hover:-translate-y-1 hover:shadow-md transition-all duration-300 dark:bg-gray-950 dark:border-gray-900"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                  {p.name.charAt(0)}
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-250 leading-tight">{p.name}</h4>
                  <span className="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-900 text-gray-550 dark:text-gray-400 text-[10px] font-bold rounded capitalize">
                    {p.category.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2">{p.description}</p>
              </a>
            ))
          ) : (
            // Static Placeholders if none seeded
            ['MINPROFF Cameroon', 'ACAFEJ Legal Aid', 'Hope for Vulnerable', 'Digital Rights CM'].map((name, i) => (
              <div key={i} className="card p-5 text-center flex flex-col items-center justify-center gap-2 dark:bg-gray-950 dark:border-gray-900">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-900 text-gray-400 flex items-center justify-center font-bold">
                  {name[0]}
                </div>
                <h4 className="text-xs font-bold text-gray-750 dark:text-gray-300">{name}</h4>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Emergency Helpline Banner (Cameroon Localized) */}
      <section className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm max-w-6xl mx-auto">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
            <HiPhone className="w-6 h-6 text-red-600 dark:text-red-400 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-red-800 dark:text-red-400 text-lg">{t('emergencyTitle')}</h3>
            <p className="text-sm text-red-700/80 dark:text-red-300/80 leading-relaxed max-w-2xl">
              {t('emergencyDesc')}
            </p>
          </div>
        </div>
        <a href="tel:1523" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-650 dark:bg-red-700 text-white font-semibold rounded-xl shadow-md hover:bg-red-700 dark:hover:bg-red-650 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0">
          <HiPhone className="w-5 h-5" /> {t('emergencyCallBtn')}
        </a>
      </section>

      {/* Bottom CTA */}
      <section className="text-center py-4">
        <Link to="/report" className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline group">
          {language === 'en' ? 'Start anonymous report now' : 'Démarrer un signalement anonyme maintenant'}
          <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>
    </div>
  );
}
