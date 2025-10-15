import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('authToken');
    if (token) {
      // Validate token with API
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      // Simulate API call to validate token
      setLoading(true);
      // const response = await authAPI.validateToken(token);
      // setUser(response.data.user);
      setLoading(false);
    } catch (error) {
      localStorage.removeItem('authToken');
      setUser(null);
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // Simulate login validation
      if (!credentials.email || !credentials.password) {
        setLoading(false);
        return { success: false, error: 'Email and password are required' };
      }
      
      // For demo, accept any credentials
      const mockUser = { 
        id: 1, 
        email: credentials.email, 
        role: 'admin',
        name: 'Admin User'
      };
      localStorage.setItem('authToken', 'mock-token');
      setUser(mockUser);
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    logout
  };
};

