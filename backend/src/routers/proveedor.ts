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
import { proveedorModel } from '../models/proveedor.js'

export const proveedorRouter = Express.Router();

/**
 * Busca los proveedores en la base de datos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con los proveedores encontrados o un mensaje de error
 */
proveedorRouter.get('/proveedores', async (req, res) => {
  req.query = { ...req.query };
  try {
    let proveedorsEncontrados = await proveedorModel.find(req.query);
    proveedorsEncontrados = proveedorsEncontrados.filter(x => x !== null);
    let condition: boolean = proveedorsEncontrados.length === 0;
    res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró a los proveedores' } : proveedorsEncontrados);
  } catch (error) {
    res.status(500).send({ msg: 'Error al buscar los proveedores', error: error });
  }
});

/**
 * Busca un proveedor en la base de datos por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el proveedor encontrado o un mensaje de error
 */
proveedorRouter.get('/proveedores/:id', async (req, res) => {
  try {
    let proveedorEncontrado = await proveedorModel.findOne({ id_: req.params.id });
    let condition: boolean = proveedorEncontrado === null;
    res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró al proveedor' } : proveedorEncontrado);
  } catch (error) {
    res.status(500).send({ msg: 'Error al buscar al proveedor', error: error });
  }
});

/**
 * Guarda un proveedor en la base de datos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el proveedor guardado o un mensaje de error
 */
proveedorRouter.post('/proveedores', async (req, res) => {
  try {
    const proveedor = new proveedorModel(req.body);
    await proveedor.save();
    res.send(proveedor)
  } catch (error) {
    res.status(500).send({ msg: 'Error al guardar el proveedor', error: error });
  }
});

/**
 * Actualiza un proveedor en la base de datos por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el proveedor actualizado o un mensaje de error
 */
proveedorRouter.patch('/proveedores/:id', async (req, res) => {
  try {
    const proveedorActualizado = await proveedorModel.findOneAndUpdate({ id_: req.params.id }, req.body , { new: true, runValidators: true});
    let condition: boolean = proveedorActualizado === null;
    res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró al proveedor' } : proveedorActualizado);
  } catch (error) {
    res.status(500).send({ msg: 'Error al actualizar al proveedor', error: error });
  }
});

/**
 * Elimina un proveedor en la base de datos por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el proveedor eliminado o un mensaje de error
 */
proveedorRouter.delete('/proveedores/:id', async (req, res) => {
  try {
    const proveedorEliminado = await proveedorModel.findOneAndDelete({ id_: req.params.id });
    let condition: boolean = proveedorEliminado === null;
    res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró al proveedor' } : proveedorEliminado);
  } catch (error) {
    res.status(500).send({ msg: 'Error al eliminar al proveedor', error: error });
  }
});