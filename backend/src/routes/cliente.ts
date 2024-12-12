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
import { getClientes,
          getClientesID,
          postClientes,
          patchClientesID,
          deleteClientesID } from '../controllers/clienteController.js';

          
export const clienteRouter = Express.Router();


clienteRouter.get('/clientes', getClientes);
clienteRouter.get('/clientes/:id', getClientesID);
clienteRouter.post('/clientes', postClientes);
clienteRouter.patch('/clientes/:id', patchClientesID);
clienteRouter.delete('/clientes/:id',deleteClientesID);