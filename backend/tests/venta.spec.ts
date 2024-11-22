import request from 'supertest';
import { app } from '../src/index.js';
import { expect } from 'chai';
import { describe, it, before, after } from 'mocha';
//import { ventaModel } from '../src/models/venta.js';
import { clienteModel } from '../src/models/cliente.js';
import { productoModel } from '../src/models/producto.js';

// Sample data for setup
const sampleCliente = {
  id_: "11111144A",
  nombre_: 'Juan',
  contacto_: 678901234,
  membresia_: true,
  compras_: []
};

const sampleProducto = { 
  id_: 16, 
  nombre_: 'Producto1', 
  stock_: 100,
  precio_venta_: 50
};

before(async () => {
  await clienteModel.create(sampleCliente);
  await productoModel.create(sampleProducto);
});

after(async () => {
  await clienteModel.deleteMany({});
  await productoModel.deleteMany({});
});

let newVenta: any;

describe('Model Venta', () => {

  describe('POST /ventas', () => {
    it('should create a new sell', async () => {
      newVenta = {
        id_: 5,
        fecha_: new Date("2021-02-01"),
        cliente_: sampleCliente.id_,
        importe_: 2000,
        productos_: [{ productoID_: sampleProducto.id_, cantidad_: 5, precio_: 40 }]
      };
      const res = await request(app).post('/ventas').send(newVenta);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id_', newVenta.id_);
      expect(res.body).to.have.property('importe_', newVenta.importe_);
    });

    it('should return 404 if client is not found', async () => {
      const invalidVenta = {
        id_: 4,
        fecha_: new Date("2021-03-01"),
        cliente_: "A87654321", // Invalid client ID
        importe_: 1000,
        productos_: [{ productoID_: sampleProducto.id_, cantidad_: 10, precio_: 50 }]
      };
      const res = await request(app).post('/ventas').send(invalidVenta);
      expect(res.status).to.equal(404);
      expect(res.body).to.include({ msg: 'Cliente no encontrado con ese DNI' });
    });

    it('should return 500 if product data is incomplete or invalid', async () => {
      const incompleteVenta = {
        id_: 5,
        fecha_: new Date("2021-04-01"),
        cliente_: sampleCliente.id_,
        importe_: 500,
        productos_: [{ cantidad_: 5 }] // Missing product ID and price
      };
      const res = await request(app).post('/ventas').send(incompleteVenta);
      expect(res.status).to.equal(500);
      expect(res.body).to.include({ msg: 'Error al guardar la venta' });
    });
  });

  // describe('GET /compras/:id', () => {
  //   it('should return a purchase by specific ID', async () => {
  //     const res = await request(app).get('/compras/3');
  //     expect(res.status).to.equal(200);
  //     expect(res.body).to.have.property('importe_', newCompra.importe_);
  //   });

  //   it('should return 404 if purchase does not exist', async () => {
  //     const res = await request(app).get('/compras/999');
  //     expect(res.status).to.equal(404);
  //     expect(res.body).to.include({ msg: 'No se encontró la compra' });
  //   });
  // });

  // describe('DELETE /compras/:id', () => {
  //   it('should delete a purchase by ID', async () => {
  //     const res = await request(app).delete('/compras/3');
  //     expect(res.status).to.equal(200);
  //     expect(res.body).to.have.property('id_', newCompra.id_);
  //   });

  //   it('should return 404 if purchase to delete is not found', async () => {
  //     const res = await request(app).delete('/compras/8');
  //     expect(res.status).to.equal(404);
  //     expect(res.body).to.include({ msg: 'No se encontró la compra' });
  //   });
  // });

  // describe('GET /compras', () => {
  //   it('should return all purchases', async () => {
  //     const res = await request(app).get('/compras');
  //     expect(res.status).to.equal(404);
  //   });

  //   it('should return 404 if no purchases are found', async () => {
  //     await compraModel.deleteMany({});
  //     const res = await request(app).get('/compras');
  //     expect(res.status).to.equal(404);
  //     expect(res.body).to.include({ msg: 'No se encontró las compras' });
  //   });
  // });
});