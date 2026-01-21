import React from 'react';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import { LocalHospital } from '@mui/icons-material';

const LoadingScreen = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          animation: 'float 3s ease-in-out infinite',
        }}
      >
        <LocalHospital sx={{ fontSize: 48 }} />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Hospital Management
        </Typography>
      </Box>
      
      <CircularProgress
        size={60}
        thickness={4}
        sx={{
          color: 'white',
          animation: 'pulse 2s ease-in-out infinite',
        }}
      />
      
      <Typography variant="body1" sx={{ opacity: 0.8 }}>
        Loading your secure dashboard...
      </Typography>
    </Box>
  );
};

export default LoadingScreen;