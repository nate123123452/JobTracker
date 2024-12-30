import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000',
});

// Add a request interceptor to include the access token in headers
api.interceptors.request.use(
  async (config) => {
    // Get the access token from local storage
    let token = localStorage.getItem('access_token');
    if (token) {
      // Decode the token to get its expiry time
      const tokenParts = JSON.parse(atob(token.split('.')[1]));
      const now = Math.ceil(Date.now() / 1000);
      // Check if the token is expired
      if (tokenParts.exp < now) {
        try {
          // If the token is expired, request a new one using the refresh token
          const response = await axios.post('http://localhost:8000/api/token/refresh/', {
            refresh: localStorage.getItem('refresh_token'),
          });
          // Save the new tokens in local storage
          localStorage.setItem('access_token', response.data.access);
          token = response.data.access;
        } catch (error) {
          // If an error occurs, remove the tokens from local storage
          console.error('Error refreshing token:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      // Set the Authorization header with the access token
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

export default api;