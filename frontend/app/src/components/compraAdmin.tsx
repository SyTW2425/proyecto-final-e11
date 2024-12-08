import React, { useEffect, useState } from 'react';
import styles from '../assets/styles/template.module.css';
import LogoutButton from './logout';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const ComprasAdmin: React.FC = () => {
  const [compras, setCompras] = useState<any[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarFormularioEliminar, setMostrarFormularioEliminar] = useState(false);
  const [idEliminar, setIdEliminar] = useState<string>(''); // Estado para almacenar el DNI
  const [mostrarFormularioBuscar, setMostrarFormularioBuscar] = useState(false); // Visibilidad del formulario de búsqueda
  const [idBuscar, setIdBuscar] = useState<string>(''); // DNI del cliente a buscar
  const [compraEncontrado, setCompraEncontrado] = useState<any | null>(null); // Datos del cliente encontrado

  // Estado para controlar la visibilidad del formulario
  const [nuevoCompra, setNuevoCompra] = useState({
    id_: '',
    fecha_: '',
    proveedor_: '',
    importe_: '',
    productos_: [
      {
        productoID_: '',
        cantidad_: '',
        precio_: '',
      },
    ],
  });

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
  }, []);

  const manejarCambioFormulario = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'productos_') {
      try {
        const productos = JSON.parse(value); // Si los datos llegan como JSON
        if (Array.isArray(productos)) {
          setNuevoCompra((prevState) => ({
            ...prevState,
            [name]: productos,
          }));
        } else {
          alert('El campo productos debe ser un array válido en formato JSON');
        }
      } catch (error) {
        alert('Error al parsear productos. Asegúrate de usar un formato JSON válido.');
      }
    } else {
      setNuevoCompra((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };


  const manejarEnvioFormulario = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nuevoCompra.id_ || !nuevoCompra.fecha_ || !nuevoCompra.proveedor_ || !nuevoCompra.importe_ || nuevoCompra.productos_.length === 0) {
      alert('Por favor, rellena todos los campos');
      return;
    }

    const nuevoCompra2 = {
      id_: nuevoCompra.id_,
      fecha_: nuevoCompra.fecha_,
      proveedor_: nuevoCompra.proveedor_,
      importe_: nuevoCompra.importe_,
      productos_: nuevoCompra.productos_,
    };

    alert(JSON.stringify(nuevoCompra2, null, 2))
    // Enviar el nuevo cliente al servidor como json
    axios.post('http://localhost:5000/compras', nuevoCompra2)
      .then((response) => {
        // Añadir el nuevo cliente al estado
        alert("Respuesta del backend:" + response.data);
        setCompras((prevVentas) => [...prevVentas, response.data]);
        alert('Compra creada correctamente');
        setMostrarFormulario(false); // Ocultar el formulario después de enviar
      })
      .catch((error) => {
        alert('Hubo un error al crear la compra' + error);
      });
  };

  const manejarEnvioEliminarCompra = (e: React.FormEvent) => {
    e.preventDefault();

    if (!idEliminar) {
      alert('Por favor, ingresa un ID de compra.');
      return;
    }

    axios
      .delete(`http://localhost:5000/compras/${idEliminar}`)
      .then(() => {
        setCompras((prevCompras) =>
          prevCompras.filter((compra) => compra.id_ !== idEliminar)
        );
        alert('Compra eliminada correctamente');
        setMostrarFormularioEliminar(false); // Ocultar formulario tras la eliminación
        setIdEliminar(''); // Limpiar el campo
      })
      .catch((error) => {
        console.error('Error al eliminar la compra:', error);
        alert('Hubo un error al eliminar la compra');
      });
  };


  const handleEditarCompra = () => {
    alert('Función para editar una compra existente');
    // Aquí puedes implementar lógica para seleccionar y editar un cliente
  };


  const manejarEnvioBuscarCompra = (e: React.FormEvent) => {
    e.preventDefault();

    if (!idBuscar) {
      alert('Por favor, ingresa un ID válido.');
      return;
    }

    // Hacer la solicitud al backend para buscar el cliente
    axios
      .get(`http://localhost:5000/compras/${idBuscar}`)
      .then((response) => {
        setCompraEncontrado(response.data); // Guardar los datos del cliente encontrado
      })
      .catch((error) => {
        console.error('Error al buscar la compra:', error);
        setCompraEncontrado(null); // Si no se encuentra, vaciar el cliente
        alert('Compra no encontrada');
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
            <span className={styles.title}>Compras: Administrador</span>
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
          <button className={styles.actionButton} onClick={() => setMostrarFormulario(!mostrarFormulario)}>Crear nueva compra</button>
          <button className={styles.actionButton} onClick={handleEditarCompra}>
            Editar compra existente
          </button>
          <button
            className={styles.actionButton}
            onClick={() => setMostrarFormularioEliminar(true)}
          >
            Eliminar compra
          </button>

          <button
            className={styles.actionButton}
            onClick={() => setMostrarFormularioBuscar(true)}
          > Buscar compra</button>
        </div>

        {mostrarFormularioEliminar && (
          <form onSubmit={manejarEnvioEliminarCompra} className={styles.formularioContainer}>
            <h2 className={styles.formTitle}>Eliminar compra</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>ID de la compra:</label>
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
                Eliminar compra
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
            <h2 className={styles.formTitle}>Crear Nueva compra</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>ID:</label>
              <input
                type="text"
                name="id_"
                value={nuevoCompra.id_}
                onChange={manejarCambioFormulario}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Fecha:</label>
              <input
                type="text"
                name="fecha_"
                value={nuevoCompra.fecha_}
                onChange={manejarCambioFormulario}
                className={styles.formInput}
                required
              />
              <label className={styles.formLabel}>Proveedor:</label>
              <input
                type="text"
                name="proveedor_"
                value={nuevoCompra.proveedor_}
                onChange={manejarCambioFormulario}
                className={styles.formInput}
                required
              />
              <label className={styles.formLabel}>Importe:</label>
              <input
                type="text"
                name="importe_"
                value={nuevoCompra.importe_}
                onChange={manejarCambioFormulario}
                className={styles.formInput}
                required
              />
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Productos de la compra:</label>
                <input
                  type="text"
                  name="productos_"
                  value={JSON.stringify(nuevoCompra.productos_)}
                  onChange={(e) => manejarCambioFormulario(e)}
                  className={styles.formInput}
                />
              </div>

            </div>

            <div className={styles.formButtonGroup}>
              <button type="submit" className={styles.formButton}>
                Crear Compra
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
          <form onSubmit={manejarEnvioBuscarCompra} className={styles.formularioContainer}>
            <h2 className={styles.formTitle}>Buscar Compra</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>ID de la compra:</label>
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
                Buscar Compra
              </button>
              <button
                type="button"
                onClick={() => {
                  setMostrarFormularioBuscar(false);
                  setCompraEncontrado(null);
                }}
                className={styles.formButtonCancel}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
        {compraEncontrado && (
          <div className={styles.resultContainer}>
            <h2 className={styles.resultTitle}>Compra Encontrada</h2>
            <div className={styles.resultContent}>
              <p><strong>ID:</strong> {compraEncontrado.id_}</p>
              <p><strong>Fecha:</strong> {compraEncontrado.fecha_}</p>
              <p><strong>Proveedor:</strong> {compraEncontrado.proveedor_}</p>
              <p><strong>Importe:</strong> {compraEncontrado.importe_}</p>
              <p><strong>Productos:</strong> {compraEncontrado.productos_.join(', ')}</p>
            </div>
          </div>
        )}

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
                    <td colSpan={5} style={{ textAlign: 'center' }}>No hay compras disponibles en la BBDD</td>
                  </tr>
                ) : (
                  compras.map((compra) => (
                    <tr key={compra.id_}>
                      <td>{compra.id_}</td>
                      <td>{compra.fecha_}</td>
                      <td>{compra.proveedor_}</td>
                      <td>{compra.importe_}</td>
                      {/* Mostramos los productos teniendo en cuenta que es una array con productoID, cantidad y precio*/}
                      <td>{compra.productos_.map((producto: any) => (
                        <div key={producto.productoID_}>
                          <p>{producto.productoId} - {producto.cantidad} - {producto.precio}</p>
                        </div>
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

export default ComprasAdmin;