import React, { useEffect, useState } from 'react';
import styles from '../assets/styles/template.module.css';
import LogoutButton from './logout';
import Statistics from './Statistics';
import Summary from './Summary';
import Table from './Table';

import { useNavigate, Link } from 'react-router-dom';  // Importar el hook useNavigate

const Template: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null); // Estado para el nombre de usuario
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener el nombre de usuario del localStorage al cargar el componente
    const usuario_almacenado = localStorage.getItem('user');
    const storedUser = usuario_almacenado ? JSON.parse(usuario_almacenado) : null;
    if (storedUser) {
      const user = storedUser; // Parsear el JSON
      setUsername(user.nombre_usuario); // Actualizar el estado
    }
  }, []); // Solo se ejecuta al cargar el componente

  const goToClientes = () => {
    navigate('/cliente');
  };
  const goToProveedores = () => {
    navigate('/proveedor');
  };
  const goToInventario = () => {
    navigate('/inventario');
  };
  const goToVentas = () => {
    navigate('/venta');
  };
  const goToCompras = () => {
    navigate('/compra');
  };
  const goToCalendario = () => {
    navigate('/calendario');
  };

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
          <h1>
            Bienvenido, <span className={styles.username}>{username || 'Usuario'}</span>
          </h1>
          <p>Aquí tienes un resumen de las actividades pendientes del almacén.</p>
        </div>

        <div className={styles.content}>
          <Summary />
          <Statistics />
          <Table />
        </div>
      </main>
    </div>
  );
};

export default Template;

