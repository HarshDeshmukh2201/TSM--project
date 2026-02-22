import { useState } from 'react';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Divider,
  useTheme,
  alpha,
  Fade,
  Zoom,
  Paper,
  Link,
  Alert,
  Grid
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';

export default function SignupPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    agreeTerms: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'agreeTerms' ? checked : value
    });
    
    setError('');
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    
    if (!formData.email) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Email is invalid');
      return false;
    }
    
    if (!formData.password) {
      setError('Password is required');
      return false;
    } else if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    if (!formData.agreeTerms) {
      setError('You must agree to the terms and conditions');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        await signup(formData.username, formData.email, formData.password);
        navigate('/login');
      } catch (err) {
        setError(err.message || 'Failed to create account. Please try again.');
        setIsLoading(false);
      }
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(45deg, #1a1a1a 0%, #2c2c2c 100%)'
          : 'linear-gradient(45deg, #f5f7fa 0%, #e4e8f0 100%)',
        padding: 2
      }}
    >
      <Helmet>
        <title>Sign Up | Task Manager</title>
      </Helmet>
      
      <Fade in={true} timeout={1000}>
        <Card
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 1000,
            borderRadius: 4,
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            background: theme.palette.background.paper
          }}
        >
          <Box
            sx={{
              flex: { xs: '0 0 100%', md: '0 0 50%' },
              background: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
              color: 'white',
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 4,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -100,
                left: -100,
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)'
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -80,
                right: -80,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)'
              }}
            />
            
            <Zoom in={true} style={{ transitionDelay: '300ms' }}>
              <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'primary.main',
                    fontWeight: 'bold',
                    fontSize: '2rem',
                    mb: 3,
                    mx: 'auto'
                  }}
                >
                  TM
                </Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Task Manager
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.8, mb: 4, maxWidth: 400 }}>
                  Join thousands of users who organize their tasks and boost productivity with our platform.
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'white'
                    }}
                  />
                  <Paper
                    elevation={0}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255,255,255,0.5)'
                    }}
                  />
                  <Paper
                    elevation={0}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255,255,255,0.5)'
                    }}
                  />
                </Box>
                
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  © 2023 Task Manager. All rights reserved.
                </Typography>
              </Box>
            </Zoom>
          </Box>
          
          <Box
            sx={{
              flex: { xs: '0 0 100%', md: '0 0 50%' },
              padding: { xs: 3, sm: 5 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Zoom in={true} style={{ transitionDelay: '500ms' }}>
              <Box>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Create an Account
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                  Get started with your free account
                </Typography>
                
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3, 
                      borderRadius: 2,
                      '& .MuiAlert-icon': {
                        alignItems: 'center'
                      }
                    }}
                  >
                    {error}
                  </Alert>
                )}
                
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2 }
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2 }
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleTogglePassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 2 }
                    }}
                  />
                  
                  <Box sx={{ mt: 2 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="agreeTerms"
                          checked={formData.agreeTerms}
                          onChange={handleChange}
                          color="primary"
                        />
                      }
                      label={
                        <Typography variant="body2">
                          I agree to the{' '}
                          <Link href="#" underline="hover" color="primary">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link href="#" underline="hover" color="primary">
                            Privacy Policy
                          </Link>
                        </Typography>
                      }
                    />
                  </Box>
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    sx={{
                      mt: 3,
                      mb: 3,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        boxShadow: '0 6px 20px 0 rgba(0,0,0,0.15)',
                      }
                    }}
                  >
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                    {isLoading && (
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: 3,
                          bgcolor: alpha(theme.palette.common.white, 0.3),
                          animation: 'pulse 1.5s infinite',
                          '@keyframes pulse': {
                            '0%': { opacity: 0.6 },
                            '50%': { opacity: 1 },
                            '100%': { opacity: 0.6 }
                          }
                        }}
                      />
                    )}
                  </Button>
                </form>
                
                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    OR
                  </Typography>
                </Divider>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <IconButton
                    sx={{
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      color: theme.palette.error.main,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.error.main, 0.2),
                      }
                    }}
                  >
                    <GoogleIcon />
                  </IconButton>
                  
                  <IconButton
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                      }
                    }}
                  >
                    <FacebookIcon />
                  </IconButton>
                  
                  <IconButton
                    sx={{
                      bgcolor: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.main,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.info.main, 0.2),
                      }
                    }}
                  >
                    <TwitterIcon />
                  </IconButton>
                </Box>
                
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Link component={RouterLink} to="/login" underline="hover" fontWeight="bold" color="primary">
                      Sign In
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Zoom>
          </Box>
        </Card>
      </Fade>
    </Box>
  );
}