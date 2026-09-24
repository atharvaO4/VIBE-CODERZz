// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, googleLogin as apiGoogleLogin, getMe, updateProfile as apiUpdateProfile } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate user on app load
  useEffect(() => {
    const token = localStorage.getItem('clarix_token');
    if (token) {
      getMe()
        .then(res => setUser(res.data.user))
        .catch(()  => localStorage.removeItem('clarix_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await apiLogin({ email, password });
    localStorage.setItem('clarix_token', res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (data) => {
    const res = await apiRegister(data);
    localStorage.setItem('clarix_token', res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const googleLogin = async (credential) => {
    const res = await apiGoogleLogin(credential);
    localStorage.setItem('clarix_token', res.data.token);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('clarix_token');
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await apiUpdateProfile(data);
    const updated = res.data.user;
    // Normalize id field so it matches login/getMe shape
    if (updated && !updated.id && updated._id) updated.id = updated._id;
    setUser(prev => ({ ...prev, ...updated }));
    return updated;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
