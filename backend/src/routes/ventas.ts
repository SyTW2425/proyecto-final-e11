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
import { getVentas,
  getVentasID,
  postVentas,
  deleteVentasID } from '../controllers/ventaController.js';

export const ventaRouter = Express.Router();


ventaRouter.get('/ventas', getVentas);
ventaRouter.get('/ventas/:id', getVentasID);
ventaRouter.post('/ventas', postVentas);
ventaRouter.delete('/ventas/:id', deleteVentasID);