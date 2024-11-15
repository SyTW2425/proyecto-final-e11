import axios from 'axios';

// Función auxiliar para configurar axios
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;