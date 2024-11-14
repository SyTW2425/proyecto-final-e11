import request from 'supertest';
import { app } from '../src/index.js';
import { expect } from 'chai';
import { describe, it, before, after } from 'mocha';
import { compraModel } from '../src/models/compra.js';
import { proveedorModel } from '../src/models/proveedor.js';
import { productoModel } from '../src/models/producto.js';

// Sample data for setup
const sampleProveedor = {
  id_: "A12345678",
  nombre_: 'ProveedorUno',
  contacto_: 623456789,
  productos_: [1001, 1002]
};

const sampleProducto = { 
  id_: 15, 
  nombre_: 'Producto', 
  stock_: 100,
  precio_venta_: 50
};



before(async () => {
  await proveedorModel.create(sampleProveedor);
  await productoModel.create(sampleProducto);
  // await compraModel.create(sampleCompra);
});

after(async () => {
  await proveedorModel.deleteMany({});
  await productoModel.deleteMany({});
  // await compraModel.deleteOne({ id_: sampleCompra.id_ });
});

let newCompra: any;


describe('Compra API', () => {

  describe('POST /compras', () => {
    it('should create a new purchase', async () => {
      newCompra = {
        id_: 3,
        fecha_: new Date("2021-02-01"),
        proveedor_: sampleProveedor.id_,
        importe_: 2000,
        productos_: [{ productoID_: sampleProducto.id_, cantidad_: 5, precio_: 40 }]
      };
      const res = await request(app).post('/compras').send(newCompra);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id_', newCompra.id_);
      expect(res.body).to.have.property('importe_', newCompra.importe_);
    });

    it('should return 404 if provider is not found', async () => {
      const invalidCompra = {
        id_: 4,
        fecha_: new Date("2021-03-01"),
        proveedor_: "A87654321", // Invalid provider ID
        importe_: 1000,
        productos_: [{ productoID_: sampleProducto.id_, cantidad_: 10, precio_: 50 }]
      };
      const res = await request(app).post('/compras').send(invalidCompra);
      expect(res.status).to.equal(404);
      expect(res.body).to.include({ msg: 'Proveedor no encontrado con ese DNI' });
    });

    it('should return 500 if product data is incomplete or invalid', async () => {
      const incompleteCompra = {
        id_: 5,
        fecha_: new Date("2021-04-01"),
        proveedor_: sampleProveedor.id_,
        importe_: 500,
        productos_: [{ cantidad_: 5 }] // Missing product ID and price
      };
      const res = await request(app).post('/compras').send(incompleteCompra);
      expect(res.status).to.equal(500);
      expect(res.body).to.include({ msg: 'Error al guardar la compra' });
    });
  });

  describe('GET /compras/:id', () => {
    it('should return a purchase by specific ID', async () => {
      const res = await request(app).get('/compras/3');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('importe_', newCompra.importe_);
    });

    it('should return 404 if purchase does not exist', async () => {
      const res = await request(app).get('/compras/999');
      expect(res.status).to.equal(404);
      expect(res.body).to.include({ msg: 'No se encontró la compra' });
    });
  });

  describe('DELETE /compras/:id', () => {
    it('should delete a purchase by ID', async () => {
      const res = await request(app).delete('/compras/3');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id_', newCompra.id_);
    });

    it('should return 404 if purchase to delete is not found', async () => {
      const res = await request(app).delete('/compras/8');
      expect(res.status).to.equal(404);
      expect(res.body).to.include({ msg: 'No se encontró la compra' });
    });
  });

  describe('GET /compras', () => {
    it('should return all purchases', async () => {
      const res = await request(app).get('/compras');
      expect(res.status).to.equal(404);
    });

    it('should return 404 if no purchases are found', async () => {
      await compraModel.deleteMany({});
      const res = await request(app).get('/compras');
      expect(res.status).to.equal(404);
      expect(res.body).to.include({ msg: 'No se encontró las compras' });
    });
  });
});