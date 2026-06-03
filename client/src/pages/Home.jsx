import { Link } from 'react-router-dom';
import {
  HiShieldCheck, HiLockClosed, HiEyeOff, HiDocumentReport,
  HiSearch, HiArrowRight, HiPhone,
} from 'react-icons/hi';

const features = [
  {
    icon: <HiEyeOff className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />,
    title: 'Completely Anonymous',
    desc: 'We never collect your name, phone, email, or IP address. Your identity remains completely private.',
  },
  {
    icon: <HiLockClosed className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />,
    title: 'Secure & Encrypted',
    desc: 'All submitted data is encrypted. Track progress using a private random case token.',
  },
  {
    icon: <HiDocumentReport className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />,
    title: 'Trauma-Informed Form',
    desc: 'A simple, stress-free report form designed to minimize cognitive load and take under 3 minutes.',
  },
  {
    icon: <HiSearch className="w-7 h-7 text-amber-600 dark:text-amber-400" />,
    title: 'Track Case Status',
    desc: 'Query your private case token at any time to view status timeline updates from officers.',
  },
];

export default function Home() {
  return (
    <div className="space-y-20">

      {/* Hero Section */}
      <section className="relative text-center py-16 px-4 max-w-4xl mx-auto space-y-6">
        <div className="absolute inset-0 -z-10 flex items-center justify-center filter blur-3xl opacity-20">
          <div className="w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-primary to-calm" />
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 rounded-full text-indigo-700 dark:text-indigo-300 text-xs font-semibold tracking-wide shadow-sm mb-2 hover:scale-105 transition-transform duration-300">
          <HiShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Safe · Anonymous · Confidential
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
          Report Gender-Based Violence <br />
          <span className="bg-gradient-to-r from-primary via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
            Safely & Anonymously
          </span>
        </h1>
        
        <p className="text-base md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          No account registration is required. Protect your identity, report an incident, and receive a private cryptographic token to track your case at any time.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link to="/report" className="btn-primary text-base px-8 py-3.5 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200">
            <HiDocumentReport className="w-5 h-5" />
            Report an Incident
          </Link>
          <Link to="/track" className="btn-outline text-base px-8 py-3.5 rounded-2xl border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 hover:-translate-y-0.5 transition-all duration-200">
            <HiSearch className="w-5 h-5 text-gray-400" />
            Track My Case
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">Why SafeReport?</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">Built from the ground up to protect user privacy and empower case resolution.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card group flex flex-col gap-4 p-6 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-950 transition-all duration-300 dark:bg-gray-950 dark:border-gray-900">
              <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </div>
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works (Visual Steps) */}
      <section className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-100 dark:border-gray-900 p-8 md:p-12 shadow-card space-y-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 text-center">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {[
            { step: '01', title: 'Submit Incident Report', desc: 'Fill out general details of the incident. You remain fully anonymous.' },
            { step: '02', title: 'Save Private Token', desc: 'Retrieve your unique token. This is the only link to access your case file.' },
            { step: '03', title: 'Track Case Actions', desc: 'Enter the token anytime to check updates and messages from assigned officers.' },
          ].map((s, index) => (
            <div key={s.step} className="flex flex-col items-center text-center gap-4 relative group">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-primary dark:text-indigo-400 flex items-center justify-center text-xl font-extrabold shadow-sm group-hover:bg-primary group-hover:text-white dark:group-hover:bg-primary dark:group-hover:text-white transition-all duration-300">
                {s.step}
              </div>
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">{s.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 px-4 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency Helpline Banner (Cameroon Localized) */}
      <section className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center shrink-0">
            <HiPhone className="w-6 h-6 text-red-600 dark:text-red-400 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-red-800 dark:text-red-400 text-lg">In immediate danger or need urgent help?</h3>
            <p className="text-sm text-red-700/80 dark:text-red-300/80 leading-relaxed max-w-2xl">
              Call the Toll-Free Gender-Based Violence Hotline at <strong className="text-red-900 dark:text-red-300 font-mono">1523</strong>, Gendarmerie at <strong className="text-red-900 dark:text-red-300 font-mono">113</strong>, or Police at <strong className="text-red-900 dark:text-red-300 font-mono">117</strong> immediately.
            </p>
          </div>
        </div>
        <a href="tel:1523" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 dark:bg-red-700 text-white font-semibold rounded-2xl shadow-md hover:bg-red-700 dark:hover:bg-red-600 hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0">
          <HiPhone className="w-5 h-5" /> Call Hotline (1523)
        </a>
      </section>

      {/* Bottom CTA */}
      <section className="text-center py-4">
        <Link to="/report" className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:underline group">
          Start anonymous report now
          <HiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

    </div>
  );
}
