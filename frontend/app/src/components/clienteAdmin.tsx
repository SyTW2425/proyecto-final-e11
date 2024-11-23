import React from 'react';
import styles from '../assets/styles/template.module.css';
import LogoutButton from './logout';

const ClienteAdmin: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Menú lateral */}
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>Connectory</h2>
        <ul className={styles.menu}>
          <li className={styles.menuItem}>Clientes</li>
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
            <span className={styles.title}>Clientes</span>
            <div className={styles.logoutButtonContainer}>
              <LogoutButton />
            </div>
          </div>
        </nav>
            
            {/* Contenido de la página */}
            <div className={styles.content}>
              <h1>Página de clientes pa administradores</h1>
              <p>Bienvenido</p>
            </div>
      </main>
    </div>
  );
};

export default ClienteAdmin;
