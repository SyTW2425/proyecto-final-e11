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
import { getProveedores,
          getProveedoresID,
          postProveedores,
          patchProveedoresID,
          deleteProveedoresID } from '../controllers/proveedorController.js';

export const proveedorRouter = Express.Router();


proveedorRouter.get('/proveedores', getProveedores);
proveedorRouter.get('/proveedores/:id', getProveedoresID);
proveedorRouter.post('/proveedores', postProveedores);
proveedorRouter.patch('/proveedores/:id', patchProveedoresID);
proveedorRouter.delete('/proveedores/:id', deleteProveedoresID);