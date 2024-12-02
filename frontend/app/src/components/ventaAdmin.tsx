import React, { useEffect, useState } from 'react';
import styles from '../assets/styles/template.module.css';
import LogoutButton from './logout';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VentasAdmin: React.FC = () => {
  const [ventas, setVentas] = useState<any[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarFormularioEliminar, setMostrarFormularioEliminar] = useState(false);
  const [idEliminar, setIdEliminar] = useState<string>(''); // Estado para almacenar el DNI
  const [mostrarFormularioBuscar, setMostrarFormularioBuscar] = useState(false); // Visibilidad del formulario de búsqueda
  const [idBuscar, setIdBuscar] = useState<string>(''); // DNI del cliente a buscar
  const [ventaEncontrado, setVentaEncontrado] = useState<any | null>(null); // Datos del cliente encontrado

  // Estado para controlar la visibilidad del formulario
  const [nuevoVenta, setNuevoVenta] = useState({
    id_: '',
    fecha_: '',
    cliente_: '',
    importe_: 0,
    productos: [
      {
        productoID: '',
        cantidad: 0,
        precio: 0,
      },
    ],
  });


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
  }, []);

  const manejarCambioFormulario = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'compras_') {
      setNuevoVenta((prevState) => ({
        ...prevState,
        [name]: value.split(',').map((item) => parseInt(item.trim(), 10)).filter((item) => !isNaN(item)),
      }));
    } else {
      setNuevoVenta((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const manejarEnvioFormulario = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nuevoVenta.id_ || !nuevoVenta.fecha_ || !nuevoVenta.cliente_ || !nuevoVenta.importe_ || nuevoVenta.productos.length === 0) {
      alert('Por favor, rellena todos los campos');
      return;
    }

    const nuevoVenta2 = {
      id_: nuevoVenta.id_,
      fecha_: nuevoVenta.fecha_,
      cliente_: nuevoVenta.cliente_,
      importe_: nuevoVenta.importe_,
      productos: nuevoVenta.productos,
    };

    alert(JSON.stringify(nuevoVenta2, null, 2))
    // Enviar el nuevo cliente al servidor como json
    axios.post('http://localhost:5000/ventas', nuevoVenta2)
      .then((response) => {
        // Añadir el nuevo cliente al estado
        alert("Respuesta del backend:" + response.data);
        setVentas((prevVentas) => [...prevVentas, response.data]);
        alert('Venta creada correctamente');
        setMostrarFormulario(false); // Ocultar el formulario después de enviar
      })
      .catch((error) => {
        alert('Hubo un error al crear la venta' + error);
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
        setVentas((prevVentas) =>
          prevVentas.filter((venta) => venta.id_ !== idEliminar)
        );
        alert('Venta eliminada correctamente');
        setMostrarFormularioEliminar(false); // Ocultar formulario tras la eliminación
        setIdEliminar(''); // Limpiar el campo
      })
      .catch((error) => {
        console.error('Error al eliminar la venta:', error);
        alert('Hubo un error al eliminar la venta');
      });
  };


  const handleEditarVenta = () => {
    alert('Función para editar una venta existente');
    // Aquí puedes implementar lógica para seleccionar y editar un cliente
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
        setVentaEncontrado(response.data); // Guardar los datos del cliente encontrado
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
      </aside>

      {/* Contenido principal */}
      <main className={styles.main}>
        {/* Barra de navegación superior */}
        <nav className={styles.navbar}>
          <div className={styles.navContent}>
            <span className={styles.title}>Ventas</span>
            <div className={styles.logoutButtonContainer}>
              <LogoutButton />
            </div>
          </div>
        </nav>
        {/* Sección de botones */}
        <div className={styles.buttonContainer}>
          <button className={styles.actionButton} onClick={() => setMostrarFormulario(!mostrarFormulario)}>Crear nueva venta</button>
          <button className={styles.actionButton} onClick={handleEditarVenta}>
            Editar venta existente
          </button>
          <button
            className={styles.actionButton}
            onClick={() => setMostrarFormularioEliminar(true)}
          >
            Eliminar venta
          </button>

          <button
            className={styles.actionButton}
            onClick={() => setMostrarFormularioBuscar(true)}
          > Buscar venta</button>
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
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Productos de la venta:</label>
                <input
                  type="text"
                  name="productos_"
                  value={nuevoVenta.productos.join(',')}
                  onChange={(e) => manejarCambioFormulario(e)}
                  className={styles.formInput}
                />
              </div>

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
            <h2 className={styles.resultTitle}>Cliente Encontrado</h2>
            <div className={styles.resultContent}>
              <p><strong>ID:</strong> {ventaEncontrado.id_}</p>
              <p><strong>Fecha:</strong> {ventaEncontrado.fecha_}</p>
              <p><strong>Cliente:</strong> {ventaEncontrado.cliente_}</p>
              <p><strong>Importe:</strong> {ventaEncontrado.importe_}</p>
              <p><strong>Productos:</strong> {ventaEncontrado.productos.join(', ')}</p>
            </div>
          </div>
        )}


        {/* Contenido de la página */}
        <div className={styles.content}>
          <h1>Página de ventas pa administradores</h1>
          <p>Bienvenido</p>
        </div>
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
                      <td>{venta.cliente_}</td>
                      <td>{venta.importe_}</td>
                      <td>{venta.productos.join(', ')}</td>
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