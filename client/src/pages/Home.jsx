import { Link } from 'react-router-dom';
import {
  HiShieldCheck, HiLockClosed, HiEyeOff, HiDocumentReport,
  HiSearch, HiArrowRight, HiPhone,
} from 'react-icons/hi';

const features = [
  {
    icon: <HiEyeOff   className="w-7 h-7 text-primary" />,
    title: 'Completely Anonymous',
    desc:  'We never collect your name, phone, email or IP address. Your identity stays private.',
  },
  {
    icon: <HiLockClosed className="w-7 h-7 text-safe" />,
    title: 'Secure & Encrypted',
    desc:  'All data is encrypted. Cases are tracked using a unique token only you receive.',
  },
  {
    icon: <HiDocumentReport className="w-7 h-7 text-calm" />,
    title: 'Easy to Report',
    desc:  'A simple, trauma-informed form. No account needed. Takes under 3 minutes.',
  },
  {
    icon: <HiSearch className="w-7 h-7 text-warm" />,
    title: 'Track Your Case',
    desc:  'Use your private case token anytime to check status and see timeline updates.',
  },
];

export default function Home() {
  return (
    <div className="space-y-16">

      {/* Hero */}
      <section className="text-center py-12 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full text-primary text-xs font-semibold mb-6">
          <HiShieldCheck className="w-4 h-4" />
          Safe · Anonymous · Confidential
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 max-w-3xl mx-auto leading-tight mb-4">
          Report Gender-Based Violence <span className="text-primary">Safely & Anonymously</span>
        </h1>
        <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto mb-8 leading-relaxed">
          You don't need to give your name. No login required.
          Report an incident and receive a private token to track your case at any time.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/report" className="btn-primary text-base px-8 py-3 rounded-2xl shadow-lg shadow-primary/20">
            <HiDocumentReport className="w-5 h-5" />
            Report an Incident
          </Link>
          <Link to="/track" className="btn-outline text-base px-8 py-3 rounded-2xl">
            <HiSearch className="w-5 h-5" />
            Track My Case
          </Link>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-xl font-bold text-center text-gray-800 mb-8">Why SafeReport?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div key={f.title} className="card flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="font-semibold text-gray-800">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white rounded-3xl border border-gray-100 p-8 shadow-card">
        <h2 className="text-xl font-bold text-gray-800 mb-8 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Submit Report', desc: 'Fill in the incident details. No personal information required.' },
            { step: '2', title: 'Get Your Token', desc: 'Receive a unique case token. Save it — it is your only link to your case.' },
            { step: '3', title: 'Track Progress', desc: 'Enter your token anytime to see case status and updates from our team.' },
          ].map((s) => (
            <div key={s.step} className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-primary/20">
                {s.step}
              </div>
              <h3 className="font-semibold text-gray-800">{s.title}</h3>
              <p className="text-sm text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Emergency banner */}
      <section className="bg-red-50 border border-red-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4">
        <HiPhone className="w-10 h-10 text-red-500 shrink-0" />
        <div>
          <h3 className="font-bold text-red-700 text-lg">In immediate danger?</h3>
          <p className="text-sm text-red-600">
            Call <strong>10111</strong> (Police) or <strong>0800 428 428</strong> (GBV Helpline) immediately.
            This platform is for reporting — not emergency response.
          </p>
        </div>
        <a href="tel:0800428428" className="btn-danger shrink-0 ml-auto">
          <HiPhone /> Call Helpline
        </a>
      </section>

      {/* CTA */}
      <section className="text-center">
        <Link to="/report" className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:underline">
          Ready to report? Start here <HiArrowRight />
        </Link>
      </section>

    </div>
  );
}
