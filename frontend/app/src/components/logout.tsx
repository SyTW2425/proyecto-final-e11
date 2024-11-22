import React from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/actions/tokenActions';
import { AppDispatch } from '../redux/store'; // Importa el tipo de dispatch
import styles from '../assets/styles/signup.module.css';
import { useNavigate } from 'react-router-dom';  // Importar el hook useNavigate




const LogoutButton: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); // Tipar correctamente useDispatch
  const navigate = useNavigate();
  
  

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login'); 
  };
  return (
    <div className={styles.backgroundContainer}>
      <div className={styles.signupContainer}>
        <h1>Connectory</h1>
        <div className={styles.signupBox}>
          <h2> LOGOUT </h2>
          <p className={styles.loginLink}><span onClick={handleLogout} className={styles.loginRedirect}>Cerrar Sesión</span></p>
        </div>
      </div>
    </div>
  );
 
};

export default LogoutButton;
