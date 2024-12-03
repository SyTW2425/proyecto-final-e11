import React from 'react';
import styles from '../assets/styles/template.module.css';
import LogoutButton from './logout';

import { useNavigate, Link } from 'react-router-dom';  // Importar el hook useNavigate

// Recogemos el nombre de usuario de la sesión
const user = JSON.parse(localStorage.getItem('user') || '{}'); // Parsear el objeto JSON
const username = user.nombre_usuario; // Extraer el nombre de usuario

const Template: React.FC = () => {
  const navigate = useNavigate();

  const goToClientes = () => {
    navigate('/cliente');
  }
  const goToProveedores = () => {
    navigate('/proveedor');
  }
  const goToInventario = () => {
    navigate('/inventario');
  }
  const goToVentas = () => {
    navigate('/venta');
  }
  const goToCompras = () => {
    navigate('/compra');
  }
  const goToCalendario = () => {
    navigate('/calendario');
  }
  return (
    <div className={styles.container}>
      {/* Menú lateral */}
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>Connectory</h2>
        <ul className={styles.menu}>
          <li onClick={goToClientes} className={styles.menuItem}>Clientes</li>
          <li onClick={goToProveedores} className={styles.menuItem}>Proveedores</li>
          <li onClick={goToVentas} className={styles.menuItem}>Ventas</li>
          <li onClick={goToCompras} className={styles.menuItem}>Compras</li>
          <li onClick={goToInventario} className={styles.menuItem}>Productos</li>
          <li onClick={goToCalendario} className={styles.menuItem}>Calendario</li>
        </ul>
        <div className={styles.logoutButtonContainer}>
          <LogoutButton />
        </div>
      </aside>

      {/* Contenido principal */}
      <main className={styles.main}>
        {/* Barra de navegación superior */}
        <nav className={styles.navbar}>
          <div className={styles.navContent}>
            <span className={styles.title}>Inicio</span>
            <Link to="/template" className={styles.navButton}>
              <img
                src="home.png"
                alt="Template"
                className={styles.navImage}
              />
            </Link>
          </div>
        </nav>
            
            {/* Contenido de la página */}
            <div className={styles.content}>
            <h1>Bienvenido, <span className={styles.username}>{username}</span></h1>
            <p>Aquí tienes un resumen de las actividades pendientes del almacén.</p>
            </div>
      </main>
    </div>
  );
};


export default Template;
