import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// Refresh token function
const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem('refresh_token');
    if (!refresh) throw new Error('No refresh token available');

    const response = await axios.post('http://localhost:8000/api/token/refresh/', {
      refresh,
    });

    const newAccessToken = response.data.access;
    localStorage.setItem('access_token', newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login'; // Redirect to login page
    return null;
  }
};

// Request interceptor to add access token
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('access_token');
    
    if (token) {
      const tokenParts = JSON.parse(atob(token.split('.')[1]));
      const now = Math.ceil(Date.now() / 1000);

      if (tokenParts.exp < now) {
        token = await refreshToken(); // Get a new token if expired
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthorized errors (401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      const originalRequest = error.config;
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        const newToken = await refreshToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
