import { HiShieldCheck, HiPhone } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 mt-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-primary dark:text-indigo-400 mb-2">
              <HiShieldCheck className="w-5 h-5" />
              SafeReport
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              A safe, anonymous platform for reporting and tracking gender-based violence cases.
              Your identity is never collected.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Emergency Contacts</h4>
            <ul className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
              <li className="flex items-center gap-1"><HiPhone className="w-3.5 h-3.5 text-red-500" /> GBV Toll-Free: <strong>1523</strong></li>
              <li className="flex items-center gap-1"><HiPhone className="w-3.5 h-3.5 text-indigo-500" /> Police: <strong>117</strong></li>
              <li className="flex items-center gap-1"><HiPhone className="w-3.5 h-3.5 text-indigo-500" /> Gendarmerie: <strong>113</strong></li>
              <li className="flex items-center gap-1"><HiPhone className="w-3.5 h-3.5 text-indigo-500" /> Ambulance: <strong>119</strong></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Your Privacy</h4>
            <ul className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
              <li>✓ No name, email, or phone collected</li>
              <li>✓ No IP addresses stored</li>
              <li>✓ Cases tracked by token only</li>
              <li>✓ All data encrypted at rest</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-900 text-center text-xs text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} SafeReport Platform. Built to protect survivors.
        </div>
      </div>
    </footer>
  );
}
