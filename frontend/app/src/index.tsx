// src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Componente principal de la aplicación
import './index.css'; // Estilos globales, si los tienes

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App /> {/* Renderiza el componente raíz */}
  </React.StrictMode>
);