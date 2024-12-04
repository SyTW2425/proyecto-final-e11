import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Estilo para el calendario
import { format, parse, startOfWeek, getDay } from 'date-fns'; // Utilizamos date-fns para manejar fechas
import { enUS } from 'date-fns/locale'; // Localización en español
import styles from '../assets/styles/template.module.css';
import { useNavigate, Link } from 'react-router-dom'; // Importar el hook useNavigate
import LogoutButton from './logout';
import axios from 'axios';
import { formatISO } from 'date-fns';

// Configuración del localizador de fechas con `date-fns`
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: { enUS }, // Aseguramos que el calendario está en español
});

const StockCalendarAdmin: React.FC = () => {
    // Estado para almacenar las fechas seleccionadas para reposición
    const [events, setEvents] = useState<any[]>([]);
    const navigate = useNavigate();
    const [markDates, setMarkDates] = useState<Date[]>([]);
    const [fecha, setFecha] = useState('');
const [fechaEliminar, setFechaEliminar] = useState('');
const [mostrarFormularioFecha, setMostrarFormularioFecha] = useState(false);
const [mostrarFormularioEliminarFecha, setMostrarFormularioEliminarFecha] = useState(false);


const manejarEnvioCrearFecha = (e: React.FormEvent) => {
  e.preventDefault();
  if (!fecha) {
    alert('Por favor, ingresa una fecha válida.');
    return;
  }
  const fechaSoloDia = new Date(fecha).toISOString().split('T')[0]; // Esto eliminará la parte de la hora
  axios
    .post('http://localhost:5000/fechas', { fecha_: fechaSoloDia })
    .then((response) => {
      alert('Fecha creada correctamente');
      setMostrarFormularioFecha(false);
      setFecha('');
      fetchMarkDates();
    })
    .catch((error) => {
      console.error('Error al crear la fecha:', error);
      alert('Hubo un error al crear la fecha');
    });
};

const fetchMarkDates = async () => {
    try {
      const response = await fetch('http://localhost:5000/fechas');
      const data = await response.json();
      const fechas = data.map((item: { fecha_: string }) => new Date(item.fecha_));
      setMarkDates(fechas);
    } catch (error) {
      console.error('Error al obtener las fechas de reposición:', error);
    }
  };
// Función para manejar el envío del formulario de eliminar fecha
const manejarEnvioEliminarFecha = (e: React.FormEvent) => {
  e.preventDefault();

  if (!fechaEliminar) {
    alert('Por favor, ingresa una fecha válida para eliminar.');
    return;
  }

  // Aquí puedes agregar la lógica para eliminar la fecha del backend
  axios
    .delete(`http://localhost:5000/fechas/${fechaEliminar}`)
    .then(() => {
      alert('Fecha eliminada correctamente');
      setMostrarFormularioEliminarFecha(false);
      setFechaEliminar('');
      fetchMarkDates();
    })
    .catch((error) => {
      console.error('Error al eliminar la fecha:', error);
      alert('Hubo un error al eliminar la fecha');
    });
};

    // Función para convertir las fechas de reposición a eventos del calendario
    const getEvents = () => {
        return markDates.map((date) => ({
            title: 'Reponer stock',
            start: date,
            end: date,
            allDay: true,
            style: { backgroundColor: '#ffcc00' }, // Color amarillo para las fechas de reposición
        }));
    };

    useEffect(() => {
        const fetchMarkDates = async () => {
            try {
                const response = await fetch('http://localhost:5000/fechas'); // Endpoint de la API para obtener las fechas

                const data = await response.json(); // Suponiendo que la respuesta sea un JSON con las fechas
                const fechas = data.map((item: { fecha_: string }) => new Date(item.fecha_)); // Convertir el string de fecha a objeto Date

                setMarkDates(fechas)// Actualizar el estado con las fechas obtenidas
            } catch (error) {
                console.error('Error al obtener las fechas de reposición:', error);
            }
        };

        fetchMarkDates(); // Llamar a la función para obtener las fechas
    }, [])
    useEffect(() => {
        setEvents(getEvents()); // Establece los eventos al cargar el componente
    }, [markDates]);

    const goToClientes = () => {
        navigate('/cliente');
    };
    const goToProveedores = () => {
        navigate('/proveedor');
    };
    const goToInventario = () => {
        navigate('/inventario');
    };
    const goToVentas = () => {
        navigate('/venta');
    };
    const goToCompras = () => {
        navigate('/compra');
    };
    const goToCalendario = () => {
        navigate('/calendario');
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
                        <span className={styles.title}>Calendario de Reposición de Stock: Administrador</span>
                        <Link to="/template" className={styles.navButton}>
                            <img
                                src="home.png"
                                alt="Template"
                                className={styles.navImage}
                            />
                        </Link>
                    </div>
                </nav>

                <div className={styles.buttonContainer}>
                    <button
                        className={styles.actionButton}
                        onClick={() => setMostrarFormularioFecha(true)}
                    >
                        Crear nueva fecha
                    </button>
                    <button
                        className={styles.actionButton}
                        onClick={() => setMostrarFormularioEliminarFecha(true)}
                    >
                        Eliminar fecha
                    </button>
                </div>
                {mostrarFormularioFecha && (
  <form onSubmit={manejarEnvioCrearFecha} className={styles.formularioContainer}>
    <h2 className={styles.formTitle}>Crear Nueva Fecha</h2>
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>Fecha:</label>
      <input
        type="date"
        name="fecha"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        className={styles.formInput}
        required
      />
    </div>
    <div className={styles.formButtonGroup}>
      <button type="submit" className={styles.formButton}>
        Crear Fecha
      </button>
      <button
        type="button"
        onClick={() => setMostrarFormularioFecha(false)}
        className={styles.formButtonCancel}
      >
        Cancelar
      </button>
    </div>
  </form>
)}
{mostrarFormularioEliminarFecha && (
  <form onSubmit={manejarEnvioEliminarFecha} className={styles.formularioContainer}>
    <h2 className={styles.formTitle}>Eliminar Fecha</h2>
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>Fecha a Eliminar:</label>
      <input
        type="date"
        name="fechaEliminar"
        value={fechaEliminar}
        onChange={(e) => setFechaEliminar(e.target.value)}
        className={styles.formInput}
        required
      />
    </div>
    <div className={styles.formButtonGroup}>
      <button type="submit" className={styles.formButton}>
        Eliminar Fecha
      </button>
      <button
        type="button"
        onClick={() => setMostrarFormularioEliminarFecha(false)}
        className={styles.formButtonCancel}
      >
        Cancelar
      </button>
    </div>
  </form>
)}


                <div className={styles.calendarContainer}>
                    <div className={styles.calendarInfo}>
                        <p>Las fechas marcadas indican días en los que debes reponer stock.</p>
                    </div>

                    <div className={styles.calendarWrapper}>
                        <Calendar
                            localizer={localizer} // Localizador con date-fns
                            events={events} // Eventos con las fechas marcadas
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: '80vh' }} // Altura del calendario
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StockCalendarAdmin;
