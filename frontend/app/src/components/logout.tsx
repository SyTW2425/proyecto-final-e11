import React from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/actions/tokenActions';
import { AppDispatch } from '../redux/store'; // Importa el tipo de dispatch
import styles from '../assets/styles/signup.module.css';
import { useNavigate } from 'react-router-dom';  // Importar el hook useNavigate

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser()); 
    navigate('/login'); 
  };

  return (
    <button onClick={handleLogout} className={styles.logoutButton}>
      Cerrar Sesión
    </button>
  );
};

 export default LogoutButton;
