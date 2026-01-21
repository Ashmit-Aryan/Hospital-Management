import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check auth on mount
  useEffect(() => {
    console.log('🔍 Checking auth on component mount...');
    
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    console.log('📦 Stored data - Token:', token ? '✅ Present' : '❌ Missing');
    console.log('📦 Stored data - User:', userStr ? '✅ Present' : '❌ Missing');
    
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        
        // IMPORTANT: Set axios header BEFORE anything else
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        console.log('✅ Restoring session for:', userData.email);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('❌ Error restoring session:', error);
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    console.log('🔐 Login attempt for:', email);
    
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      console.log('✅ Login API successful');
      console.log('📨 Response data:', response.data);
      
      // Extract token - adjust field name as per your backend
      const sessionToken = response.data.sessionToken || 
                          response.data.token || 
                          response.data.access_token;
      
      if (!sessionToken) {
        console.error('❌ No token in response:', response.data);
        return { success: false, error: 'No authentication token received' };
      }

      console.log('🔑 Token received:', sessionToken.substring(0, 20) + '...');
      
      // Create user object
      const userObj = {
        email,
        id: Date.now().toString(),
        role: email.includes('admin') ? 'admin' : 'user',
        name: email.split('@')[0],
      };

      // CRITICAL: Save to localStorage
      localStorage.setItem('token', sessionToken);
      localStorage.setItem('user', JSON.stringify(userObj));
      
      console.log('💾 Saved to localStorage - Token:', !!sessionToken);
      console.log('💾 Saved to localStorage - User:', userObj);
      
      // Set axios header
      api.defaults.headers.common['Authorization'] = `Bearer ${sessionToken}`;
      
      // Update state
      setUser(userObj);
      setIsAuthenticated(true);
      
      console.log('✅ Auth state updated successfully');
      
      return { success: true, user: userObj };
      
    } catch (error) {
      console.error('❌ Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    console.log('👋 Manual logout');
    localStorage.clear();
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};