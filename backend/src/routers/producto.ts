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
import { productoModel } from '../models/producto.js'

export const productoRouter = Express.Router();


productoRouter.get('/productos', async (req, res) => {
  req.query = { ...req.query };
  try {
    let productosEncontrados = await productoModel.find(req.query);
    productosEncontrados = productosEncontrados.filter(x => x !== null);
    let condition: boolean = productosEncontrados.length === 0;
    res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró a los productos' } : productosEncontrados);
  } catch (error) {
    res.status(500).send({ msg: 'Error al buscar los productos', error: error });
  }
});


productoRouter.get('/productos/:id', async (req, res) => {
  try {
    let productoEncontrado = await productoModel.findOne({ id_: req.params.id });
    let condition: boolean = productoEncontrado === null;
    res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró al producto' } : productoEncontrado);
  } catch (error) {
    res.status(500).send({ msg: 'Error al buscar al producto', error: error });
  }
});


/**
 * Guarda un producto en la base de datos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el producto guardado o un mensaje de error
 */
productoRouter.post('/productos', async (req, res) => {
  try {
    const producto = new productoModel(req.body);
    await producto.save();
    res.send(producto);
  } catch (error) {
    res.status(500).send({ msg: 'Error al guardar el producto', error: error });
  }
});


productoRouter.patch('/productos/:id', async (req, res) => {
  try {
    const productoActualizado = await productoModel.findOneAndUpdate({ id_: req.params.id }, req.body , { new: true, runValidators: true});
    let condition: boolean = productoActualizado === null;
    res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró al producto' } : productoActualizado);
  } catch (error) {
    res.status(500).send({ msg: 'Error al actualizar al producto', error: error });
  }
});

productoRouter.delete('/productos/:id', async (req, res) => {
  try {
    const productoEliminado = await productoModel.findOneAndDelete({ id_: req.params.id });
    let condition: boolean = productoEliminado === null;
    res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró al producto' } : productoEliminado);
  } catch (error) {
    res.status(500).send({ msg: 'Error al eliminar al producto', error: error });
  }
});