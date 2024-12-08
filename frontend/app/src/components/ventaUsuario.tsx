import React, { useEffect, useState } from 'react';
import styles from '../assets/styles/template.module.css';
import LogoutButton from './logout';
import { useNavigate, Link } from 'react-router-dom';

interface Ventas {
  id_: string;
  fecha_: string;
  cliente_: string;
  importe_: number;
  productos_: {
    productoID_: string;
    cantidad_: number;
    precio_: number;
  }[]
}

interface Cliente {
  _id: string;
  id_: string;
  nombre_: string;
}

interface Producto {
  _id: string;
  id_: number;
  nombre_: string;
}


const VentasUsuario: React.FC = () => {
  const [ventas, setVentas] = useState<Ventas[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  useEffect(() => {
    // Consumir API
    fetch('http://localhost:5000/ventas')
      .then((response) => response.json())
      .then((data) => {
        // Asegurarte de que los datos son un array
        if (Array.isArray(data)) {
          setVentas(data);
        } else {
          console.error('El formato de los datos no es válido:', data);
          setVentas([]); // Fallback a un array vacío
        }
      })
      .catch((error) => {
        console.error('Error al cargar los datos:', error);
        setVentas([]); // Fallback a un array vacío en caso de error
      });

      fetch('http://localhost:5000/clientes')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setClientes(data);
        } else {
          console.error('El formato de los datos no es válido:', data);
          setClientes([]); // Fallback a un array vacío
        }
      })
      .catch((error) => {
        console.error('Error al cargar los datos de proveedores:', error);
        setClientes([]);
      });

      fetch('http://localhost:5000/productos')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProductos(data);
        } else {
          console.error('El formato de los datos no es válido:', data);
          setProductos([]); // Fallback a un array vacío
        }
      })
      .catch((error) => {
        console.error('Error al cargar los datos de los productos:', error);
        setProductos([]);
      });

  }, []);

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

  const obtenerNombreCliente = (idCliente: string) => {
    const cliente = clientes.find((prov) => prov._id === idCliente);
    return cliente ? cliente.id_ : 'Desconocido';
  };

  const obtenerNombreProducto= (idProducto: string) => {
    const producto = productos.find((prod) => prod._id === idProducto);
    return producto ? producto.nombre_ : 'Desconocido';
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
            <span className={styles.title}>Ventas</span>
            <Link to="/template" className={styles.navButton}>
              <img
                src="home.png"
                alt="Template"
                className={styles.navImage}
              />
            </Link>
          </div>
        </nav>

        {/* Tabla de clientes */}
        <div className={styles.content}>
          <h1>Lista de Ventas</h1>
          <div className={styles.tableContainer}>
            <table className={styles.styledTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Importe</th>
                  <th>Productos</th>
                </tr>
              </thead>
              <tbody>
                {ventas.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center' }}>No hay ventas en la BBDD</td>
                  </tr>
                ) : (
                  ventas.map((venta) => (
                    <tr key={venta.id_}>
                      <td>{venta.id_}</td>
                      <td>{venta.fecha_}</td>
                      <td>{obtenerNombreCliente(venta.cliente_)}</td>
                      <td>{venta.importe_}</td>
                      <td>{venta.productos_.map((producto: any) => (
                        <p> Producto: {obtenerNombreProducto(producto.productoId)} - Cantidad: {producto.cantidad} - Precio: {producto.precio}</p>
                      ))}</td>
                      
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VentasUsuario;