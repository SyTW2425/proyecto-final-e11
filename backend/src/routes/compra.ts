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
import { getCompras,
          getComprasID,
          postCompras,
          deleteComprasID } from '../controllers/compraController.js';

export const compraRouter = Express.Router();

compraRouter.get('/compras', getCompras);
compraRouter.get('/compras/:id', getComprasID);
compraRouter.post('/compras', postCompras);
compraRouter.delete('/compras/:id', deleteComprasID);