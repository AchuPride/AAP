import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiShieldCheck, HiMenu, HiX, HiLogout, HiUser, HiSun, HiMoon } from 'react-icons/hi';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
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
    `text-sm font-semibold transition-colors ${isActive ? 'text-primary dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-indigo-400'}`;

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-100 dark:border-gray-900 shadow-sm transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-primary dark:text-indigo-400 text-lg hover:scale-105 transition-transform">
          <HiShieldCheck className="w-7 h-7" />
          SafeReport
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/"       className={navLink} end>Home</NavLink>
          <NavLink to="/report" className={navLink}>Report</NavLink>
          <NavLink to="/track"  className={navLink}>Track Case</NavLink>
          {user && <NavLink to="/dashboard" className={navLink}>Dashboard</NavLink>}
          {isAdmin && <NavLink to="/admin" className={navLink}>Admin</NavLink>}
        </nav>

        {/* Desktop right */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <HiSun className="w-5 h-5 text-amber-500 animate-spin-slow" /> : <HiMoon className="w-5 h-5 text-indigo-600" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <HiUser className="w-4 h-4" /> {user.full_name}
                <span className="ml-1 badge bg-primary/10 text-primary dark:bg-indigo-950/40 dark:text-indigo-400 capitalize">{user.role}</span>
              </span>
              <button onClick={handleLogout} className="btn-outline text-xs py-1.5 px-3">
                <HiLogout className="w-4 h-4" /> Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-xs py-2 px-4 shadow-md shadow-primary/10">Staff Login</Link>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <HiSun className="w-5 h-5 text-amber-500" /> : <HiMoon className="w-5 h-5 text-indigo-600" />}
          </button>
          
          <button className="p-2 text-gray-600 dark:text-gray-300" onClick={() => setOpen(!open)}>
            {open ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-900 bg-white dark:bg-gray-950 px-4 py-4 flex flex-col gap-4 shadow-inner">
          <NavLink to="/"       className={navLink} end onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/report" className={navLink}    onClick={() => setOpen(false)}>Report</NavLink>
          <NavLink to="/track"  className={navLink}    onClick={() => setOpen(false)}>Track Case</NavLink>
          {user && <NavLink to="/dashboard" className={navLink} onClick={() => setOpen(false)}>Dashboard</NavLink>}
          {isAdmin && <NavLink to="/admin" className={navLink} onClick={() => setOpen(false)}>Admin</NavLink>}
          {user ? (
            <button onClick={handleLogout} className="btn-danger w-full mt-2 text-xs">
              <HiLogout /> Sign Out
            </button>
          ) : (
            <Link to="/login" className="btn-primary w-full text-center text-sm" onClick={() => setOpen(false)}>
              Staff Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
