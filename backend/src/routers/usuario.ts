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

usuarioRouter.get('/usuarios/claves', async (req: any, res: any) => {
  try {
    // Obtener los parámetros de la consulta
    const { nombre_usuario, contrasena } = req.query;

    // Validar que los parámetros existan
    if (!nombre_usuario || !contrasena) {
      return res.status(400).send({ msg: 'Faltan parámetros: nombre_usuario y/o contrasena' });
    }

    // Buscar el usuario con ambas condiciones en una sola consulta
    const usuarioEncontrado = await usuarioModel.findOne({
      "claves_.0": nombre_usuario,
      "claves_.1": contrasena,
    });

    // Validar si el usuario fue encontrado
    if (!usuarioEncontrado) {
      return res.status(404).send({ msg: 'Usuario no encontrado o credenciales incorrectas' });
    }

    // Retornar el usuario si fue encontrado
    res.status(200).send(usuarioEncontrado);
  } catch (error : any) {
    // Manejo de errores del servidor
    res.status(500).send({ msg: 'Error al buscar al usuario', error: error.message });
  }
});


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
usuarioRouter.post('/usuarios', async (req: any, res : any) => {
  try {
    const usuario = new usuarioModel(req.body);
    const usuarioExistente = await usuarioModel.findOne({ 'claves_.0': req.body.claves_[0] });

    if (usuarioExistente) {
      return res.status(400).send({ msg: 'El nombre de usuario ya está en uso.' });
    }
    await usuario.save();
    res.status(201).send(usuario);
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