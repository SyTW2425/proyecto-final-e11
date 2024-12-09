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
import { fechaModel } from '../models/fechas.js';

export const fechaRouter = Express.Router();

/**
 * Busca a todas las fechas en la base de datos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con las fechas encontradas o un mensaje de error
 */
fechaRouter.get('/fechas', async (req, res) => {
  req.query = { ...req.query };
  try {
    let fechasEncontradas = await fechaModel.find(req.query);
    fechasEncontradas = fechasEncontradas.filter(x => x !== null);
    let condition: boolean = fechasEncontradas.length === 0;
    res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró a las fechas' } : fechasEncontradas);
  } catch (error) {
    res.status(500).send({ msg: 'Error al buscar las fechas', error: error });
  }
});

/**
 * Guarda una fecha en la base de datos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con la fecha guardada o un mensaje de error
 */
fechaRouter.post('/fechas', async (req, res) => {
  try {
    const fecha = new fechaModel(req.body);
    await fecha.save();
    res.send(fecha);
  } catch (error) {
    res.status(500).send({ msg: 'Error al guardar la fecha', error: error });
  }
});


fechaRouter.delete('/fechas', async (req, res) => {
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
});

// /**
//  * Elimina una fecha de la base de datos
//  * @param {Object} req - Objeto de petición
//  * @param {Object} res - Objeto de respuesta
//  * @returns {Object} - Objeto JSON con la fecha eliminada o un mensaje de error
//  */
// fechaRouter.delete('/fechas/:fecha', async (req, res) => {
//   try {
//     const fechaEliminada = await fechaModel.findOneAndDelete({ fecha_: req.params.fecha });
//     let condition: boolean = fechaEliminada === null;
//     res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró la fecha' } : fechaEliminada);
//   } catch (error) {
//     res.status(500).send({ msg: 'Error al eliminar la fecha', error: error });
//   }
// });