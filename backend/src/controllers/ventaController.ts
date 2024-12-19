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
import { ventaModel } from '../models/venta.js'
import { clienteModel } from '../models/cliente.js';
import { productoModel } from '../models/producto.js';


/**
 * Obtiene las ventas de la base de datos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con las ventas encontradas o un mensaje de error
 */
export const getVentas = async (req: Request, res: Response): Promise<void> => {
    try {
        let ventasEncontrados = await ventaModel.find(req.query);
        ventasEncontrados = ventasEncontrados.filter(x => x !== null);
        let condition: boolean = ventasEncontrados.length === 0;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró las ventas' } : ventasEncontrados);
    } catch (error) {
        res.status(500).send({ msg: 'Error al buscar las ventas', error: error });
    }
}


/**
 * Obtiene una venta de la base de datos por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con la venta encontrada o un mensaje de error
 */
export const getVentasID = async (req: Request, res: Response) : Promise<void>=> {
    try {
        let ventaEncontrado = await ventaModel.findOne({ id_: req.params.id });
        let condition: boolean = ventaEncontrado === null;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró la venta' } : ventaEncontrado);
    } catch (error) {
        res.status(500).send({ msg: 'Error al buscar la venta', error: error });
    }
}


/**
 * Guarda una nueva compra en la base de datos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con la compra guardada o un mensaje de error
 */
export const postVentas = async (req: Request, res: Response) : Promise<void> => {
    try {
        const { id_, fecha_, cliente_, importe_, productos_ } = req.body;
    
        // Buscar el cliente usando el DNI proporcionado
        const cliente = await clienteModel.findOne({ id_: cliente_ });
        if (!cliente) {
          res.status(404).send({ msg: 'Cliente no encontrado con ese DNI' });
        }
    
        // Estructurar y verificar cada producto en productos_
        const productosEstructurados = await Promise.all(
          productos_.map(async (producto: any) => {
            if (!producto.productoID_ || !producto.cantidad_ || !producto.precio_) {
              throw new Error('Cada producto debe tener productoNumero, cantidad y precio');
            }
    
            // Buscar el producto en la base de datos por su número (campo único en la colección de productos)
            const productoExistente = await productoModel.findOne({ id_: producto.productoID_ });
            if (!productoExistente) {
              throw new Error(`El producto con número ${producto.productoID_} no existe`);
            }
    
            const producto_elegido = await productoModel.findOne({ id_: producto.productoID_ });
            if (!producto_elegido || producto.cantidad_ > producto_elegido.stock_) {
              throw new Error(`No hay suficiente stock para el producto con número ${producto.productoID_}`);
            }
            // Modificamos el stock del producto restando la cantidad vendida
            producto_elegido.stock_ -= producto.cantidad_;
            await producto_elegido.save();
    
            return {
              productoId: productoExistente._id,  // Usamos el _id de MongoDB encontrado
              cantidad: producto.cantidad_,
              precio: producto.precio_
            };
          })
        );
    
        // Crear el objeto de venta con el _id del cliente y productos estructurados
        const nuevaCompra = new ventaModel({
          id_,
          fecha_,
          cliente_: cliente!._id, // Utilizamos el _id del cliente encontrado
          importe_,
          productos_: productosEstructurados // Agregamos los productos estructurados y verificados
        });
    
        // Guardar la nueva compra en la base de datos
        const compra = await nuevaCompra.save();
        res.send(compra);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).send({ msg: 'Error al guardar la venta', error: errorMessage });
      }   
}



/**
 * Elimina una venta de la base de datos por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con la venta eliminada o un mensaje de error
 */
export const deleteVentasID = async (req: Request, res: Response) : Promise<void> => {
    try {
        const ventaEliminado = await ventaModel.findOneAndDelete({ 
          id_: req.params.id
        });
        let condition: boolean = ventaEliminado === null;
        
        if (ventaEliminado) {
          // Restaurar el stock de los productos
          await Promise.all(ventaEliminado.productos_.map(async (producto: any) => {
            const productoRestaurar = await productoModel.findOne({ _id: producto.productoId });
            if (productoRestaurar) {
              productoRestaurar.stock_ += producto.cantidad;
              await productoRestaurar.save();
            }
          }));
        }
    
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró la venta' } : ventaEliminado);
      } catch (error) {
        res.status(500).send({ msg: 'Error al eliminar la venta', error: error });
      }
}
