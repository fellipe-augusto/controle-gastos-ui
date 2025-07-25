import axios from 'axios';

// A URL base agora virá de uma variável de ambiente VITE_API_BASE_URL
// Se a variável não existir (em desenvolvimento local), ele usa a URL do localhost.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// ===================================================================
// LINHA DE DEBUG: Isto vai nos mostrar a URL no console do navegador
console.log("A API está configurada para usar a seguinte URL:", apiUrl);
// ===================================================================

export default api;
