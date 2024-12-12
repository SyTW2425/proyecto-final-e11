import React, { useEffect, useState } from 'react';
import styles from '../assets/styles/template.module.css';
import LogoutButton from './logout';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

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

const VentasAdmin: React.FC = () => {
  const [ventas, setVentas] = useState<any[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarFormularioEliminar, setMostrarFormularioEliminar] = useState(false);
  const [idEliminar, setIdEliminar] = useState<string>(''); // Estado para almacenar el DNI
  const [mostrarFormularioBuscar, setMostrarFormularioBuscar] = useState(false); // Visibilidad del formulario de búsqueda
  const [idBuscar, setIdBuscar] = useState<string>(''); // DNI del cliente a buscar
  const [ventaEncontrado, setVentaEncontrado] = useState<any | null>(null); // Datos del cliente encontrado
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);

  // Estado para controlar la visibilidad del formulario
  const [nuevoVenta, setNuevoVenta] = useState({
    id_: '',
    fecha_: '',
    cliente_: '',
    importe_: 0,
    productos_: [
      {
        productoID_: '',
        cantidad_: 0,
        precio_: 0,
      },
    ],
  });

  const agregarProducto = () => {
    setNuevoVenta((prevState) => ({
      ...prevState,
      productos_: [...prevState.productos_, { productoID_: '', cantidad_: 0, precio_: 0 }]
    }));
  };

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
        console.error('Error al cargar los datos de clientes:', error);
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

  const manejarCambioFormulario = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, dataset } = e.target;
    const productoIndex = dataset.index ? parseInt(dataset.index) : null;

    if (productoIndex !== null && ['productoID_', 'cantidad_', 'precio_'].includes(name)) {
      setNuevoVenta((prevState) => {
        const nuevosProductos = [...prevState.productos_];
        const productoActualizado = {
          ...nuevosProductos[productoIndex],
          [name]: name === 'cantidad_' ? parseInt(value) : value
        };
        nuevosProductos[productoIndex] = productoActualizado;

        return {
          ...prevState,
          productos_: nuevosProductos
        };
      });
    } else {
      setNuevoVenta((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const manejarEnvioFormulario = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nuevoVenta.id_ || !nuevoVenta.fecha_ || !nuevoVenta.cliente_ || !nuevoVenta.importe_ || nuevoVenta.productos_.length === 0) {
      alert('Por favor, rellena todos los campos');
      return;
    }

    const nuevoVenta2 = {
      id_: nuevoVenta.id_,
      fecha_: nuevoVenta.fecha_,
      cliente_: nuevoVenta.cliente_,
      importe_: nuevoVenta.importe_,
      productos_: nuevoVenta.productos_,
    };

    // Enviar el nuevo cliente al servidor como json
    axios.post('http://localhost:5000/ventas', nuevoVenta2)
      .then((response) => {
        setVentas((prevVentas) => [...prevVentas, response.data]);
        alert('Compra creada correctamente');
        setMostrarFormulario(false); // Ocultar el formulario después de enviar
      })
      .catch((error) => {
        alert('Hubo un error al crear la venta. Parámetros no válidos.');
      });
  };

  const manejarEnvioEliminarVenta = (e: React.FormEvent) => {
    e.preventDefault();

    if (!idEliminar) {
      alert('Por favor, ingresa un ID de venta.');
      return;
    }

    axios
      .delete(`http://localhost:5000/ventas/${idEliminar}`)
      .then(() => {
        alert('Venta eliminada correctamente');
        setMostrarFormularioEliminar(false); // Ocultar formulario tras la eliminación
        setIdEliminar(''); // Limpiar el campo

        // Recargar la lista de ventas actualizada desde la API
        return axios.get('http://localhost:5000/ventas');
      })
      .then((response) => {
        // Actualizar el estado con las ventas más recientes
        setVentas(response.data);
      })
      .catch((error) => {
        alert('Hubo un error al eliminar la venta. ID no encontrado.');
      });
};




  const manejarEnvioBuscarVenta = (e: React.FormEvent) => {
    e.preventDefault();

    if (!idBuscar) {
      alert('Por favor, ingresa un ID válido.');
      return;
    }

    // Hacer la solicitud al backend para buscar el cliente
    axios
      .get(`http://localhost:5000/ventas/${idBuscar}`)
      .then((response) => {
        setVentaEncontrado(response.data);
      })
      .catch((error) => {
        console.error('Error al buscar la venta:', error);
        setVentaEncontrado(null); // Si no se encuentra, vaciar el cliente
        alert('Venta no encontrada');
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

  const obtenerNombreCliente = (idCliente: string) => {
    const cliente = clientes.find((prov) => prov._id === idCliente);
    return cliente ? cliente.id_ : 'Desconocido';
  };

  const obtenerNombreProducto = (idProducto: string) => {
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
            <span className={styles.title}>Ventas: Administrador</span>
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
          <button className={styles.actionButton} onClick={() => setMostrarFormulario(!mostrarFormulario)}>Crear nueva venta</button>
          <button
            className={styles.actionButton}
            onClick={() => setMostrarFormularioEliminar(true)}
          >
            Eliminar Venta
          </button>

          <button
            className={styles.actionButton}
            onClick={() => setMostrarFormularioBuscar(true)}
          > Buscar Venta</button>
        </div>

        {mostrarFormularioEliminar && (
          <form onSubmit={manejarEnvioEliminarVenta} className={styles.formularioContainer}>
            <h2 className={styles.formTitle}>Eliminar venta</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>ID de la venta:</label>
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
                Eliminar venta
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
            <h2 className={styles.formTitle}>Crear Nueva venta</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>ID:</label>
              <input
                type="text"
                name="id_"
                value={nuevoVenta.id_}
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
                value={nuevoVenta.fecha_}
                onChange={manejarCambioFormulario}
                className={styles.formInput}
                required
              />
              <label className={styles.formLabel}>Cliente:</label>
              <input
                type="text"
                name="cliente_"
                value={nuevoVenta.cliente_}
                onChange={manejarCambioFormulario}
                className={styles.formInput}
                required
              />
              <label className={styles.formLabel}>Importe:</label>
              <input
                type="text"
                name="importe_"
                value={nuevoVenta.importe_}
                onChange={manejarCambioFormulario}
                className={styles.formInput}
                required
              />
              {nuevoVenta.productos_.map((producto, index) => (
                <div key={index} className={styles.formGroup}>
                  <label className={styles.formLabel}>Producto {index + 1}</label>

                  {/* Campo de selección del producto */}
                  <select
                    name="productoID_"
                    data-index={index}
                    value={producto.productoID_}
                    onChange={manejarCambioFormulario}
                    className={styles.formInput}
                  >
                    <option value="">Seleccionar Producto</option>
                    {productos.map((prod) => (
                      <option key={prod.id_} value={prod.id_}>
                        {prod.nombre_}
                      </option>
                    ))}
                  </select>

                  {/* Campo de cantidad */}
                  <input
                    type="number"
                    name="cantidad_"
                    data-index={index}
                    value={producto.cantidad_ || ''}
                    onChange={manejarCambioFormulario}
                    className={styles.formInput}
                    placeholder="Cantidad"
                    min="1"
                  />

                  {/* Campo de precio */}
                  <input
                    type="number"
                    name="precio_"
                    data-index={index}
                    value={producto.precio_ || ''}
                    onChange={manejarCambioFormulario}
                    className={styles.formInput}
                    placeholder="Precio"
                    min="0"
                    step="0.01"
                  />
                </div>
              ))}

              <button type="button" onClick={agregarProducto} className={styles.formButton}>
                Agregar Producto
              </button>

            </div>

            <div className={styles.formButtonGroup}>
              <button type="submit" className={styles.formButton}>
                Crear Venta
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
          <form onSubmit={manejarEnvioBuscarVenta} className={styles.formularioContainer}>
            <h2 className={styles.formTitle}>Buscar Venta</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>ID de la venta:</label>
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
                Buscar Venta
              </button>
              <button
                type="button"
                onClick={() => {
                  setMostrarFormularioBuscar(false);
                  setVentaEncontrado(null);
                }}
                className={styles.formButtonCancel}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
        {ventaEncontrado && (
          <div className={styles.resultContainer}>
            <h2 className={styles.resultTitle}>Venta Encontrada</h2>
            <div className={styles.resultCard}>
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Id:</span>
                <span className={styles.resultValue}>{ventaEncontrado.id_}</span>
              </div>
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Fecha:</span>
                <span className={styles.resultValue}>{ventaEncontrado.fecha_}</span>
              </div>
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Cliente:</span>
                <span className={styles.resultValue}>{obtenerNombreCliente(ventaEncontrado.cliente_)}</span>
              </div>
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Importe:</span>
                <span className={styles.resultValue}>{ventaEncontrado.importe_}</span>
              </div>
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Productos:</span>
                <span className={styles.resultValue}>
                  <td>{ventaEncontrado.productos_.map((producto: any) => (
                  <p> Producto: {obtenerNombreProducto(producto.productoId)} - Cantidad: {producto.cantidad} - Precio: {producto.precio}</p>
                  ))}</td>
                </span>
              </div>

            </div>
          </div>
        )}

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
                    <td colSpan={5} style={{ textAlign: 'center' }}>No hay ventas disponibles en la BBDD</td>
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

export default VentasAdmin;