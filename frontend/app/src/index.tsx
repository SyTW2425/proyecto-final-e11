// src/index.tsx

// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux'; // Importamos el Provider de react-redux
import store  from './redux/store'; // Importamos el store que configuraste
import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}> {/* Aquí envolvemos la aplicación con el Provider */}
      <App />
    </Provider>
  </React.StrictMode>
);
