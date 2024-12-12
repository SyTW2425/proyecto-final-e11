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
import { getUsuarioClaves,
          getUsuarios,
          getUsuariosID,
          postUsuariosLogin,
          postUsuarios,
          patchUsuariosID,
          deleteUsuariosID } from '../controllers/usuarioController.js';


export const usuarioRouter = Express.Router();


usuarioRouter.get('/usuarios/claves', getUsuarioClaves);
usuarioRouter.get('/usuarios', getUsuarios);
usuarioRouter.get('/usuarios/:id', getUsuariosID);
usuarioRouter.post('/usuarios', postUsuarios);
usuarioRouter.post('/login', postUsuariosLogin);
usuarioRouter.patch('/usuarios/:id', patchUsuariosID);
usuarioRouter.delete('/usuarios/:id', deleteUsuariosID);