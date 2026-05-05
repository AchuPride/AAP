import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(() => localStorage.getItem('gbv_token'));
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async (jwt) => {
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
      const { data } = await api.get('/auth/me');
      setUser(data);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    if (token) {
      loadUser(token);
    } else {
      setLoading(false);
    }
  }, [token, loadUser]);

  const login = async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password });
    localStorage.setItem('gbv_token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('gbv_token');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  const isAdmin   = user?.role === 'admin';
  const isOfficer = user?.role === 'officer';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, isOfficer }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
