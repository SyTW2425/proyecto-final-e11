/**
 * Universidad de La Laguna
 * Asignatura: Sistemas y Tecnologías Web
 * Proyecto Final SyTW
 * Realizada por:
 *  > Antonio Ramos Castilla (alu0101480367@ull.edu.es)
 *  > Ithaisa Morales Arbelo (alu0101482194@ull.edu.es)
 *  > Valerio Luis Cabrera   (alu0101476049@ull.edu.es)
 */
import { Document, model, Schema } from 'mongoose';

/**
 * Interfaz que representa un producto
 */
export interface ProductoDocumentInterface extends Document {
  id_: string,
  nombre_: string,
  stock_: number,
  precio_venta_: number
}

/**
 * Esquema de la colección de Producto
 */
const ProductoSchema = new Schema<ProductoDocumentInterface>({
  id_: {
    type: String,
    unique: true,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El ID de un producto no puede ser vacío.');
      }
      if (/[a-zA-Z]/.test(value)) {
        throw new Error('El ID de un producto no puede contener letras.');
      }
    }
  },
  nombre_: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El nombre de un producto no puede ser vacío.');
      }
      if (/\d/.test(value)) {
        throw new Error('El nombre de un producto no puede contener números.');
      }
    } 
  },
  stock_: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('El stock de un producto no puede ser negativo.');
      }
    }
  },
  precio_venta_: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('El precio de venta de un producto no puede ser negativo.');
      }
    }
  }
});

/**
 * Exportación del modelo de la colección de Producto
 */
export const productoModel = model<ProductoDocumentInterface>('Producto', ProductoSchema);