/**
 * Universidad de La Laguna
 * Asignatura: Sistemas y Tecnologías Web
 * Proyecto Final SyTW
 * Realizada por:
 *  > Antonio Ramos Castilla (alu0101480367@ull.edu.es)
 *  > Ithaisa Morales Arbelo (alu0101482194@ull.edu.es)
 *  > Valerio Luis Cabrera   (alu0101476049@ull.edu.es)
 */
//import mongoose from 'mongoose';
import { connect } from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import { usuarioRouter } from './routes/usuario.js';
import { clienteRouter } from './routes/cliente.js';
import { proveedorRouter } from './routes/proveedor.js';
import { productoRouter } from './routes/producto.js';
import { compraRouter } from './routes/compra.js';
import { ventaRouter } from './routes/ventas.js';
import { summaryRouter } from './routes/summary.js';
import { fechaRouter } from './routes/fecha.js';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config({ path: './config/dev.env' });

// Connect to Database
connect(process.env.MONGO_URL!).then(() => {
  console.log('Connected to the database');
  
}).catch((error) => {
  console.error('Something went wrong when connecting to the database', error);
  process.exit(-1);
});

export const app = express();
app.listen(process.env.PORT || 27017);
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(productoRouter);
app.use(proveedorRouter);
app.use(usuarioRouter);
app.use(clienteRouter);
app.use(compraRouter);
app.use(ventaRouter);
app.use(summaryRouter);
app.use(fechaRouter);
console.log('[server_initiation] Server started!');
console.log('MONGO_URL:', process.env.MONGO_URL);