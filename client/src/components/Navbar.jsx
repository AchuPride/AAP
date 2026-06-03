import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { HiShieldCheck, HiMenu, HiX, HiLogout, HiUser, HiSun, HiMoon, HiGlobeAlt } from 'react-icons/hi';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  const navLink = ({ isActive }) =>
    `text-xs lg:text-sm font-semibold transition-colors duration-200 ${isActive ? 'text-primary dark:text-indigo-400' : 'text-gray-650 dark:text-gray-300 hover:text-primary dark:hover:text-indigo-400'}`;

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-100 dark:border-gray-900 shadow-sm transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 font-bold text-primary dark:text-indigo-400 text-base lg:text-lg hover:scale-105 transition-transform shrink-0">
          <HiShieldCheck className="w-6 h-6 lg:w-7 h-7" />
          SafeReport
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-4">
          <NavLink to="/"       className={navLink} end>{t('navHome')}</NavLink>
          <NavLink to="/report" className={navLink}>{t('navReport')}</NavLink>
          <NavLink to="/track"  className={navLink}>{t('navTrack')}</NavLink>
          <NavLink to="/news"   className={navLink}>{t('navNews')}</NavLink>
          <NavLink to="/safety-tips" className={navLink}>{t('navSafety')}</NavLink>
          <NavLink to="/resources"   className={navLink}>{t('navResources')}</NavLink>
          <NavLink to="/stories"     className={navLink}>{t('navStories')}</NavLink>
          <NavLink to="/donate"      className={navLink}>{t('navDonate')}</NavLink>
          {user && <NavLink to="/dashboard" className={navLink}>{t('navDashboard')}</NavLink>}
          {isAdmin && <NavLink to="/admin" className={navLink}>{t('navAdmin')}</NavLink>}
        </nav>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0">
          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-2 py-1 transition-colors">
            <HiGlobeAlt className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-xs bg-transparent border-none text-gray-600 dark:text-gray-300 focus:outline-none cursor-pointer font-semibold"
              aria-label="Select Language"
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-150 dark:hover:bg-gray-900 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <HiSun className="w-4 h-4 lg:w-5 h-5 text-amber-500 animate-spin-slow" /> : <HiMoon className="w-4 h-4 lg:w-5 h-5 text-indigo-600" />}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 max-w-[120px] truncate">
                <HiUser className="w-3.5 h-3.5 shrink-0" /> {user.full_name.split(' ')[0]}
              </span>
              <button onClick={handleLogout} className="btn-outline text-[10px] lg:text-xs py-1.5 px-2.5">
                <HiLogout className="w-3.5 h-3.5" /> {t('signOut')}
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-[10px] lg:text-xs py-2 px-3 shadow-sm">{t('staffLogin')}</Link>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-1.5">
          {/* Mobile Language Switcher */}
          <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-900 border border-gray-250 dark:border-gray-800 rounded-lg px-1.5 py-0.5">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-[10px] bg-transparent border-none text-gray-600 dark:text-gray-350 focus:outline-none font-bold"
              aria-label="Select Language"
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
            </select>
          </div>

          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <HiSun className="w-4.5 h-4.5 text-amber-500" /> : <HiMoon className="w-4.5 h-4.5 text-indigo-600" />}
          </button>
          
          <button className="p-1.5 text-gray-600 dark:text-gray-300" onClick={() => setOpen(!open)} aria-label="Toggle Menu">
            {open ? <HiX className="w-5.5 h-5.5" /> : <HiMenu className="w-5.5 h-5.5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950 px-4 py-4 flex flex-col gap-3 shadow-inner max-h-[calc(100vh-4rem)] overflow-y-auto">
          <NavLink to="/"       className={navLink} end onClick={() => setOpen(false)}>{t('navHome')}</NavLink>
          <NavLink to="/report" className={navLink}    onClick={() => setOpen(false)}>{t('navReport')}</NavLink>
          <NavLink to="/track"  className={navLink}    onClick={() => setOpen(false)}>{t('navTrack')}</NavLink>
          <NavLink to="/news"   className={navLink}    onClick={() => setOpen(false)}>{t('navNews')}</NavLink>
          <NavLink to="/safety-tips" className={navLink}    onClick={() => setOpen(false)}>{t('navSafety')}</NavLink>
          <NavLink to="/resources"   className={navLink}    onClick={() => setOpen(false)}>{t('navResources')}</NavLink>
          <NavLink to="/stories"     className={navLink}    onClick={() => setOpen(false)}>{t('navStories')}</NavLink>
          <NavLink to="/donate"      className={navLink}    onClick={() => setOpen(false)}>{t('navDonate')}</NavLink>
          {user && <NavLink to="/dashboard" className={navLink} onClick={() => setOpen(false)}>{t('navDashboard')}</NavLink>}
          {isAdmin && <NavLink to="/admin" className={navLink} onClick={() => setOpen(false)}>{t('navAdmin')}</NavLink>}
          {user ? (
            <button onClick={handleLogout} className="btn-danger w-full mt-2 text-xs py-2">
              <HiLogout className="w-4 h-4" /> {t('signOut')}
            </button>
          ) : (
            <Link to="/login" className="btn-primary w-full text-center text-sm py-2" onClick={() => setOpen(false)}>
              {t('staffLogin')}
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
