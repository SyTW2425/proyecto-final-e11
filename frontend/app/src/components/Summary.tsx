import React from 'react';
import styles from '../assets/styles/template.module.css';

const Summary: React.FC = () => (
  <div className={styles.summary}>
    <div className={styles.card}>
      <h3>Total Ventas</h3>
      <p>$12,345</p>
    </div>
    <div className={styles.card}>
      <h3>Total Compras</h3>
      <p>$8,567</p>
    </div>
    <div className={styles.card}>
      <h3>Productos en Stock</h3>
      <p>1,234</p>
    </div>
    <div className={styles.card}>
      <h3>Clientes Registrados</h3>
      <p>345</p>
    </div>
  </div>
);

export default Summary;
