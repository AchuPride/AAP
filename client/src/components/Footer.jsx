import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { HiShieldCheck, HiPhone } from 'react-icons/hi';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-900 mt-16 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-primary dark:text-indigo-400 text-lg mb-3">
              <HiShieldCheck className="w-6 h-6" />
              SafeReport
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-405 leading-relaxed">
              An anonymous, safe, and confidential digital ecosystem built to protect and empower survivors of Online Gender-Based Violence (OGBV) in Cameroon and across Africa.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
              <li>
                <Link to="/report" className="hover:text-primary dark:hover:text-indigo-400 transition-colors">{t('navReport')}</Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-primary dark:hover:text-indigo-400 transition-colors">{t('navTrack')}</Link>
              </li>
              <li>
                <Link to="/stories" className="hover:text-primary dark:hover:text-indigo-400 transition-colors">{t('navStories')}</Link>
              </li>
              <li>
                <Link to="/donate" className="hover:text-primary dark:hover:text-indigo-400 transition-colors">{t('navDonate')}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Resources</h4>
            <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
              <li>
                <Link to="/safety-tips" className="hover:text-primary dark:hover:text-indigo-400 transition-colors">{t('navSafety')}</Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-primary dark:hover:text-indigo-400 transition-colors">{t('navResources')}</Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-primary dark:hover:text-indigo-400 transition-colors">{t('navNews')}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Emergency Contacts</h4>
            <ul className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
              <li className="flex items-center gap-1">
                <HiPhone className="w-3.5 h-3.5 text-red-500" />
                GBV Toll-Free: <strong>1523</strong> (Cameroon)
              </li>
              <li className="flex items-center gap-1">
                <HiPhone className="w-3.5 h-3.5 text-indigo-500" />
                Police: <strong>117</strong>
              </li>
              <li className="flex items-center gap-1">
                <HiPhone className="w-3.5 h-3.5 text-indigo-500" />
                Gendarmerie: <strong>113</strong>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-900 text-center text-xs text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} SafeReport. All rights reserved. Built to protect, support, and restore survivors.
        </div>
      </div>
    </footer>
  );
}
