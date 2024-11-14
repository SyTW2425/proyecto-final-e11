import request from 'supertest';
import { app } from '../src/index.js';
import { expect } from 'chai';
import { describe, it, before, after } from 'mocha';
import { productoModel } from '../src/models/producto.js';

const primerProducto = {
    id_: 1,
    nombre_: "Jabón",
    precio_venta_: 9.99,
    stock_: 100
};

const segundoProducto = {
    id_: 2,
    nombre_: "Pinzas",
    precio_venta_: 14.99,
    stock_: 50
};

const nuevoProducto = {
    id_: 3,
    nombre_: "Martillo",
    precio_venta_: 19.99,
    stock_: 20
};
  

//Hooks
before(async () => {
    await new productoModel(primerProducto).save();
    await new productoModel(segundoProducto).save();
  });
  
  after(async () => {
    await productoModel.deleteMany({});
  });
  


// Tests
describe('Model Producto', () => {

  describe('GET /productos', () => {
    it('should return all products', async () => {
      const res = await request(app).get('/productos');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.lengthOf(3);
    });

    it('should return 404 if no products are found', async () => {
      await productoModel.deleteMany({});
      const res = await request(app).get('/productos');
      expect(res.status).to.equal(404);
      expect(res.body).to.include({ msg: 'No se encontró a los productos' });
      // volvemos a insertar los productos
      await new productoModel(primerProducto).save();
      await new productoModel(segundoProducto).save();
    });
  });

 
  describe('GET /productos/:id', () => {
    it('should return a product by specific ID', async () => {
      const res = await request(app).get('/productos/1');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('nombre_', primerProducto.nombre_);
    });

    it('should return 404 if product does not exist', async () => {
      const res = await request(app).get('/productos/999');
      expect(res.status).to.equal(404);
      expect(res.body).to.include({ msg: 'No se encontró al producto' });
    });
  });

 
  describe('POST /productos', () => {
    it('should create a new product', async () => {
      const res = await request(app).post('/productos').send(nuevoProducto);
      expect(res.body).to.have.property('id_', nuevoProducto.id_);
      expect(res.body).to.have.property('nombre_', nuevoProducto.nombre_);
    });

    it('should return 500 if product data is invalid', async () => {
      const invalidProducto = { id_: "111" }; // missing fields
      const res = await request(app).post('/productos').send(invalidProducto);
      expect(res.status).to.equal(500);
      expect(res.body).to.include({ msg: 'Error al guardar el producto' });
    });
  });

  // Test for PATCH /clientes/:id (update a client by ID)
  describe('PATCH /productos/:id', () => {
    it('should update an existing product', async () => {
        const updatedData = { id_: 1,
            nombre_: 'Jabón de manos',
            precio_venta_: 9.99,
            stock_: 100};
      const res = await request(app).patch('/productos/1').send(updatedData);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('nombre_', updatedData.nombre_);
      expect(res.body).to.have.property('stock_', updatedData.stock_);
    });

    it('should return 404 if product to update is not found', async () => {
      const res = await request(app).patch('/productos/999').send({ nombre_: 'Nonexistent' });
      expect(res.status).to.equal(404);
      expect(res.body).to.include({ msg: 'No se encontró al producto' });
    });
  });

  describe('DELETE /productos/:id', () => {
    it('should delete a product by ID', async () => {
      const res = await request(app).delete(`/productos/${segundoProducto.id_}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id_', segundoProducto.id_);
    });

    it('should return 404 if product to delete is not found', async () => {
      const res = await request(app).delete('/productos/999');
      expect(res.status).to.equal(404);
      expect(res.body).to.include({ msg: 'No se encontró al producto' });
    });
  });
});