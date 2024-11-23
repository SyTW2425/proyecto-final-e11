import React, { useEffect, useState } from 'react';
import styles from '../assets/styles/template.module.css';
import LogoutButton from './logout';

interface Cliente {
  id_: string;
  nombre_: string;
  contacto_: number;
  compras_: string[];
  membresia_: boolean;
}

const ClienteUsuario: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  useEffect(() => {
    // Consumir API
    fetch('http://localhost:5000/clientes') 
      .then((response) => response.json())
      .then((data) => setClientes(data))
      .catch((error) => console.error('Error al cargar los datos:', error));
  }, []);

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
              <h1>Página de clientes F</h1>
              <p>Bienvenido</p>
            </div>

         {/* Tabla de clientes */}
         <div className={styles.content}>
          <h1>Lista de Clientes</h1>
          <div className={styles.tableContainer}>
            <table className={styles.styledTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Contacto</th>
                  <th>Compras</th>
                  <th>Membresía</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id_}>
                    <td>{cliente.id_}</td>
                    <td>{cliente.nombre_}</td>
                    <td>{cliente.contacto_}</td>
                    <td>
                      {cliente.compras_.length > 0
                        ? cliente.compras_.join(', ') // Lista separada por comas
                        : 'Sin compras'}
                    </td>
                    <td>{cliente.membresia_ ? 'Sí' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClienteUsuario;
