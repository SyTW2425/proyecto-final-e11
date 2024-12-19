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
import { obtenerProductosMenorStock,
       getProductos,
        getProductosID,
        postProductos,
        patchProductosID,
        deleteProductosID
 } from '../controllers/productoController.js';

export const productoRouter = Express.Router();
productoRouter.get('/productos', getProductos);
productoRouter.get('/productos/:id', getProductosID);
productoRouter.post('/productos', postProductos);
productoRouter.patch('/productos/:id', patchProductosID);
productoRouter.delete('/productos/:id', deleteProductosID);
productoRouter.get('/menorStock', obtenerProductosMenorStock);

