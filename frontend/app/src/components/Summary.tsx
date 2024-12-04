import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../assets/styles/template.module.css';

const Summary: React.FC = () => {
  const [data, setData] = useState({
    totalVentas: 0,
    totalCompras: 0,
    productosEnStock: 0,
    clientesRegistrados: 0,
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/summary');
        setData(response.data);
      } catch (error) {
        console.error('Error al obtener datos del backend', error);
      }
    };

    fetchData();
  }, []);
  return (
  <div className={styles.summary}>
    <div className={styles.card}>
      <h3>Total Ventas</h3>
      <p>${data.totalVentas.toLocaleString()}</p>
    </div>
    <div className={styles.card}>
      <h3>Total Compras</h3>
      <p>${data.totalCompras.toLocaleString()}</p>
    </div>
    <div className={styles.card}>
      <h3>Productos en Stock</h3>
      <p>{data.productosEnStock.toLocaleString()}</p>
    </div>
    <div className={styles.card}>
      <h3>Clientes Registrados</h3>
      <p>{data.clientesRegistrados.toLocaleString()}</p>
    </div>
  </div>
)};

export default Summary;
