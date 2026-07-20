import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {

      const errorMessage = error.response.data?.error || error.message;
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {

      return Promise.reject(new Error('No se pudo conectar con el servidor'));
    } else {

      return Promise.reject(new Error(error.message));
    }
  }
);

export default api;