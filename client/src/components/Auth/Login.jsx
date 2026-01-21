import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Fade,
  InputAdornment,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
  EmailOutlined,
  LocalHospital,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // Check if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      console.log('⚠️ Already authenticated, redirecting...');
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
    setFadeIn(true);
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log('📝 Login form submitted');

    try {
      const result = await login(email, password);
      
      if (result.success) {
        console.log('✅ Login successful in handleSubmit');
        toast.success('Welcome! Redirecting...', {
          duration: 2000,
          position: 'top-center',
        });
        
        // The AuthContext will update isAuthenticated, which will trigger the useEffect above
      } else {
        setError(result.error || 'Login failed');
        toast.error('Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setTimeout(() => {
      document.querySelector('form')?.requestSubmit();
    }, 100);
  };

  // Direct test function
  const testDirectNavigation = () => {
    console.log('🧪 Testing direct navigation...');
    localStorage.setItem('token', 'test-token-' + Date.now());
    localStorage.setItem('user', JSON.stringify({
      email: 'admin@example.com',
      role: 'admin',
      id: '1'
    }));
    window.location.href = '/dashboard';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        px: 2,
      }}
    >
      <Fade in={fadeIn} timeout={800}>
        <Container maxWidth="sm">
          <Paper
            elevation={24}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              p: 4,
              backgroundColor: 'white',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}
          >
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <LocalHospital
                sx={{
                  fontSize: 48,
                  color: theme.palette.primary.main,
                  mb: 2,
                }}
              />
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                Hospital Management System
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to continue
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined color="action" />
                    </InputAdornment>
                  ),
                }}
                placeholder="admin@example.com"
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                placeholder="••••••••"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading || !email || !password}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  mb: 2,
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Demo Accounts
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                size="medium"
                onClick={() => handleDemoLogin('admin@example.com', 'password123')}
                disabled={loading}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  py: 1.5,
                }}
              >
                Admin Account (admin@example.com)
              </Button>
            </Box>

            {/* Debug Section */}
            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #eee' }}>
              <Button
                fullWidth
                variant="text"
                size="small"
                onClick={testDirectNavigation}
                sx={{ textTransform: 'none' }}
              >
                Test Direct Navigation (Debug)
              </Button>
            </Box>
          </Paper>
        </Container>
      </Fade>
    </Box>
  );
};

export default Login;