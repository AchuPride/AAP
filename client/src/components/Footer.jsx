import { HiShieldCheck, HiPhone } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-primary mb-2">
              <HiShieldCheck className="w-5 h-5" />
              SafeReport
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              A safe, anonymous platform for reporting and tracking gender-based violence cases.
              Your identity is never collected.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Emergency Contacts</h4>
            <ul className="space-y-1 text-xs text-gray-500">
              <li className="flex items-center gap-1"><HiPhone className="w-3 h-3" /> GBV Helpline: <strong>0800 428 428</strong></li>
              <li className="flex items-center gap-1"><HiPhone className="w-3 h-3" /> Police: <strong>10111</strong></li>
              <li className="flex items-center gap-1"><HiPhone className="w-3 h-3" /> Ambulance: <strong>10177</strong></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Your Privacy</h4>
            <ul className="space-y-1 text-xs text-gray-500">
              <li>✓ No name, email or phone collected</li>
              <li>✓ No IP addresses stored</li>
              <li>✓ Cases tracked by token only</li>
              <li>✓ All data encrypted at rest</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} SafeReport Platform. Built to protect survivors.
        </div>
      </div>
    </footer>
  );
}
