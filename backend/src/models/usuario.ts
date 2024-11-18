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
 * Interfaz que representa un usuario
 */
export interface UsuarioDocumentInterface extends Document {
  id_: string,
  nombre_: string,
  contacto_: number,
  claves_: [string, string], // nombre de usuario y contraseña
  rol_: string
}

/**
 * Esquema de la colección de Usuarios
 */
export const UsuarioSchema = new Schema<UsuarioDocumentInterface>({
  id_: {
    type: String,
    unique: true,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El ID de un usuario no puede ser vacío.');
      }
      if (value.length !== 9) {
        throw new Error('El ID de un usuario debe tener 9 caracteres.');
      }
      if (!/^\d{8}\w{1}$/.test(value)) {
        throw new Error('El ID de un usuario debe tener un formato válido: [8 dígitos][1 letras mayúsculas].');
      }
    }
  },
  nombre_: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El nombre de un usuario no puede ser vacío.');
      }
      if (/\d/.test(value)) {
        throw new Error('El nombre de un usuario no puede contener números.');
      }
      if (!/^[A-Z]/.test(value)) {
        throw new Error('El nombre de un usuario debe empezar por mayúscula.');
      }
    } 
  },
  contacto_: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('El contacto de un usuario no puede ser negativo.');
      }
      if (value % 1 !== 0) {
        throw new Error('El contacto de un usuario no puede ser un número decimal.');
      }
      if (value.toString().length !== 9) {
        throw new Error('El contacto de un usuario debe tener 9 dígitos.');
      }
      if (!/^[6-9]/.test(value.toString())) {
        throw new Error('El contacto de un usuario debe empezar por 6,7,8 9.');
      }
    }
  },
  claves_: {
    type: [String, String],
    required: true,
    unique: true,
    validate: (value: [string, string]) => {
      if (value[0].length === 0 || value[1].length === 0) {
        throw new Error('Las claves de un usuario no pueden ser vacías.');
      }
      if (value[0] === value[1]) {
        throw new Error('Las claves de un usuario NO deben coincidir.');
      }
    }
  },
  rol_: {
    type: String,
    enum: ['administrador', 'usuario', 'atención al cliente', 'gestor de almacén'],
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El rol de un usuario no puede ser vacío.');
      }
    }
  }
});

/**
 * Exportación del modelo de la colección de Usuarios
 */
export const usuarioModel = model<UsuarioDocumentInterface>('Usuarios', UsuarioSchema);