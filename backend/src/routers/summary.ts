/**
 * Universidad de La Laguna
 * Asignatura: Sistemas y Tecnologías Web
 * Proyecto Final SyTW
 * Realizada por:
 *  > Antonio Ramos Castilla (alu0101480367@ull.edu.es)
 *  > Ithaisa Morales Arbelo (alu0101482194@ull.edu.es)
 *  > Valerio Luis Cabrera   (alu0101476049@ull.edu.es)
 */
import Express from 'express';
import { ventaModel } from '../models/venta.js';
import { compraModel } from '../models/compra.js';
import { productoModel } from '../models/producto.js';
import { clienteModel } from '../models/cliente.js';

export const summaryRouter = Express.Router();
summaryRouter.get('/summary', async (_, res) => {
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
  });


