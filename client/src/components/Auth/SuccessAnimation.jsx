import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const SuccessAnimation = ({ message = "Login Successful!" }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        zIndex: 9999,
        opacity: show ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          transform: show ? 'scale(1)' : 'scale(0.8)',
          transition: 'transform 0.5s ease',
        }}
      >
        <CheckCircleIcon
          sx={{
            fontSize: 80,
            color: '#4CAF50',
            animation: 'scaleIn 0.5s ease-out',
            '@keyframes scaleIn': {
              '0%': { transform: 'scale(0)' },
              '50%': { transform: 'scale(1.2)' },
              '100%': { transform: 'scale(1)' },
            },
          }}
        />
        <Typography
          variant="h5"
          sx={{
            mt: 2,
            fontWeight: 600,
            color: '#333',
            animation: 'fadeInUp 0.5s ease-out 0.2s both',
            '@keyframes fadeInUp': {
              '0%': { opacity: 0, transform: 'translateY(20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          {message}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mt: 1,
            color: '#666',
            animation: 'fadeInUp 0.5s ease-out 0.4s both',
          }}
        >
          Redirecting to dashboard...
        </Typography>
      </Box>
    </Box>
  );
};

export default SuccessAnimation;