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
import { ventaModel } from './venta.js';


/**
 * Interfaz que representa un cliente
 */
export interface ClienteDocumentInterface extends Document {
  id_: string,
  nombre_: string,
  contacto_: number,
  compras_: [number],  // Compras hechas por clientes, referido a nuestras ventas
  membresia_: boolean
}

/**
 * Esquema de la colección de Clientes
 */
const ClienteSchema = new Schema<ClienteDocumentInterface>({
  id_: {
    type: String,
    unique: true,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El ID de un cliente no puede ser vacío.');
      }
      if (value.length !== 9) {
        throw new Error('El ID de un cliente debe tener 9 caracteres.');
      }
      if (!/^\d{8}\w{1}$/.test(value)) {
        throw new Error('El ID de un cliente debe tener un formato válido: [8 dígitos][1 letras mayúsculas].');
      }
    }
  },
  nombre_: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El nombre de un cliente no puede ser vacío.');
      }
      if (/\d/.test(value)) {
        throw new Error('El nombre de un cliente no puede contener números.');
      }
      if (!/^[A-Z]/.test(value)) {
        throw new Error('El nombre de un cliente debe empezar por mayúscula.');
      }
    } 
  },
  contacto_: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('El contacto de un cliente no puede ser negativo.');
      }
      if (value % 1 !== 0) {
        throw new Error('El contacto de un cliente no puede ser un número decimal.');
      }
      if (value.toString().length !== 9) {
        throw new Error('El contacto de un cliente debe tener 9 dígitos.');
      }
      if (!/^[6-9]/.test(value.toString())) {
        throw new Error('El contacto de un cliente debe empezar por 6,7,8 9.');
      }
    }
  },
  compras_: {
    type: [Number],
    required: true,
    validate: {
      validator: async function(value: number[]): Promise<boolean> {
        // Si compras_ está vacío, return true
        if (value.length === 0) {
          return true;
        }
        // Busca la venta en la base de datos
        const venta = await ventaModel.find({ id_: { $in: value } });
        return venta.length === value.length;
      },
      message: props => `La venta asociada con ID ${props.value} no existe en la base de datos.`
    }
  },
  membresia_: {
    type: Boolean,
    required: true
  }
});

/**
 * Exportación del modelo de la colección de Cliente
 */
export const clienteModel = model<ClienteDocumentInterface>('Clientes', ClienteSchema);