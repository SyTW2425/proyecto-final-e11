import { compraModel } from './models/compra.js';
import { proveedorModel } from './models/proveedor.js';

export async function crearCompra(datosCompra: any) {
  const { proveedorDni, ...restoDatos } = datosCompra;

  // Buscar proveedor por DNI y obtener su _id
  const proveedor = await proveedorModel.findOne({ dni: proveedorDni });
  if (!proveedor) throw new Error(`Proveedor con DNI ${proveedorDni} no encontrado`);

  // Crear la compra usando el _id del proveedor
  const nuevaCompra = new compraModel({
    ...restoDatos,
    proveedor_: proveedor._id
  });

  await nuevaCompra.save();
  console.log('Compra guardada exitosamente:', nuevaCompra);
}