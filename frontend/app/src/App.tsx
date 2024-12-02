import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import store from './redux/store';
import SignUp from './components/signup';
import SignIn from './components/signin';
import Template from './components/template';
import ClienteUsuario from './components/clienteUsuario';
import ClienteAdmin from './components/clienteAdmin';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" Component={SignUp} />
          <Route path="/login" Component={SignIn} />

          {/* Rutas protegidas */}
          <Route path="/template" element={<ProtectedRoute component={<Template />} adminComponent={<Template/>} />} />
          <Route path="/clientesUsuario" element={<ProtectedRoute component={<ClienteUsuario />} adminComponent={<ClienteAdmin />} />} />
        </Routes>
      </Router>
    </Provider>
  );
};

const ProtectedRoute: React.FC<{ component: React.ReactElement; adminComponent: React.ReactElement }> = ({ component, adminComponent }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const rol_ = (localStorage.getItem('rol') || '').replace(/^"|"$/g, '').trim();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }
  
  if (rol_ === "administrador") {
    return adminComponent;
  }

  return component;
};

export default App;
