import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import api from '../services/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('odp_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const persistSession = useCallback((authUser, token) => {
    if (token) {
      localStorage.setItem('odp_token', token);
    }
    if (authUser) {
      localStorage.setItem('odp_user', JSON.stringify(authUser));
    }
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem('odp_token');
    localStorage.removeItem('odp_user');
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', credentials);
      persistSession(data.user, data.token);
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`);
      return data.user;
    } finally {
      setLoading(false);
    }
  }, [persistSession]);

  const register = useCallback(async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', payload);
      persistSession(data.user, data.token);
      setUser(data.user);
      toast.success('Account created successfully');
      return data.user;
    } finally {
      setLoading(false);
    }
  }, [persistSession]);

  const onboardUser = useCallback(async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post('/admin/users', payload);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    toast.success('Signed out');
  }, [clearSession]);

  const refreshProfile = useCallback(async () => {
    const token = localStorage.getItem('odp_token');
    if (!token) {
      setReady(true);
      return;
    }

    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
      persistSession(data, token);
    } catch (error) {
      console.error('Failed to refresh profile', error);
      clearSession();
      setUser(null);
    } finally {
      setReady(true);
    }
  }, [clearSession, persistSession]);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const value = useMemo(
    () => ({
      user,
      loading,
      ready,
      isAuthenticated: Boolean(user),
      login,
      register,
      onboardUser,
      logout,
      refreshProfile
    }),
    [loading, login, logout, onboardUser, ready, refreshProfile, register, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
