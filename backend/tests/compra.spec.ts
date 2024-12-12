import request from 'supertest';
import { app } from '../src/index.js';
import { expect } from 'chai';
import { describe, it, before, after } from 'mocha';
import { proveedorModel } from '../src/models/proveedor.js';
import { productoModel } from '../src/models/producto.js';
import { compraModel } from '../src/models/compra.js';

const sampleProveedor = {
  id_: "A12345678",
  nombre_: 'ProveedorUno',
  contacto_: 623456789,
  productos_: [1, 5]
};

const sampleProducto = { 
  id_: 15000, 
  nombre_: 'Producto', 
  stock_: 100,
  precio_venta_: 50
};

const sampleProducto2 = {
  id_: 15001,
  nombre_: 'Producto2',
  stock_: 200,
  precio_venta_: 60
};

before(async () => {
  await proveedorModel.create(sampleProveedor);
  await productoModel.create(sampleProducto);
});

after(async () => {
  await proveedorModel.deleteOne({ id_: sampleProveedor.id_ });
  await productoModel.deleteOne({ id_: sampleProducto.id_ });
  await compraModel.deleteOne({ id_: 3000 });
  await productoModel.deleteOne({ id_: sampleProducto2.id_ });
  await compraModel.deleteOne({ id_: newCompra2.id_ });

});

let newCompra: any;
let newCompra2: any;

describe('Model Compra', () => {
  // Test for POST /compras (create a new purchase)
  describe('POST /compras', () => {
    it('should create a new purchase', async () => {
      newCompra = {
        id_: 3000,
        fecha_: new Date("2021-02-01"),
        proveedor_: sampleProveedor.id_,
        importe_: 2000,
        productos_: [{ productoID_: sampleProducto.id_, cantidad_: 5, precio_: 40 }]
      };
      const res = await request(app).post('/compras').send(newCompra);
      expect(res.status).to.equal(200);
     
    });

    it('should return 404 if cant post a purchase', async () => {
      const invalidCompra = {
        id_: 4000,
        fecha_: new Date("2021-03-01"),
        proveedor_: "A87654321", // Invalid ID
        importe_: 1000,
        productos_: [{ productoID_: sampleProducto.id_, cantidad_: 10, precio_: 50 }]
      };
      const res = await request(app).post('/compras').send(invalidCompra);
      expect(res.status).to.equal(404);
      expect(res.body).to.include({ msg: 'Proveedor no encontrado con ese DNI' });
    });

    it('should return 500 if product data is incomplete or invalid', async () => {
      const incompleteCompra = {
        id_: 5000,
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

  // Test for GET /compras/:id (fetch a purchase by ID)
  describe('GET /compras/:id', () => {
    it('should return a purchase by specific ID', async () => {
      const res = await request(app).get('/compras/3000');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('importe_', newCompra.importe_);
    });

    it('should return 404 if purchase does not exist', async () => {
      const res = await request(app).get('/compras/999');
      expect(res.status).to.equal(404);
      expect(res.body).to.include({ msg: 'No se encontró la compra' });
    });
  });

  // Test for DELETE /compras/:id (delete a purchase by ID)
  describe('DELETE /compras/:id', () => {
    it('should delete a purchase by ID', async () => {
      const res = await request(app).delete('/compras/3000');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id_', newCompra.id_);
    });

    it('should return 404 if purchase to delete is not found', async () => {
      const res = await request(app).delete('/compras/8000');
      expect(res.status).to.equal(404);
      expect(res.body).to.include({ msg: 'No se encontró la compra' });
    });
  });

  // Test for GET /compras (fetch all purchases)
  describe('GET /compras', () => {
    it('should return all purchases', async () => {
      newCompra = {
        id_: 3000,
        fecha_: new Date("2021-02-01"),
        proveedor_: sampleProveedor.id_,
        importe_: 2000,
        productos_: [{ productoID_: sampleProducto.id_, cantidad_: 5, precio_: 40 }]
      };
      await request(app).post('/compras').send(newCompra);
      const res = await request(app).get('/compras');
      expect(res.status).to.equal(200);
    });
  });

  // Test for stock udater
  describe('Stock update', () => {
    it('should update the stock of a product after a purchase', async () => {
      newCompra2 = {
        id_: 3000,
        fecha_: new Date("2021-02-01"),
        proveedor_: sampleProveedor.id_,
        importe_: 2000,
        productos_: [{ productoID_: sampleProducto2.id_, cantidad_: 5, precio_: 40 }]
      };
      await request(app).post('/productos').send(sampleProducto2);
      await request(app).post('/compras').send(newCompra2);
      const updatedProducto = await productoModel.findOne({ id_: sampleProducto2.id_ });
      expect(updatedProducto!.stock_).to.equal(sampleProducto2.stock_ + newCompra2.productos_[0].cantidad_);
    });
  });
});