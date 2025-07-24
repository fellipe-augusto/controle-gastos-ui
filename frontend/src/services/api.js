import axios from 'axios';

// A URL base agora virá de uma variável de ambiente VITE_API_BASE_URL
// Se a variável não existir (em desenvolvimento local), ele usa a URL do localhost.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

export default api;