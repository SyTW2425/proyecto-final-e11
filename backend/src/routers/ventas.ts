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
import { ventaModel } from '../models/venta.js'
import { clienteModel } from '../models/cliente.js';
import { productoModel } from '../models/producto.js';

export const ventaRouter = Express.Router();

/**
 * Obtiene las ventas de la base de datos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con las ventas encontradas o un mensaje de error
 */
ventaRouter.get('/ventas', async (req, res) => {
  req.query = { ...req.query };
  try {
    let ventasEncontrados = await ventaModel.find(req.query);
    ventasEncontrados = ventasEncontrados.filter(x => x !== null);
    let condition: boolean = ventasEncontrados.length === 0;
    res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró las ventas' } : ventasEncontrados);
  } catch (error) {
    res.status(500).send({ msg: 'Error al buscar las ventas', error: error });
  }
});

/**
 * Obtiene una venta de la base de datos por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con la venta encontrada o un mensaje de error
 */
ventaRouter.get('/ventas/:id', async (req, res) => {
  try {
    let ventaEncontrado = await ventaModel.findOne({ id_: req.params.id });
    let condition: boolean = ventaEncontrado === null;
    res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró la venta' } : ventaEncontrado);
  } catch (error) {
    res.status(500).send({ msg: 'Error al buscar la venta', error: error });
  }
});

/**
 * Guarda una nueva compra en la base de datos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con la compra guardada o un mensaje de error
 */
ventaRouter.post('/ventas', async (req: any, res: any) => {
  try {
    const { id_, fecha_, cliente_, importe_, productos_ } = req.body;

    // Buscar el cliente usando el DNI proporcionado
    const cliente = await clienteModel.findOne({ id_: cliente_ });
    if (!cliente) {
      return res.status(404).send({ msg: 'Cliente no encontrado con ese DNI' });
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
      cliente_: cliente._id, // Utilizamos el _id del cliente encontrado
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
});

// ventaRouter.patch('/ventas/:id', async (req:any, res:any) => {
//   const { id } = req.params;
//   const { fecha_, cliente_, importe_, productos_ } = req.body;

//   try {
//     // Si se pasa el ID del cliente, buscar el _id correspondiente en la colección `cliente`
//     let clienteId = null;
//     if (cliente_) {
//       const cliente = await clienteModel.findOne({ id_: cliente_ });
//       if (!cliente) {
//         return res.status(404).send({ msg: 'Cliente no encontrado con ese ID' });
//       }
//       clienteId = cliente._id;
//     }

//     // Convertir el número `productoID_` a ObjectId
//     const productosActualizados = await Promise.all(productos_.map(async (producto: any) => {
//       // Buscar el ObjectId de producto basado en el número
//       const productoId = await productoModel.findOne({ id_: producto.productoID_ });

//       // Si no encontramos el producto, retornamos un error
//       if (!productoId) {
//         throw new Error(`Producto no encontrado con id ${producto.productoID_}`);
//       }

      
//       // Retornar el subdocumento con el productoID como ObjectId
//       return {
//         productoId: productoId._id,  // Asignamos el ObjectId del producto encontrado
//         cantidad: producto.cantidad_ || 0,
//         precio: producto.precio_ || 0
//       };
//     }));

//     // Realizar la actualización
//     const ventaActualizada = await ventaModel.findOneAndUpdate(
//       { id_: id },
//       {
//         fecha_: fecha_ || null,
//         cliente_: clienteId || null,
//         importe_: importe_ || 0,
//         productos_: productosActualizados // Usar los productos con ObjectId
//       },
//       { new: true }
//     );

//     if (!ventaActualizada) {
//       return res.status(404).send({ msg: 'venta no encontrada' });
//     }

//     res.send(ventaActualizada);
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
//     res.status(500).send({ msg: 'Error al actualizar la venta', error: errorMessage });
//   }
// });

/**
 * Elimina una venta de la base de datos por su ID
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con la venta eliminada o un mensaje de error
 */
ventaRouter.delete('/ventas/:id', async (req, res) => {
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
});