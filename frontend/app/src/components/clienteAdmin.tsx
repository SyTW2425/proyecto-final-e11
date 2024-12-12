import React, { useEffect, useState } from 'react';
import styles from '../assets/styles/template.module.css';
import LogoutButton from './logout';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const ClienteAdmin: React.FC = () => {
  const [clientes, setClientes] = useState<any[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarFormularioEliminar, setMostrarFormularioEliminar] = useState(false);
  const [dniEliminar, setDniEliminar] = useState<string>(''); // Estado para almacenar el DNI
  const [mostrarFormularioBuscar, setMostrarFormularioBuscar] = useState(false); // Visibilidad del formulario de búsqueda
  const [dniBuscar, setDniBuscar] = useState<string>(''); // DNI del cliente a buscar
  const [clienteEncontrado, setClienteEncontrado] = useState<any | null>(null); // Datos del cliente encontrado
  const [mostrarFormularioEditar, setMostrarFormularioEditar] = useState(false);
  const [mostrarFormularioSolicitarDni, setMostrarFormularioSolicitarDni] = useState(false);
  const [clienteAEditar, setClienteAEditar] = useState<any | null>({
    id_: '',
    nombre_: '',
    contacto_: '',
    compras_: '',
    membresia_: false,
  });
  const [dniEditar, setDniEditar] = useState<string>('');

  // Estado para controlar la visibilidad del formulario
  const [nuevoCliente, setNuevoCliente] = useState({
    id_: '',
    nombre_: '',
    contacto_: '',
    compras_: '',
    membresia_: false,
  });
  //const [dniAEliminar, setDniAEliminar] = useState<string>(''); // Estado para almacenar el DNI a eliminar


  useEffect(() => {
    // Consumir API
    fetch('http://localhost:5000/clientes')
      .then((response) => response.json())
      .then((data) => {
        // Asegurarte de que los datos son un array
        if (Array.isArray(data)) {
          setClientes(data);
        } else {
          console.error('El formato de los datos no es válido:', data);
          setClientes([]); // Fallback a un array vacío
        }
      })
      .catch((error) => {
        console.error('Error al cargar los datos:', error);
        setClientes([]); // Fallback a un array vacío en caso de error
      });
  }, []);


  const manejarCambioFormulario = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setNuevoCliente((prevState) => ({
      ...prevState,
      [name]: value,
    }));

  };

  const manejarEnvioFormulario = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nuevoCliente.id_ || !nuevoCliente.nombre_ || !nuevoCliente.contacto_) {
      alert('Por favor, rellena todos los campos');
      return;
    }
    const comprasArray = nuevoCliente.compras_
      .split(',')
      .map((item: string) => parseInt(item.trim(), 10))
      .filter((item: number) => !isNaN(item));

    // if (nuevoCliente.compras_.length === 0) {
    //   alert('El campo "Compras" debe contener al menos un número válido.');
    //   return;
    // }
    const nuevoCliente2 = {
      ...nuevoCliente,
      compras_: comprasArray,
    };


    // Enviar el nuevo cliente al servidor como json
    axios.post('http://localhost:5000/clientes', nuevoCliente2)
      .then((response) => {
        // Añadir el nuevo cliente al estado
        setClientes((prevClientes) => [...prevClientes, response.data]);
        alert('Cliente creado correctamente');
        setMostrarFormulario(false); // Ocultar el formulario después de enviar
      })
      .catch((error) => {
        alert('Hubo un error al crear el cliente. Parámetros no válidos');
      });
  };

  const manejarEnvioEliminarCliente = (e: React.FormEvent) => {
    e.preventDefault();

    if (!dniEliminar) {
      alert('Por favor, ingresa un DNI válido.');
      return;
    }

    axios
      .delete(`http://localhost:5000/clientes/${dniEliminar}`)
      .then(() => {
        setClientes((prevClientes) =>
          prevClientes.filter((cliente) => cliente.id_ !== dniEliminar)
        );
        alert('Cliente eliminado correctamente');
        setMostrarFormularioEliminar(false); // Ocultar formulario tras la eliminación
        setDniEliminar(''); // Limpiar el campo
      })
      .catch((error) => {
        alert('El cliente a eliminar no existe');
      });
  };


  const manejarCambioEdicion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setClienteAEditar((prevState: typeof clienteAEditar) => {
      if (name === 'membresia_') {
        return {
          ...prevState,
          [name]: e.target.checked
        };
      } else {
        return {
          ...prevState,
          [name]: value
        };
      }
    });
  };



  const manejarEnvioSolicitarDni = (e: React.FormEvent) => {
    e.preventDefault();

    if (!dniEditar) {
      alert('Por favor, ingresa un DNI válido.');
      return;
    }

    const cliente = clientes.find((cliente) => cliente.id_ === dniEditar);
    if (cliente) {
      setClienteAEditar(cliente);
      setMostrarFormularioSolicitarDni(false);
      setMostrarFormularioEditar(true);
    } else {
      alert('Cliente no encontrado.');
    }
  };

  const manejarEnvioBuscarCliente = (e: React.FormEvent) => {
    e.preventDefault();

    if (!dniBuscar) {
      alert('Por favor, ingresa un DNI válido.');
      return;
    }

    // Hacer la solicitud al backend para buscar el cliente
    axios
      .get(`http://localhost:5000/clientes/${dniBuscar}`)
      .then((response) => {
        setClienteEncontrado(response.data); // Guardar los datos del cliente encontrado
      })
      .catch((error) => {
        console.error('Error al buscar el cliente:', error);
        setClienteEncontrado(null); // Si no se encuentra, vaciar el cliente
        alert('Cliente no encontrado');
      });
  };


  const manejarEnvioEdicion = async (e: React.FormEvent) => {
    e.preventDefault();

    const { id_, nombre_, contacto_, compras_ } = clienteAEditar;
    if (!id_ || !nombre_ || !contacto_) {
      alert('Por favor, rellena todos los campos obligatorios (ID, nombre y contacto).');
      return;
    }
    const comprasArray = compras_
      .split(',')
      .map((item: string) => parseInt(item.trim(), 10))
      .filter((item: number) => !isNaN(item));

    if (compras_.length === 0) {
      alert('El campo "Compras" debe contener al menos un número válido.');
      return;
    }
    const nuevoCliente2 = {
      ...clienteAEditar,
      compras_: comprasArray,
    };

    const clienteParaGuardar = { ...nuevoCliente2 };

    try {
      const response = await axios.patch(`http://localhost:5000/clientes/${id_}`, clienteParaGuardar);

      setClientes((prevClientes) =>
        prevClientes.map((cliente) =>
          cliente.id_ === clienteAEditar.id_ ? response.data : cliente
        )
      );

      alert('Cliente actualizado correctamente');
      setMostrarFormularioEditar(false);
    } catch (error) {
      alert('Hubo un error al actualizar el cliente. Parámetros no válidos.');
    }
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
            <span className={styles.title}>Clientes: Administrador</span>
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
          <button className={styles.actionButton} onClick={() => setMostrarFormulario(!mostrarFormulario)}>Crear nuevo cliente</button>
          <button
            className={styles.actionButton}
            onClick={() => setMostrarFormularioSolicitarDni(true)}
          >
            Editar cliente
          </button>
          <button
            className={styles.actionButton}
            onClick={() => setMostrarFormularioEliminar(true)}
          >
            Eliminar cliente
          </button>


          <button
            className={styles.actionButton}
            onClick={() => setMostrarFormularioBuscar(true)}
          > Buscar cliente</button>
        </div>

        {mostrarFormularioEliminar && (
          <form onSubmit={manejarEnvioEliminarCliente} className={styles.formularioContainer}>
            <h2 className={styles.formTitle}>Eliminar Cliente</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>DNI del Cliente:</label>
              <input
                type="text"
                name="dniEliminar"
                value={dniEliminar}
                onChange={(e) => setDniEliminar(e.target.value)}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formButtonGroup}>
              <button type="submit" className={styles.formButton}>
                Eliminar Cliente
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
            <h2 className={styles.formTitle}>Crear Nuevo Cliente</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>DNI:</label>
              <input
                type="text"
                name="id_"
                value={nuevoCliente.id_}
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
                value={nuevoCliente.nombre_}
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
                value={nuevoCliente.contacto_}
                onChange={manejarCambioFormulario}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Compras:</label>
              <input
                type="text"
                name="compras_"
                value={nuevoCliente.compras_}
                onChange={(e) => manejarCambioFormulario(e)}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroupCheckbox}>
              <label className={styles.formLabel}>Membresía:</label>
              <input
                type="checkbox"
                name="membresia_"
                checked={nuevoCliente.membresia_}
                onChange={() =>
                  setNuevoCliente((prevState) => ({
                    ...prevState,
                    membresia_: !prevState.membresia_,
                  }))
                }
                className={styles.formCheckbox}
              />
            </div>
            <div className={styles.formButtonGroup}>
              <button type="submit" className={styles.formButton}>
                Crear Cliente
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

        {mostrarFormularioSolicitarDni && (
          <form
            onSubmit={manejarEnvioSolicitarDni}
            className={styles.formularioContainer}
          >
            <h2 className={styles.formTitle}>Editar Cliente</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>DNI del Cliente:</label>
              <input
                type="text"
                name="dniEditar"
                value={dniEditar}
                onChange={(e) => setDniEditar(e.target.value)}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formButtonGroup}>
              <button type="submit" className={styles.formButton}>
                Continuar
              </button>
              <button
                type="button"
                onClick={() => setMostrarFormularioSolicitarDni(false)}
                className={styles.formButtonCancel}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
        {mostrarFormularioEditar && clienteAEditar && (
          <form
            onSubmit={manejarEnvioEdicion}
            className={styles.formularioContainer}
          >
            <h2 className={styles.formTitle}>Editar Cliente</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>DNI:</label>
              <input
                type="text"
                name="id_"
                value={clienteAEditar.id_}
                onChange={manejarCambioEdicion}
                className={styles.formInput}
                required
                readOnly
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nombre:</label>
              <input
                type="text"
                name="nombre_"
                value={clienteAEditar.nombre_}
                onChange={manejarCambioEdicion}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Contacto:</label>
              <input
                type="number"
                name="contacto_"
                value={clienteAEditar.contacto_}
                onChange={manejarCambioEdicion}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Compras:</label>
              <input
                type="text"
                name="compras_"
                value={clienteAEditar.compras_}
                onChange={manejarCambioEdicion}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroupCheckbox}>
              <label className={styles.formLabel}>Membresía:</label>
              <input
                type="checkbox"
                name="membresia_"
                checked={clienteAEditar.membresia_}
                onChange={(e) =>
                  setClienteAEditar((prevState: typeof clienteAEditar) => ({
                    ...prevState,
                    membresia_: e.target.checked,
                  }))
                }
                className={styles.formCheckbox}
              />
            </div>
            <div className={styles.formButtonGroup}>
              <button type="submit" className={styles.formButton}>
                Guardar Cambios
              </button>
              <button
                type="button"
                onClick={() => setMostrarFormularioEditar(false)}
                className={styles.formButtonCancel}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
        {mostrarFormularioBuscar && (
          <form onSubmit={manejarEnvioBuscarCliente} className={styles.formularioContainer}>
            <h2 className={styles.formTitle}>Buscar Cliente</h2>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>DNI del Cliente:</label>
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
                Buscar Cliente
              </button>
              <button
                type="button"
                onClick={() => {
                  setMostrarFormularioBuscar(false);
                  setClienteEncontrado(null);
                }}
                className={styles.formButtonCancel}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
        {clienteEncontrado && (
          <div className={styles.resultContainer}>
            <h2 className={styles.resultTitle}>Cliente Encontrado</h2>
            <div className={styles.resultCard}>
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>DNI:</span>
                <span className={styles.resultValue}>{clienteEncontrado.id_}</span>
              </div>
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Nombre:</span>
                <span className={styles.resultValue}>{clienteEncontrado.nombre_}</span>
              </div>
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Contacto:</span>
                <span className={styles.resultValue}>{clienteEncontrado.contacto_}</span>
              </div>
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Compras:</span>
                <span className={styles.resultValue}>
                  {clienteEncontrado.compras_.length > 0
                    ? clienteEncontrado.compras_.join(', ')
                    : 'Sin compras'}
                </span>
              </div>
              <div className={styles.resultRow}>
                <span className={styles.resultLabel}>Membresía:</span>
                <span className={styles.resultValue}>
                  {clienteEncontrado.membresia_ ? 'Sí' : 'No'}
                </span>
              </div>
            </div>
          </div>
        )}


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
                {clientes.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center' }}>No hay clientes</td>
                  </tr>
                ) : (
                  clientes.map((cliente) => (
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

export default ClienteAdmin;