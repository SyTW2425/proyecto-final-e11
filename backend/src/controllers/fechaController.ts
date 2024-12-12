/**
 * Universidad de La Laguna
 * Asignatura: Sistemas y Tecnologías Web
 * Proyecto Final SyTW
 * Realizada por:
 *  > Antonio Ramos Castilla (alu0101480367@ull.edu.es)
 *  > Ithaisa Morales Arbelo (alu0101482194@ull.edu.es)
 *  > Valerio Luis Cabrera   (alu0101476049@ull.edu.es)
 */

import {Request, Response} from 'express';
import {fechaModel} from '../models/fechas.js';


/**
 * Busca a todas las fechas en la base de datos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con las fechas encontradas o un mensaje de error
 */
export const getFechas = async (req: Request, res: Response): Promise<void> => {
    try {
        let fechasEncontradas = await fechaModel.find(req.query);
        fechasEncontradas = fechasEncontradas.filter(x => x !== null);
        let condition: boolean = fechasEncontradas.length === 0;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró a las fechas' } : fechasEncontradas);
      } catch (error) {
        res.status(500).send({ msg: 'Error al buscar las fechas', error: error });
      }
}

/**
 * Guarda una fecha en la base de datos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con la fecha guardada o un mensaje de error
 */
export const postFechas = async (req: Request, res: Response): Promise<void> => {
    try {
        const fecha = new fechaModel(req.body);
        await fecha.save();
        res.send(fecha);
    } catch (error) {
        res.status(500).send({ msg: 'Error al guardar la fecha', error: error });
    }
}

/**
 * Elimina una fecha de la base de datos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con la fecha eliminada o un mensaje de error
 */

export const deleteFechas = async (req: Request, res: Response): Promise<void> => {
    const { fecha_, descripcion_ } = req.body;
    try {
        const fechaEliminada = await fechaModel.findOneAndDelete({
            fecha_: fecha_,
            descripcion_: descripcion_,
        });
        let condition: boolean = fechaEliminada === null;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró la fecha' } : fechaEliminada);
    } catch (error) {
        res.status(500).send({ msg: 'Error al eliminar la fecha', error: error });
    }
}
