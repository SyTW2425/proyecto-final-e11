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
import { productoModel } from './producto.js';

/**
 * Interfaz que representa un proveedor
 */
export interface ProveedorDocumentInterface extends Document {
  id_: string,
  nombre_: string,
  contacto_: number,
  productos_: Array<number>
}

/**
 * Esquema de la colección de Proveedor
 */
const ProveedorSchema = new Schema<ProveedorDocumentInterface>({
  id_: {
    type: String,
    unique: true,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El ID de un proveedor no puede ser vacío.');
      }
      if (!/^[A-HJNP-SUVW]\d{7}[0-9A-J]$/.test(value)) {
        throw new Error('El ID de un proveedor debe tener un formato válido: [1 letras mayúsculas] [8 dígitos].');
      }
    }
  },
  nombre_: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El nombre de un proveedor no puede ser vacío.');
      }
      if (/\d/.test(value)) {
        throw new Error('El nombre de un proveedor no puede contener números.');
      }
      if (!/^[A-Z]/.test(value)) {
        throw new Error('El nombre de un proveedor debe empezar por mayúscula.');
      }
    } 
  },
  contacto_: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('El contacto de un proveedor no puede ser negativo.');
      }
      if (value % 1 !== 0) {
        throw new Error('El contacto de un proveedor no puede ser un número decimal.');
      }
      if (value.toString().length !== 9) {
        throw new Error('El contacto de un proveedor debe tener 9 dígitos.');
      }
      if (!/^[6-9]/.test(value.toString())) {
        throw new Error('El contacto de un proveedor debe empezar por 6,7,8 9.');
      }
    }
  },
  productos_: {
    type: [Number],
    required: true,
    default: [],
    validate: {
      validator: async function(value: number[]): Promise<boolean> {
        // Si compras_ está vacío, return true
        if (value.length === 0) {
          return true;
        }
        // Busca la venta en la base de datos
        const producto = await productoModel.find({ id_: { $in: value } });
        return producto.length === value.length;
      },
      message: props => `El producto asociado con ID ${props.value} no existe en la base de datos.`
    }
  }
});

/**
 * Exportación del modelo de la colección de Proveedor
 */
export const proveedorModel = model<ProveedorDocumentInterface>('Proveedores', ProveedorSchema);