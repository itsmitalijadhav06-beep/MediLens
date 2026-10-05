import axios from 'axios';

// Base URL will be configured during integration phase
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('medilens_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('medilens_token');
      localStorage.removeItem('medilens_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default client;
