import React, { useState, useEffect } from 'react';
import styles from '../assets/styles/template.module.css';

interface Producto {
  nombre_: string;
  stock_: number;
  precio_venta_: number;
}

const Table: React.FC = () => {
  const [productos, setProductos] = useState<Producto[] | null>(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:5000/menorStock'); // Ajusta la ruta según tu API
        if (!response.ok) throw new Error('Error al obtener productos');
        const data: Producto[] = await response.json();
        setProductos(data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
        setProductos([]);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className={styles.tableContainer}>
      <div className={styles.stockWarning}>
          <p><strong>¡Cuidado!</strong> Estos productos tienen el menor stock en la base de datos y deben ser repuestos pronto.</p>
        </div>
      <table className={styles.styledTable}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Stock</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {productos === null ? (
            <tr>
              <td colSpan={3}>Cargando datos...</td>
            </tr>
          ) : productos.length === 0 ? (
            <tr>
              <td colSpan={3}>No hay productos en la base de datos.</td>
            </tr>
          ) : (
            productos.map((producto, index) => (
              <tr key={index}>
                <td>{producto.nombre_}</td>
                <td>{producto.stock_}</td>
                <td>${producto.precio_venta_.toFixed(2)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
