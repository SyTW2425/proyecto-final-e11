import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import store from './redux/store';
import SignUp from './components/signup';
import SignIn from './components/signin';
import Template from './components/template';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" Component={SignUp} />
          <Route path="/login" Component={SignIn} />

          {/* Rutas protegidas */}
          <Route path="/dashboard" element={<ProtectedRoute component={<Dashboard />} />} />
          <Route path="/template" element={<ProtectedRoute component={<Template />} />} />
        
        


          {/* Ruta de ejemplo protegida */}
          <Route
            path="/protected"
            element={<ProtectedRoute component={<ProtectedComponent />} />}
          />
        </Routes>
      </Router>
    </Provider>
  );
};

const ProtectedRoute: React.FC<{ component: React.ReactElement }> = ({ component }) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Verifica el token

  return isAuthenticated ? component : <Navigate to="/login" replace />;
};

const Dashboard: React.FC = () => {
  return <h1>Dashboard</h1>;
};

const ProtectedComponent: React.FC = () => {
  return <div>Esta es una página protegida. ¡Bienvenido!</div>;
};

export default App;
