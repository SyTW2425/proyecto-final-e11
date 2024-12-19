import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Estilo para el calendario
import { format, parse, startOfWeek, getDay } from 'date-fns'; // Utilizamos date-fns para manejar fechas
import { enUS } from 'date-fns/locale'; // Localización en español
import styles from '../assets/styles/template.module.css';
import { useNavigate, Link } from 'react-router-dom'; // Importar el hook useNavigate
import LogoutButton from './logout';

// Configuración del localizador de fechas con `date-fns`
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { enUS }, // Aseguramos que el calendario está en español
});

const StockCalendarUsuario: React.FC = () => {
  // Estado para almacenar las fechas seleccionadas para reposición
  const [events, setEvents] = useState<any[]>([]);
  const navigate = useNavigate();
  const [markDates, setMarkDates] = useState<any[]>([]);

  // Función para convertir las fechas de reposición a eventos del calendario
  const getEvents = () => {
    return markDates.map((item) => ({
      title: item.descripcion, 
      start: item.date, 
      end: item.date, 
      allDay: true,
      style: { backgroundColor: '#ffcc00' }, 
    }));
  };

  const fetchMarkDates = async () => {
    try {
      const response = await fetch('http://localhost:5000/fechas');
      const data = await response.json();
      
      // Recibimos la fecha y la descripción
      const fechas = data.map((item: any) => ({
        date: new Date(item.fecha_), 
        descripcion: item.descripcion_ 
      }));
  
      setMarkDates(fechas);
    } catch (error) {
      console.error('Error al obtener las fechas de reposición:', error);
    }
  };

  useEffect(() => {
    fetchMarkDates();
  }, []);

  useEffect(() => {
    setEvents(getEvents());
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
            <span className={styles.title}>Calendario de Reposición de Stock</span>
            <Link to="/template" className={styles.navButton}>
              <img
                src="home.png"
                alt="Template"
                className={styles.navImage}
              />
            </Link>
          </div>
        </nav>

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

export default StockCalendarUsuario;
