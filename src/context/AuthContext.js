import React, { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [users, setUsers] = useLocalStorage('medncare_users', []);
  const [auth, setAuth] = useLocalStorage('medncare_auth', null);

  const signup = (email, password) => {
    email = String(email || '').trim();
    password = String(password || '');
    if (!email || !password) throw new Error('Email and password are required.');
    if (users.some(u => String(u.email || '').toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }
    setUsers([...users, { email, password }]);
    setAuth({ email, at: Date.now() });
  };

  const login = (email, password) => {
    email = String(email || '').trim();
    password = String(password || '');
    const match = users.find(u => 
      String(u.email || '').toLowerCase() === email.toLowerCase() && 
      String(u.password || '') === password
    );
    if (!match) throw new Error('Invalid email or password.');
    setAuth({ email: match.email, at: Date.now() });
  };

  const logout = () => {
    setAuth(null);
  };

  const isAuthenticated = () => !!auth;

  return (
    <AuthContext.Provider value={{ signup, login, logout, isAuthenticated, auth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

