import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const AuthContext = createContext();

// Use the deployed API URL when set, otherwise fall back to localhost.
const API_URL =
  import.meta.env.VITE_API_URL ||
  (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_API_URL : '') ||
  (typeof process !== 'undefined' ? process.env.VITE_API_URL : '') ||
  'http://localhost:5000';

axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;

const setupAxiosInterceptors = (token) => {
  axios.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.token) {
          setupAxiosInterceptors(userData.token);
        }
        return userData;
      }
      return null;
    } catch (err) {
      console.error('Invalid user in localStorage', err);
      localStorage.removeItem('user');
      return null;
    }
  });

  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      
      if (data.token) {
        setupAxiosInterceptors(data.token);
      }
      
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      navigate('/dashboard');
    } catch (err) {
      throw err.response?.data?.message || 'Login failed';
    }
  };

  const signup = async (username, email, password) => {
    try {
      const { data } = await axios.post('/api/auth/signup', { username, email, password });
      
      if (data.token) {
        setupAxiosInterceptors(data.token);
      }
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      navigate('/dashboard');
    } catch (err) {
      throw err.response?.data?.message || 'Signup failed';
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('user');
      
      setUser(null);
      
      navigate('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);