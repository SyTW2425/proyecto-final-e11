import React, { useEffect, useState } from 'react';
import styles from '../assets/styles/template.module.css';
import LogoutButton from './logout';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';  // Importar el hook useNavigate

const InventarioAdmin: React.FC = () => {
  const [productos, setProductos] = useState<any[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarFormularioEliminar, setMostrarFormularioEliminar] = useState(false);
  const [idEliminar, setIdEliminar] = useState<string>(''); // Estado para almacenar el DNI
  const [mostrarFormularioBuscar, setMostrarFormularioBuscar] = useState(false); // Visibilidad del formulario de búsqueda
  const [idBuscar, setIdBuscar] = useState<string>(''); // DNI del cliente a buscar
  const [productoEncontrado, setProductoEncontrado] = useState<any | null>(null); // Datos del cliente encontrado

  // Estado para controlar la visibilidad del formulario
  const [nuevoProducto, setNuevoProducto] = useState({
    id_: '',
    nombre_: '',
    stock_: '',
    precio_venta_: '',
  });
 
  useEffect(() => {
    // Consumir API
    fetch('http://localhost:5000/productos')
      .then((response) => response.json())
      .then((data) => {
        // Asegurarte de que los datos son un array
        if (Array.isArray(data)) {
          setProductos(data);
        } else {
          console.error('El formato de los datos no es válido:', data);
          setProductos([]); // Fallback a un array vacío
        }
      })
      .catch((error) => {
        console.error('Error al cargar los datos:', error);
        setProductos([]); // Fallback a un array vacío en caso de error
      });
  }, []);

  const manejarCambioFormulario = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'compras_') {
      setNuevoProducto((prevState) => ({
        ...prevState,
        [name]: value.split(',').map((item) => parseInt(item.trim(), 10)).filter((item) => !isNaN(item)),
      }));
    } else {
      setNuevoProducto((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const manejarEnvioFormulario = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nuevoProducto.id_ || !nuevoProducto.nombre_ || !nuevoProducto.stock_ || !nuevoProducto.precio_venta_) {
      alert('Por favor, rellena todos los campos');
      return;
    }

    const nuevoProducto2 = {
      id_: nuevoProducto.id_,
      nombre_: nuevoProducto.nombre_,
      stock_: nuevoProducto.stock_,
      precio_venta_: nuevoProducto.precio_venta_,
    };
    alert(JSON.stringify(nuevoProducto2, null, 2))
    // Enviar el nuevo cliente al servidor como json
    axios.post('http://localhost:5000/productos', nuevoProducto2)
      .then((response) => {
        // Añadir el nuevo cliente al estado
        alert("Respuesta del backend:" + response.data);
        setProductos((prevProductos) => [...prevProductos, response.data]);
        alert('Producto creado correctamente');
        setMostrarFormulario(false); // Ocultar el formulario después de enviar
      })
      .catch((error) => {
        alert('Hubo un error al crear el cliente' + error);
      });
  };

  const manejarEnvioEliminarProducto = (e: React.FormEvent) => {
    e.preventDefault();

    if (!idEliminar) {
      alert('Por favor, ingresa un ID de producto válido.');
      return;
    }

    axios
      .delete(`http://localhost:5000/productos/${idEliminar}`)
      .then(() => {
        setProductos((prevProductos) =>
          prevProductos.filter((producto) => producto.id_ !== idEliminar)
        );
        alert('Producto eliminado correctamente');
        setMostrarFormularioEliminar(false); // Ocultar formulario tras la eliminación
        setIdEliminar(''); // Limpiar el campo
      })
      .catch((error) => {
        console.error('Error al eliminar el producto:', error);
        alert('Hubo un error al eliminar el producto');
      });
  };


  const handleEditarProducto = () => {
    alert('Función para editar un producto existente');
    // Aquí puedes implementar lógica para seleccionar y editar un cliente
  };


  const manejarEnvioBuscarProducto = (e: React.FormEvent) => {
    e.preventDefault();

    if (!idBuscar) {
      alert('Por favor, ingresa un ID válido.');
      return;
    }

    // Hacer la solicitud al backend para buscar el cliente
    axios
      .get(`http://localhost:5000/productos/${idBuscar}`)
      .then((response) => {
        setProductoEncontrado(response.data); // Guardar los datos del cliente encontrado
      })
      .catch((error) => {
        console.error('Error al buscar el producto:', error);
        setProductoEncontrado(null); // Si no se encuentra, vaciar el cliente
        alert('Producto no encontrado');
      });
  };

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
            <span className={styles.title}>Productos: Administrador</span>
            {/* Botón con imagen */}
            <Link to="/template" className={styles.navButton}>
              <img
                src="home.png"
                alt="Template"
                className={styles.navImage}
              />
            </Link>
          </div>
        </nav>
        {/* Sección de botones */}
        <div className={styles.buttonContainer}>
          <button className={styles.actionButton} onClick={() => setMostrarFormulario(!mostrarFormulario)}>Crear nuevo producto</button>
          <button className={styles.actionButton} onClick={handleEditarProducto}>
            Editar producto existente
          </button>
          <button
            className={styles.actionButton}
            onClick={() => setMostrarFormularioEliminar(true)}
          >
            Eliminar producto
          </button>

          <button
            className={styles.actionButton}
            onClick={() => setMostrarFormularioBuscar(true)}
          > Buscar producto</button>
        </div>

        {mostrarFormularioEliminar && (
          <form onSubmit={manejarEnvioEliminarProducto} className={styles.formularioContainer}>
            <h2 className={styles.formTitle}>Eliminar producto</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>ID del producto:</label>
              <input
                type="text"
                name="idEliminar"
                value={idEliminar}
                onChange={(e) => setIdEliminar(e.target.value)}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formButtonGroup}>
              <button type="submit" className={styles.formButton}>
                Eliminar producto
              </button>
              <button
                type="button"
                onClick={() => setMostrarFormularioEliminar(false)}
                className={styles.formButtonCancel}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
        {mostrarFormulario && (
          <form onSubmit={manejarEnvioFormulario} className={styles.formularioContainer}>
            <h2 className={styles.formTitle}>Crear Nuevo Producto</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>ID:</label>
              <input
                type="text"
                name="id_"
                value={nuevoProducto.id_}
                onChange={manejarCambioFormulario}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nombre:</label>
              <input
                type="text"
                name="nombre_"
                value={nuevoProducto.nombre_}
                onChange={manejarCambioFormulario}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Stock disponible:</label>
              <input
                type="number"
                name="stock_"
                value={nuevoProducto.stock_}
                onChange={manejarCambioFormulario}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Precio de venta:</label>
              <input
                type="text"
                name="precio_venta_"
                value={nuevoProducto.precio_venta_}
                onChange={manejarCambioFormulario}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formButtonGroup}>
              <button type="submit" className={styles.formButton}>
                Crear Producto
              </button>
              <button
                type="button"
                onClick={() => setMostrarFormulario(false)}
                className={styles.formButtonCancel}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {mostrarFormularioBuscar && (
          <form onSubmit={manejarEnvioBuscarProducto} className={styles.formularioContainer}>
            <h2 className={styles.formTitle}>Buscar Producto</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>ID del producto:</label>
              <input
                type="text"
                name="idBuscar"
                value={idBuscar}
                onChange={(e) => setIdBuscar(e.target.value)}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formButtonGroup}>
              <button type="submit" className={styles.formButton}>
                Buscar Producto
              </button>
              <button
                type="button"
                onClick={() => {
                  setMostrarFormularioBuscar(false);
                  setProductoEncontrado(null);
                }}
                className={styles.formButtonCancel}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
        {productoEncontrado && (
          <div className={styles.resultContainer}>
            <h2 className={styles.resultTitle}>Producto Encontrado</h2>
            <div className={styles.resultCard}>
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Id:</span>
                <span className={styles.resultValue}>{productoEncontrado.id_}</span>
              </div>
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Nombre:</span>
                <span className={styles.resultValue}>{productoEncontrado.nombre_}</span>
              </div>
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Stock:</span>
                <span className={styles.resultValue}>{productoEncontrado.stock_}</span>
              </div>
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Precio:</span>
                <span className={styles.resultValue}>{productoEncontrado.precio_venta_}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tabla de clientes */}
        <div className={styles.content}>
          <h1>Lista de Productos</h1>
          <div className={styles.tableContainer}>
            <table className={styles.styledTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Stock</th>
                  <th>Precio venta</th>
                </tr>
              </thead>
              <tbody>
                {productos.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center' }}>No hay productos disponibles en la BBDD</td>
                  </tr>
                ) : (
                  productos.map((producto) => (
                    <tr key={producto.id_}>
                      <td>{producto.id_}</td>
                      <td>{producto.nombre_}</td>
                      <td>{producto.stock_}</td>
                      <td>{producto.precio_venta_}</td>
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

export default InventarioAdmin;