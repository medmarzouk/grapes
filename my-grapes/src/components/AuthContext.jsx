// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/Api_utils';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const response = await api.get('/user/');
      setUser(response.data);
    } catch (error) {
      logout();
    }
  };

  const login = (tokens) => {
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
    fetchUser();
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      fetchUser();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);