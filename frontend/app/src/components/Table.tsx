import React from 'react';
import styles from '../assets/styles/template.module.css';

const Table: React.FC = () => (
  <div className={styles.tableContainer}>
    <table className={styles.styledTable}>
      <thead>
        <tr>
          <th>Producto</th>
          <th>Stock</th>
          <th>Precio</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Producto 1</td>
          <td>50</td>
          <td>$10.00</td>
        </tr>
        <tr>
          <td>Producto 2</td>
          <td>30</td>
          <td>$15.00</td>
        </tr>
        <tr>
          <td>Producto 3</td>
          <td>20</td>
          <td>$20.00</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default Table;