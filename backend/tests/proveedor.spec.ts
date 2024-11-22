import request from 'supertest';
import { app } from '../src/index.js';
import { expect } from 'chai';
import { describe, it, before, after } from 'mocha';
import { proveedorModel } from '../src/models/proveedor.js';

const primerProveedor = {
  id_: "A11111111",
  nombre_: 'Juan',
  contacto_: 678901234,
  productos_: [1, 2]
};

const segundoProveedor = {
  id_: "B22222222",
  nombre_: 'Pedro',
  contacto_: 612345678,
  productos_: [2, 3]
};

before(async () => {
  await proveedorModel.create(primerProveedor);
  await proveedorModel.create(segundoProveedor);
});

after(async () => {
  await proveedorModel.deleteMany({});
});

describe('Model Proveedor', () => {
  
    describe('GET /proveedores', () => {
      it('should return all providers', async () => {
        const res = await request(app).get('/proveedores');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.lengthOf(2);
      });
  
      it('should return 404 if no providers are found', async () => {
        await proveedorModel.deleteMany({});
        const res = await request(app).get('/proveedores');
        expect(res.status).to.equal(404);
        expect(res.body).to.include({ msg: 'No se encontró a los proveedores' });
        await proveedorModel.create(primerProveedor);
        await proveedorModel.create(segundoProveedor);
      });
    });
  
    describe('GET /proveedores/:id', () => {
      it('should return a provider', async () => {
        const res = await request(app).get(`/proveedores/${primerProveedor.id_}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.include(primerProveedor);
      });
  
      it('should return 404 if the provider is not found', async () => {
        const res = await request(app).get('/proveedores/12345678Z');
        expect(res.status).to.equal(404);
      });
    });
  
    describe('POST /proveedores', () => {
      it('should create a provider', async () => {
        const res = await request(app)
          .post('/proveedores')
          .send({
            id_: "33333333C",
            nombre_: 'Antonio',
            contacto_: 678901234,
            productos_: ['producto5', 'producto6']
          });
        expect(res.status).to.equal(201);
        expect(res.body).to.include({ msg: 'Proveedor creado' });
      });
  
      it('should return 400 if the provider already exists', async () => {
        const res = await request(app)
          .post('/proveedores')
          .send(primerProveedor);
        expect(res.status).to.equal(400);
        expect(res.body).to.include({ msg: 'El proveedor ya existe' });
      });
    });
    
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
          .send({ nombre_: 'Non-existent' });
      expect(res.status).to.equal(404);
      expect(res.body).to.include({ msg: 'No se encontró al proveedor' });
      });
    });
      
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