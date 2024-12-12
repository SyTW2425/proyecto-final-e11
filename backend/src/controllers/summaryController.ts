/**
 * Universidad de La Laguna
 * Asignatura: Sistemas y Tecnologías Web
 * Proyecto Final SyTW
 * Realizada por:
 *  > Antonio Ramos Castilla (alu0101480367@ull.edu.es)
 *  > Ithaisa Morales Arbelo (alu0101482194@ull.edu.es)
 *  > Valerio Luis Cabrera   (alu0101476049@ull.edu.es)
 */
import {Request, Response} from 'express';
import { ventaModel } from '../models/venta.js';
import { compraModel } from '../models/compra.js';
import { productoModel } from '../models/producto.js';
import { clienteModel } from '../models/cliente.js';


/**
 * Obtiene un resumen de la tienda
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el resumen de la tienda
 */
export const getSummary = async (_: Request, res: Response): Promise<void> => {
    try {
        const totalVentas = await ventaModel.aggregate([{ $group: { _id: null, importe_: { $sum: '$importe_' } } }]);
        const totalCompras = await compraModel.aggregate([{ $group: { _id: null, importe_: { $sum: '$importe_' } } }]);
        const productosEnStock = await productoModel.countDocuments({});
        const clientesRegistrados = await clienteModel.countDocuments({});
    
        res.json({
          totalVentas: totalVentas[0]?.importe_ || 0,
          totalCompras: totalCompras[0]?.importe_|| 0,
          productosEnStock,
          clientesRegistrados,
        });
      } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener datos del resumen.');
      }
}


export const obtenerDatosEstadisticas = async (_: Request, res: Response): Promise<void> => {
    try {
      // Agrupar ventas por mes
      const ventasPorMes = await ventaModel.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$fecha_' } }, // Agrupar por año y mes
            importe_: { $sum: '$importe_' },
          },
        },
        { $sort: { _id: 1 } } // Ordenar por fecha ascendente
      ]);
  
      // Agrupar compras por mes
      const comprasPorMes = await compraModel.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$fecha_' } }, // Agrupar por año y mes
            importe_: { $sum: '$importe_' },
          },
        },
        { $sort: { _id: 1 } } // Ordenar por fecha ascendente
      ]);
  
      res.json({ ventas: ventasPorMes, compras: comprasPorMes });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
  };
  
