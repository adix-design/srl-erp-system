import axios from 'axios';

// Detect the base URL automatically. In dev Vite it will fallback to localhost:8000,
// and in production it will use the current host origin.
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  const origin = window.location.origin;
  // If Vite dev server is running on a different port (e.g. 5173), target the backend at port 8000
  if (origin.includes(':5173') || origin.includes(':5174') || origin.includes(':8080')) {
    return 'http://localhost:8000/api';
  }
  return `${origin}/api`;
};

const API = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor to attach the JWT token if it exists in local storage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('srl_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle expired tokens or authentication errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('srl_token');
      localStorage.removeItem('srl_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
