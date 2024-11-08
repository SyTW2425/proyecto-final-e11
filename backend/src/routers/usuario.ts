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
import { usuarioModel } from '../models/usuario.js'

export const usuarioRouter = Express.Router();


usuarioRouter.get('/usuarios', async (req, res) => {
  req.query = { ...req.query };
  try {
    let usuariosEncontrados = await usuarioModel.find(req.query);
    usuariosEncontrados = usuariosEncontrados.filter(x => x !== null);
    let condition: boolean = usuariosEncontrados.length === 0;
    res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró a los usuarios' } : usuariosEncontrados);
  } catch (error) {
    res.status(500).send({ msg: 'Error al buscar los usuarios', error: error });
  }
});


usuarioRouter.get('/usuarios/:id', async (req, res) => {
  try {
    let usuarioEncontrado = await usuarioModel.findOne({ id_: req.params.id });
    let condition: boolean = usuarioEncontrado === null;
    res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró al usuario' } : usuarioEncontrado);
  } catch (error) {
    res.status(500).send({ msg: 'Error al buscar al usuario', error: error });
  }
});


/**
 * Guarda un cliente en la base de datos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el cliente guardado o un mensaje de error
 */
usuarioRouter.post('/usuarios', async (req, res) => {
  try {
    const usuario = new usuarioModel(req.body);
    await usuario.save();
    res.send(usuario);
  } catch (error) {
    res.status(500).send({ msg: 'Error al guardar el usuario', error: error });
  }
});


usuarioRouter.patch('/usuarios/:id', async (req, res) => {
  try {
    const usuarioActualizado = await usuarioModel.findOneAndUpdate({ id_: req.params.id }, req.body , { new: true, runValidators: true});
    let condition: boolean = usuarioActualizado === null;
    res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró al usuario' } : usuarioActualizado);
  } catch (error) {
    res.status(500).send({ msg: 'Error al actualizar al usuario', error: error });
  }
});

usuarioRouter.delete('/usuarios/:id', async (req, res) => {
  try {
    const usuarioEliminado = await usuarioModel.findOneAndDelete({ id_: req.params.id });
    let condition: boolean = usuarioEliminado === null;
    res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró al usuario' } : usuarioEliminado);
  } catch (error) {
    res.status(500).send({ msg: 'Error al eliminar al usuario', error: error });
  }
});