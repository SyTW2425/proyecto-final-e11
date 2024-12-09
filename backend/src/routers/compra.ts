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
import { compraModel } from '../models/compra.js'
import { proveedorModel } from '../models/proveedor.js';
import { productoModel } from '../models/producto.js';

export const compraRouter = Express.Router();

/**
 * Busca todas las compras en la base de datos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con las compras encontradas o un mensaje de error
 */
compraRouter.get('/compras', async (req, res) => {
  req.query = { ...req.query };
  try {
    let comprasEncontrados = await compraModel.find(req.query);
    comprasEncontrados = comprasEncontrados.filter(x => x !== null);
    let condition: boolean = comprasEncontrados.length === 0;
    res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró las compras' } : comprasEncontrados);
  } catch (error) {
    res.status(500).send({ msg: 'Error al buscar las compras', error: error });
  }
});

/**
 * Busca una compra en la base de datos por su id
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con la compra encontrada o un mensaje de error
 */
compraRouter.get('/compras/:id', async (req, res) => {
  try {
    let compraEncontrado = await compraModel.findOne({ id_: req.params.id });
    let condition: boolean = compraEncontrado === null;
    res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró la compra' } : compraEncontrado);
  } catch (error) {
    res.status(500).send({ msg: 'Error al buscar la compra', error: error });
  }
});

/**
 * Guarda una nueva compra en la base de datos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con la compra guardada o un mensaje de error
 */
compraRouter.post('/compras', async (req: any, res: any) => {
  try {
    const { id_, fecha_, proveedor_, importe_, productos_ } = req.body;

    // Buscar el proveedor usando el DNI proporcionado
    const proveedor = await proveedorModel.findOne({ id_: proveedor_ });
    if (!proveedor) {
      return res.status(404).send({ msg: 'Proveedor no encontrado con ese DNI' });
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
        // Modificamos el stock del producto restando la cantidad vendida
        if (producto_elegido) {
          producto_elegido.stock_ += producto.cantidad_;
          await producto_elegido.save();
        }

        return {
          productoId: productoExistente._id,  // Usamos el _id de MongoDB encontrado
          cantidad: producto.cantidad_,
          precio: producto.precio_
        };
      })
    );

    // Crear el objeto de compra con el _id del proveedor y productos estructurados
    const nuevaCompra = new compraModel({
      id_,
      fecha_,
      proveedor_: proveedor._id, // Utilizamos el _id del proveedor encontrado
      importe_,
      productos_: productosEstructurados // Agregamos los productos estructurados y verificados
    });

    // Guardar la nueva compra en la base de datos
    const compra = await nuevaCompra.save();
    res.send(compra);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).send({ msg: 'Error al guardar la compra', error: errorMessage });
  }
});

// compraRouter.patch('/compras/:id', async (req:any, res:any) => {
//   const { id } = req.params;
//   const { fecha_, proveedor_, importe_, productos_ } = req.body;

//   try {
//     // Si se pasa el ID del proveedor, buscar el _id correspondiente en la colección `Proveedor`
//     let proveedorId = null;
//     if (proveedor_) {
//       const proveedor = await proveedorModel.findOne({ id_: proveedor_ });
//       if (!proveedor) {
//         return res.status(404).send({ msg: 'Proveedor no encontrado con ese ID' });
//       }
//       proveedorId = proveedor._id;
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
//     const compraActualizada = await compraModel.findOneAndUpdate(
//       { id_: id },
//       {
//         fecha_: fecha_ || null,
//         proveedor_: proveedorId || null,
//         importe_: importe_ || 0,
//         productos_: productosActualizados // Usar los productos con ObjectId
//       },
//       { new: true }
//     );

//     if (!compraActualizada) {
//       return res.status(404).send({ msg: 'Compra no encontrada' });
//     }

//     res.send(compraActualizada);
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : 'Unknown error';
//     res.status(500).send({ msg: 'Error al actualizar la compra', error: errorMessage });
//   }
// });

/**
 * Elimina una compra de la base de datos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con la compra eliminada o un mensaje de error
 */
compraRouter.delete('/compras/:id', async (req, res) => {
  try {
    const compraEliminado = await compraModel.findOneAndDelete({ id_: req.params.id });
    let condition: boolean = compraEliminado === null;

    if (compraEliminado) {
      // Restaurar el stock de los productos
      await Promise.all(compraEliminado.productos_.map(async (producto: any) => {
        const productoRestaurar = await productoModel.findOne({ _id: producto.productoId });
        if (productoRestaurar) {
          productoRestaurar.stock_ -= producto.cantidad;
          await productoRestaurar.save();
        }
      }));
    }

    res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró la compra' } : compraEliminado);
  } catch (error) {
    res.status(500).send({ msg: 'Error al eliminar la compra', error: error });
  }
});