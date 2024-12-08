import React, { useEffect, useState } from 'react';
import styles from '../assets/styles/template.module.css';
import LogoutButton from './logout';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';  // Importar el hook useNavigate

const ProveedorAdmin: React.FC = () => {
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarFormularioEliminar, setMostrarFormularioEliminar] = useState(false);
  const [dniEliminar, setDniEliminar] = useState<string>(''); // Estado para almacenar el DNI
  const [mostrarFormularioBuscar, setMostrarFormularioBuscar] = useState(false); // Visibilidad del formulario de búsqueda
  const [dniBuscar, setDniBuscar] = useState<string>(''); // DNI del cliente a buscar
  const [proveedorEncontrado, setProveedorEncontrado] = useState<any | null>(null); // Datos del cliente encontrado

  // Estado para controlar la visibilidad del formulario
  const [nuevoProveedor, setNuevoProveedor] = useState({
    id_: '',
    nombre_: '',
    contacto_: '',
    productos_: [] as number[]
  });
  //const [dniAEliminar, setDniAEliminar] = useState<string>(''); // Estado para almacenar el DNI a eliminar


  useEffect(() => {
    // Consumir API
    fetch('http://localhost:5000/proveedores')
      .then((response) => response.json())
      .then((data) => {
        // Asegurarte de que los datos son un array
        if (Array.isArray(data)) {
          setProveedores(data);
        } else {
          console.error('El formato de los datos no es válido:', data);
          setProveedores([]); // Fallback a un array vacío
        }
      })
      .catch((error) => {
        console.error('Error al cargar los datos:', error);
        setProveedores([]); // Fallback a un array vacío en caso de error
      });
  }, []);

  const manejarCambioFormulario = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'productos_') {
      setNuevoProveedor((prevState) => ({
        ...prevState,
        [name]: value.split(',').map((item) => parseInt(item.trim(), 10)).filter((item) => !isNaN(item)),
      }));
    } else {
      setNuevoProveedor((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const manejarEnvioFormulario = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nuevoProveedor.id_ || !nuevoProveedor.nombre_ || !nuevoProveedor.contacto_) {
      alert('Por favor, rellena todos los campos');
      return;
    }

    const nuevoProveedor2 = {
      id_: nuevoProveedor.id_,
      nombre_: nuevoProveedor.nombre_,
      contacto_: nuevoProveedor.contacto_,
      productos_: nuevoProveedor.productos_
    };
    alert(JSON.stringify(nuevoProveedor2, null, 2))
    // Enviar el nuevo cliente al servidor como json
    axios.post('http://localhost:5000/proveedores', nuevoProveedor2)
      .then((response) => {
        // Añadir el nuevo cliente al estado
        alert("Respuesta del backend:" + response.data);
        setProveedores((prevProveedores) => [...prevProveedores, response.data]);
        alert('Cliente creado correctamente');
        setMostrarFormulario(false); // Ocultar el formulario después de enviar
      })
      .catch((error) => {
        alert('Hubo un error al crear el proveedor');
      });
  };

  const manejarEnvioEliminarProveedor = (e: React.FormEvent) => {
    e.preventDefault();

    if (!dniEliminar) {
      alert('Por favor, ingresa un Identificador válido.');
      return;
    }

    axios
      .delete(`http://localhost:5000/proveedores/${dniEliminar}`)
      .then(() => {
        setProveedores((prevProveedores) =>
          prevProveedores.filter((proveedor) => proveedor.id_ !== dniEliminar)
        );
        alert('Proveedor eliminado correctamente');
        setMostrarFormularioEliminar(false); // Ocultar formulario tras la eliminación
        setDniEliminar(''); // Limpiar el campo
      })
      .catch((error) => {
        console.error('Error al eliminar el proveedor:', error);
        alert('Hubo un error al eliminar el proveedor');
      });
  };


  const handleEditarProveedor = () => {
    alert('Función para editar un proveedor existente');
    // Aquí puedes implementar lógica para seleccionar y editar un cliente
  };

  const manejarEnvioBuscarProveedor = (e: React.FormEvent) => {
    e.preventDefault();

    if (!dniBuscar) {
      alert('Por favor, ingresa un Identificador válido.');
      return;
    }

    // Hacer la solicitud al backend para buscar el proveedor
    axios
      .get(`http://localhost:5000/proveedores/${dniBuscar}`)
      .then((response) => {
        setProveedorEncontrado(response.data); // Guardar los datos del proveedor encontrado
      })
      .catch((error) => {
        console.error('Error al buscar el proveedor:', error);
        setProveedorEncontrado(null); // Si no se encuentra, vaciar el proveedor
        alert('Proveedor no encontrado');
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
            <span className={styles.title}>Proveedores: Administrador</span>
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
          <button className={styles.actionButton} onClick={() => setMostrarFormulario(!mostrarFormulario)}>Crear nuevo proveedor</button>
          <button className={styles.actionButton} onClick={handleEditarProveedor}>
            Editar proveedor existente
          </button>
          <button
            className={styles.actionButton}
            onClick={() => setMostrarFormularioEliminar(true)}
          >
            Eliminar proveedor
          </button>

          <button
            className={styles.actionButton}
            onClick={() => setMostrarFormularioBuscar(true)}
          > Buscar proveedor</button>
        </div>

        {mostrarFormularioEliminar && (
          <form onSubmit={manejarEnvioEliminarProveedor} className={styles.formularioContainer}>
            <h2 className={styles.formTitle}>Eliminar Proveedor</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Identificador del proveedor:</label>
              <input
                type="text"
                name="identificadorEliminar"
                value={dniEliminar}
                onChange={(e) => setDniEliminar(e.target.value)}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formButtonGroup}>
              <button type="submit" className={styles.formButton}>
                Eliminar Proveedor
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
            <h2 className={styles.formTitle}>Crear Nuevo Proveedor</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Identificador:</label>
              <input
                type="text"
                name="id_"
                value={nuevoProveedor.id_}
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
                value={nuevoProveedor.nombre_}
                onChange={manejarCambioFormulario}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Contacto:</label>
              <input
                type="number"
                name="contacto_"
                value={nuevoProveedor.contacto_}
                onChange={manejarCambioFormulario}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Productos:</label>
              <input
                type="text"
                name="productos_"
                value={nuevoProveedor.productos_.join(',')}
                onChange={(e) => manejarCambioFormulario(e)}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formButtonGroup}>
              <button type="submit" className={styles.formButton}>
                Crear Proveedor
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
          <form onSubmit={manejarEnvioBuscarProveedor} className={styles.formularioContainer}>
            <h2 className={styles.formTitle}>Buscar Proveedor</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Identificador del proveedor:</label>
              <input
                type="text"
                name="dniBuscar"
                value={dniBuscar}
                onChange={(e) => setDniBuscar(e.target.value)}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formButtonGroup}>
              <button type="submit" className={styles.formButton}>
                Buscar Proveedor
              </button>
              <button
                type="button"
                onClick={() => {
                  setMostrarFormularioBuscar(false);
                  setProveedorEncontrado(null);
                }}
                className={styles.formButtonCancel}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
        {proveedorEncontrado && (
          <div className={styles.resultContainer}>
            <h2 className={styles.resultTitle}>Proveedor Encontrado</h2>
            <div className={styles.resultContent}>
              <p><strong>DNI:</strong> {proveedorEncontrado.id_}</p>
              <p><strong>Nombre:</strong> {proveedorEncontrado.nombre_}</p>
              <p><strong>Contacto:</strong> {proveedorEncontrado.contacto_}</p>
              <p><strong>Compras:</strong> {proveedorEncontrado.productos_.length > 0
                ? proveedorEncontrado.productos_.join(', ')
                : 'Sin productos'}
              </p>
            </div>
          </div>
        )}

        {/* Tabla de clientes */}
        <div className={styles.content}>
          <h1>Lista de Proveedores</h1>
          <div className={styles.tableContainer}>
            <table className={styles.styledTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Contacto</th>
                  <th>Productos</th>
                </tr>
              </thead>
              <tbody>
                {proveedores.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center' }}>No hay proveedores</td>
                  </tr>
                ) : (
                  proveedores.map((proveedor) => (
                    <tr key={proveedor.id_}>
                      <td>{proveedor.id_}</td>
                      <td>{proveedor.nombre_}</td>
                      <td>{proveedor.contacto_}</td>
                      <td>
                        {proveedor.productos_.length > 0
                          ? proveedor.productos_.join(', ') // Lista separada por comas
                          : 'Sin productos'}
                      </td>
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

export default ProveedorAdmin;
