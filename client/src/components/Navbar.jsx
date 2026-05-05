import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiShieldCheck, HiMenu, HiX, HiLogout, HiUser } from 'react-icons/hi';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  const navLink = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'}`;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-primary text-lg">
          <HiShieldCheck className="w-6 h-6" />
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
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <HiUser className="w-4 h-4" /> {user.full_name}
                <span className="ml-1 badge bg-primary/10 text-primary capitalize">{user.role}</span>
              </span>
              <button onClick={handleLogout} className="btn-outline text-xs py-1.5 px-3">
                <HiLogout className="w-4 h-4" /> Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-xs py-2 px-4">Staff Login</Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 text-gray-600" onClick={() => setOpen(!open)}>
          {open ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4">
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
