import request from 'supertest';
import { app } from '../src/index.js';
import { expect } from 'chai';
import { describe, it, before, after } from 'mocha';
import { ventaModel } from '../src/models/venta.js';
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
  await clienteModel.deleteOne({ id_: sampleCliente.id_ });
  await productoModel.deleteOne({ id_: sampleProducto.id_ });
  await ventaModel.deleteOne({ id_: 5 });
});

let newVenta: any;

describe('Model Venta', () => {

  describe('POST /ventas', () => {
    it('should create a new sell', async () => {
      newVenta = {
        id_: 5,
        fecha_: new Date("2001-02-21"),
        cliente_: "11111144A",
        importe_: 2000,
        productos_: [{ productoID_: "16", cantidad_: 5, precio_: 40 }]
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

  describe('GET /ventas/:id', () => {
    it('should return a venta by specific ID', async () => {
      const res = await request(app).get('/ventas/5');
      expect(res.status).to.equal(200);
    });

    it('should return 404 if venta does not exist', async () => {
      const res = await request(app).get('/ventas/999');
      expect(res.status).to.equal(404);
    });
  });

  describe('DELETE /ventas/:id', () => {
    it('should delete a venta by ID', async () => {
      const res = await request(app).delete('/ventas/5');
      expect(res.status).to.equal(200);
    });

    it('should return 404 if ventas to delete is not found', async () => {
      const res = await request(app).delete('/ventas/8');
      expect(res.status).to.equal(404);
    });
  });

  describe('GET /ventas', () => {
    it('should return 404 if no ventas are found', async () => {
      const res = await request(app).get('/ventas');
      expect(res.status).to.equal(404);
    });
    it('should return all ventas', async () => {
      await request(app).post('/ventas').send(newVenta);
      const res = await request(app).get('/compras');
      expect(res.status).to.equal(200);
    });   
  });

  describe('stock update', () => {
    it('should update the stock of a product after a sale', async () => {
      const res = await request(app).get('/productos/16');
      expect(res.body).to.have.property('stock_', 95);
    });
  });
});