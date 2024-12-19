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
import { Request, Response } from 'express';
import { productoModel } from '../models/producto.js'



/**
 * Busca todos los productos en la base de datos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con los productos encontrados o un mensaje de error
 */
export const getProductos = async (req: Request, res: Response): Promise<void> => {
    try {
        let productosEncontrados = await productoModel.find(req.query);
        productosEncontrados = productosEncontrados.filter(x => x !== null);
        let condition: boolean = productosEncontrados.length === 0;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró a los productos' } : productosEncontrados);
    } catch (error) {
        res.status(500).send({ msg: 'Error al buscar los productos', error: error });
    }
}


/**
 * Busca un producto en la base de datos por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el producto encontrado o un mensaje de error
 */
export const getProductosID = async (req: Request, res: Response) : Promise<void>=> {
    try {
        let productoEncontrado = await productoModel.findOne({ id_: req.params.id });
        let condition: boolean = productoEncontrado === null;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró al producto' } : productoEncontrado);
    } catch (error) {
        res.status(500).send({ msg: 'Error al buscar al producto', error: error });
    }
}

/**
 * Guarda un producto en la base de datos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el producto guardado o un mensaje de error
 */
export const postProductos = async (req: Request, res: Response) : Promise<void> => {
    try {
        const producto = new productoModel(req.body);
        await producto.save();
        res.send(producto);
    } catch (error) {
        res.status(500).send({ msg: 'Error al guardar el producto', error: error });
    }
}


/**
 * Actualiza un producto en la base de datos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el producto actualizado o un mensaje de error
 */
export const patchProductosID = async (req: Request, res: Response) : Promise<void> => {
    try {
        const productoActualizado = await productoModel.findOneAndUpdate({ id_: req.params.id}, req.body, { new: true, runValidators: true });
        let condition: boolean = productoActualizado === null;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró al producto' } : productoActualizado);
    } catch (error) {
        res.status(500).send({ msg: 'Error al actualizar al producto', error: error });
    }
}


/**
 * Elimina un producto de la base de datos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el producto eliminado o un mensaje de error
 */
export const deleteProductosID = async (req: Request, res: Response) : Promise<void> => {
    try {
        const productoEliminado = await productoModel.findOneAndDelete({ id_: req.params.id });
        let condition: boolean = productoEliminado === null;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró al producto' } : productoEliminado);
    } catch (error) {
        res.status(500).send({ msg: 'Error al eliminar al producto', error: error });
    }
}


/**
 * Obtiene los 3 productos con menor stock
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con los productos con menor stock o un mensaje de error
 */
export const obtenerProductosMenorStock = async (_: Express.Request, res: Express.Response) => {
  try {
    const productos = await productoModel.find({})
      .sort({ stock_: 1 }) // Ordenar por stock ascendente
      .limit(3); // Limitar a 3 resultados
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

