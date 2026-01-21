import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('🛡️ ProtectedRoute Update:', {
      loading,
      isAuthenticated,
      userEmail: user?.email,
      currentPath: location.pathname,
      localStorageToken: localStorage.getItem('token') ? '✅' : '❌',
      localStorageUser: localStorage.getItem('user') ? '✅' : '❌'
    });
  }, [loading, isAuthenticated, user, location.pathname]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f5f5f5',
          gap: 3
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="body1" color="text.secondary">
          Verifying authentication...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    console.log('🔒 Access denied - not authenticated');
    console.log('📤 Redirecting to login page');
    
    // Force a small delay and redirect
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('✅ Access granted - user authenticated');
  return children;
};

export default ProtectedRoute;