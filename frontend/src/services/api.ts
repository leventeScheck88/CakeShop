import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (!error.response) {
      return Promise.reject(new Error('NETWORK_ERROR'));
    }
    const message =
      error.response.data?.message ||
      'A apărut o eroare. Vă rugăm încercați din nou.';
    return Promise.reject(new Error(message));
  },
);

export default api;
