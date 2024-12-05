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



export interface  FechaInterface extends Document {
  fecha_ : Date;
}


const FechaSchema = new Schema<FechaInterface>({
    fecha_: {
        type: Date,
        required: true
    }
});


export const fechaModel = model<FechaInterface>('Fechas', FechaSchema);