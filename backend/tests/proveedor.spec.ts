import request from 'supertest';
import { app } from '../src/index.js';
import { expect } from 'chai';
import { describe, it, before, after } from 'mocha';
import { proveedorModel } from '../src/models/proveedor.js';

const primerProveedor = {
  id_: "A11111111",
  nombre_: 'Juan',
  contacto_: 678901234,
  productos_: [1, 5]
};

const segundoProveedor = {
  id_: "B22222222",
  nombre_: 'Pedro',
  contacto_: 612345678,
  productos_: [1, 5]
};

before(async () => {
  await proveedorModel.create(primerProveedor);
  await proveedorModel.create(segundoProveedor);
});

after(async () => {
  await proveedorModel.deleteOne({ id_: primerProveedor.id_ });
  await proveedorModel.deleteOne({ id_: segundoProveedor.id_ });
});

describe('Model Proveedor', () => {
  // Test for GET /proveedores (fetch all providers)
  describe('GET /proveedores', () => {
    it('should return all providers', async () => {
      const res = await request(app).get('/proveedores');
      expect(res.status).to.equal(200);
    });
  });
  
  // Test for GET /proveedores/:id (fetch a provider by ID)
  describe('GET /proveedores/:id', () => {
    it('should return a provider', async () => {
      const res = await request(app).get(`/proveedores/${primerProveedor.id_}`);
      expect(res.status).to.equal(200);
    });

    it('should return 404 if the provider is not found', async () => {
      const res = await request(app).get('/proveedores/Z12345678');
      expect(res.status).to.equal(404);
    });
  });

  // Test for POST /proveedores (create a new provider)
  describe('POST /proveedores', () => {
    it('should create a provider', async () => {
      const res = await request(app)
        .post('/proveedores')
        .send({
          id_: "A33333333",
          nombre_: "Antonio",
          contacto_: 678901234,
          productos_: [1]
        });
      expect(res.status).to.equal(200);
      await proveedorModel.deleteOne({ id_: "A33333333" });
    });

    it('should return 500 if the provider already exists', async () => {
      const res = await request(app)
        .post('/proveedores')
        .send(primerProveedor);
      expect(res.status).to.equal(500);
    });
  });
  
  // Test for PATCH /proveedores/:id (update a provider)
  describe('PATCH /proveedores/:id', () => {
    it('should update an existing provider', async () => {
    const updatedData = { nombre_: 'Juan Updated', contacto_: 999888777 };
    const res = await request(app)
        .patch(`/proveedores/${primerProveedor.id_}`)
        .send(updatedData);
    expect(res.status).to.equal(200);
    });

    it('should return 404 if the provider is not found', async () => {
    const res = await request(app)
        .patch('/proveedores/12345678Z')
        .send({ nombre_: 'Noexiste' });
    expect(res.status).to.equal(404);
    expect(res.body).to.include({ msg: 'No se encontró al proveedor' });
    });
  });
  
  // Test for DELETE /proveedores/:id (delete a provider)
  describe('DELETE /proveedores/:id', () => {
    it('should delete an existing provider', async () => {
      const res = await request(app).delete(`/proveedores/${primerProveedor.id_}`);
      expect(res.status).to.equal(200);
    });
  
    it('should return 404 if the provider is not found', async () => {
      const res = await request(app).delete('/proveedores/12345678Z');
      expect(res.status).to.equal(404);
      expect(res.body).to.include({ msg: 'No se encontró al proveedor' });
    });
  });
});