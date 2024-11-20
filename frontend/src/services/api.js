import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('access_token');
    if (token) {
      const tokenParts = JSON.parse(atob(token.split('.')[1]));
      const now = Math.ceil(Date.now() / 1000);
      if (tokenParts.exp < now) {
        try {
          const response = await axios.post('http://localhost:8000/api/token/refresh/', {
            refresh: localStorage.getItem('refresh_token'),
          });
          localStorage.setItem('access_token', response.data.access);
          token = response.data.access;
        } catch (error) {
          console.error('Error refreshing token:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          // Redirect to login page or show login modal
        }
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;