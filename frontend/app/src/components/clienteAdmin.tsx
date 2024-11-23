import React, { useEffect, useState } from 'react';
import styles from '../assets/styles/template.module.css';
import LogoutButton from './logout';
import axios from 'axios';


/*interface Cliente {
  id_: string;
  nombre_: string;
  contacto_: number;
  compras_: string[];
  membresia_: boolean;
}*/

const ClienteAdmin: React.FC = () => {
  const [clientes, setClientes] = useState<any[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false); // Estado para controlar la visibilidad del formulario
  const [nuevoCliente, setNuevoCliente] = useState({
    id_: '',
    nombre_: '',
    contacto_: '',
    compras_: [] as number[],
    membresia_: false,
  });
  //const [dniAEliminar, setDniAEliminar] = useState<string>(''); // Estado para almacenar el DNI a eliminar

 
  useEffect(() => {
    // Consumir API
    fetch('http://localhost:5000/clientes') 
      .then((response) => response.json())
      .then((data) => setClientes(data))
      .catch((error) => console.error('Error al cargar los datos:', error));
  }, []);

  const manejarCambioFormulario = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'compras_') {
      setNuevoCliente((prevState) => ({
        ...prevState,
        [name]: value.split(',').map((item) => parseInt(item.trim(), 10)).filter((item) => !isNaN(item)),
      }));
    } else {
      setNuevoCliente((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const manejarEnvioFormulario = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nuevoCliente.id_ || !nuevoCliente.nombre_ || !nuevoCliente.contacto_) {
      alert('Por favor, rellena todos los campos');
      return;
    }
    
    const nuevoCliente2 = {
      id_: nuevoCliente.id_,
      nombre_: nuevoCliente.nombre_,
      contacto_: nuevoCliente.contacto_,
      compras_: nuevoCliente.compras_,
      membresia_: nuevoCliente.membresia_,
    };
    alert(JSON.stringify(nuevoCliente2, null, 2))
    // Enviar el nuevo cliente al servidor como json
    axios.post('http://localhost:5000/clientes', nuevoCliente2)
    .then((response) => {
      // Añadir el nuevo cliente al estado
      alert("Respuesta del backend:" + response.data);
      setClientes((prevClientes) => [...prevClientes, response.data]);
      alert('Cliente creado correctamente');
      setMostrarFormulario(false); // Ocultar el formulario después de enviar
    })
    .catch((error) => {
      alert('Hubo un error al crear el cliente');
    });
};

  const handleCrearCliente = () => {
    alert('Función para crear un nuevo cliente');
    // Aquí puedes redirigir a un formulario para crear un cliente
  };

  const handleEditarCliente = () => {
    alert('Función para editar un cliente existente');
    // Aquí puedes implementar lógica para seleccionar y editar un cliente
  };


  const handleBuscarCliente = () => {
    alert('Función para buscar un cliente');
    // Aquí puedes implementar lógica para buscar clientes
  };

  const handleEliminarCliente = () => {
    // Pedir al usuario el DNI del cliente que quiere eliminar
    const dniCliente = prompt('Introduce el DNI del cliente que deseas eliminar:');
    axios
          .delete(`http://localhost:5000/clientes/${dniCliente}`)
          .then(() => {
            // Filtrar el cliente eliminado del estado
            setClientes((prevClientes) =>
              prevClientes.filter((cliente) => cliente.id_ !== dniCliente)
            );
            alert('Cliente eliminado correctamente');
          })
          .catch((error) => {
            console.error('Error al eliminar el cliente:', error);
            alert('Hubo un error al eliminar el cliente');
          });
    };
  

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
         {/* Sección de botones */}
         <div className={styles.buttonContainer}>
         <button className={styles.actionButton} onClick={() => setMostrarFormulario(!mostrarFormulario)}>Crear nuevo cliente</button>
          <button className={styles.actionButton} onClick={handleEditarCliente}>
            Editar cliente existente
          </button>
          <button className={styles.actionButton} onClick={handleEliminarCliente}>
            Eliminar cliente
          </button>
          
          <button className={styles.actionButton} onClick={handleBuscarCliente}>
            Buscar cliente
          </button>
        </div>
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
        value={nuevoCliente.compras_.join(',')}
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

            
            {/* Contenido de la página */}
            <div className={styles.content}>
              <h1>Página de clientes pa administradores</h1>
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

export default ClienteAdmin;
