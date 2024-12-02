import React from 'react';
import styles from '../assets/styles/template.module.css';
import LogoutButton from './logout';

import { useNavigate } from 'react-router-dom';  // Importar el hook useNavigate



const Template: React.FC = () => {
    const navigate = useNavigate();
    const goToClientes = () => {
        navigate('/clientesUsuario');  
    };
  return (
    <div className={styles.container}>
      {/* Menú lateral */}
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>Connectory</h2>
        <ul className={styles.menu}>
          <li onClick={goToClientes} className={styles.menuItem}>Clientes</li>
          <li className={styles.menuItem}>Proveedores</li>
          <li className={styles.menuItem}>Ventas</li>
          <li className={styles.menuItem}>Compras</li>
          <li className={styles.menuItem}>Productos</li>
          <li className={styles.menuItem}>Calendario</li>
        </ul>
      </aside>

      {/* Contenido principal */}
      <main className={styles.main}>
        {/* Barra de navegación superior */}
        <nav className={styles.navbar}>
          <div className={styles.navContent}>
            <span className={styles.title}>Bienvenido</span>
            <div className={styles.logoutButtonContainer}>
              <LogoutButton />
            </div>
          </div>
        </nav>
            
            {/* Contenido de la página */}
            <div className={styles.content}>
              <h1>Dashboard</h1>
              <p>Bienvenido al panel de control de Connectory</p>
            </div>
      </main>
    </div>
  );
};


export default Template;
