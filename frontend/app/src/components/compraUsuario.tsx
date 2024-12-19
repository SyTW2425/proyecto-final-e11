import React, { useEffect, useState } from 'react';
import styles from '../assets/styles/template.module.css';
import LogoutButton from './logout';
import { useNavigate, Link } from 'react-router-dom';

interface Compras {
  id_: string;
  fecha_: string;
  proveedor_: string;
  importe_: number;
  productos_: {
    productoID_: string;
    cantidad_: number;
    precio_: number;
  }[]
}

interface Proveedor {
  _id: string;
  id_: string;
  nombre_: string;
}

interface Producto {
  _id: string;
  id_: number;
  nombre_: string;
}

const ComprasUsuario: React.FC = () => {
  const [compras, setCompras] = useState<Compras[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  useEffect(() => {
    // Consumir API
    fetch('http://localhost:5000/compras')
      .then((response) => response.json())
      .then((data) => {
        // Asegurarte de que los datos son un array
        if (Array.isArray(data)) {
          setCompras(data);
        } else {
          console.error('El formato de los datos no es válido:', data);
          setCompras([]); // Fallback a un array vacío
        }
      })
      .catch((error) => {
        console.error('Error al cargar los datos:', error);
        setCompras([]); // Fallback a un array vacío en caso de error
      });

    fetch('http://localhost:5000/proveedores')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProveedores(data);
        } else {
          console.error('El formato de los datos no es válido:', data);
          setProveedores([]); // Fallback a un array vacío
        }
      })
      .catch((error) => {
        console.error('Error al cargar los datos de proveedores:', error);
        setProveedores([]);
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

  const obtenerNombreProveedor = (idProveedor: string) => {
    const proveedor = proveedores.find((prov) => prov._id === idProveedor);
    return proveedor ? proveedor.id_ : 'Desconocido';
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
            <span className={styles.title}>Compras</span>
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
          <h1>Lista de Compras</h1>
          <div className={styles.tableContainer}>
            <table className={styles.styledTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Proveedor</th>
                  <th>Importe</th>
                  <th>Productos</th>
                </tr>
              </thead>
              <tbody>
                {compras.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center' }}>No hay compras en la BBDD</td>
                  </tr>
                ) : (
                  compras.map((compra) => (
                    <tr key={compra.id_}>
                      <td>{compra.id_}</td>
                      <td>{compra.fecha_}</td>
                      <td>{obtenerNombreProveedor(compra.proveedor_)}</td>
                      <td>{compra.importe_}</td>
                      <td>{compra.productos_.map((producto: any) => (
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

export default ComprasUsuario;