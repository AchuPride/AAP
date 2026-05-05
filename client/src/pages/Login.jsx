import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiShieldCheck, HiEye, HiEyeOff, HiLockClosed } from 'react-icons/hi';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast.error('Please enter username and password.');
      return;
    }
    setLoading(true);
    try {
      const u = await login(form.username, form.password);
      toast.success(`Welcome back, ${u.full_name}!`);
      navigate(u.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-sm space-y-6">

        {/* Logo */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
            <HiShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Login</h1>
          <p className="text-sm text-gray-500 mt-1">SafeReport Case Management</p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="card space-y-4">
          <div>
            <label className="label">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={change}
              autoComplete="username"
              placeholder="Enter your username"
              className="input"
            />
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={change}
                autoComplete="current-password"
                placeholder="Enter your password"
                className="input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPw ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading
              ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in…</>
              : <><HiLockClosed className="w-4 h-4" /> Sign In</>
            }
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          Anonymous reporters do not need to log in.{' '}
          <a href="/report" className="text-primary hover:underline">Submit a report here.</a>
        </p>
      </div>
    </div>
  );
}
