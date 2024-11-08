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
import { usuarioRouter } from './routers/usuario.js';
// import { usuarioModel } from './models/usuario.js';

// Load environment variables from .env file
dotenv.config({ path: './config/dev.env' });

// Initialize the express server
export const app = express();
app.use(express.json());
// app.use(productoRouter);
// app.use(proveedorRouter);
app.use(usuarioRouter);
// app.use(clienteRouter);
// app.use(compraRouter);
// app.use(ventaRouter);
console.log('[server_initiation] Server started!');
console.log('MONGO_URL:', process.env.MONGO_URL);
app.listen(process.env.PORT || 27017);


// Connect to Database
connect(process.env.MONGO_URL!).then(() => {
  console.log('Connected to the database');
  
}).catch((error) => {
  console.error('Something went wrong when connecting to the database', error);
  process.exit(-1);
});