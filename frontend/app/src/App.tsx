import React from 'react';
import './App.css';
import SignUp from './components/signup';
import SignIn from './components/signin';
import { Provider } from 'react-redux'; // or the appropriate library/file
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import store  from './redux/store';
import { Navigate } from 'react-router-dom';

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('token'); // Verifica si existe un token

  return (
    <Provider store={store}>
      <Router>
        <Routes>
         
          <Route path="/" Component= { SignUp } />
          <Route path="/login" Component={SignIn} />
          <Route path= "/dashboard" element=<h1>Dashboard</h1> />
       

        
          <Route
            path="/protected"
            element={
              isAuthenticated ? (
                <ProtectedComponent /> // Componente protegido
              ) : (
                <Navigate to="/login" replace /> // Redirige al login
              )
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
};

const ProtectedComponent: React.FC = () => {
  return <div>Esta es una página protegida. ¡Bienvenido!</div>;
};

export default App;