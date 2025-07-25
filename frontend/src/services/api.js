import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// ===================================================================
// LINHA DE DEBUG: Isto vai nos mostrar a URL no console do navegador
console.log("A API está configurada para usar a seguinte URL:", apiUrl);
// ===================================================================

const api = axios.create({
  baseURL: apiUrl,
});

export default api;
