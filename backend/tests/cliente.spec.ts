import request from 'supertest';
import { app } from '../src/index.js';
import { expect } from 'chai';
import { describe, it, before, after } from 'mocha';
import { clienteModel } from '../src/models/cliente.js';

const primerCliente = {
  id_: "11111111A",
  nombre_: 'Juan',
  contacto_: 678901234,
  membresia_: true,
  compras_: []
};

const segundoCliente = {
  id_: "11111111B",
  nombre_: 'Pedro',
  contacto_: 678901235,
  membresia_: false,
  compras_: []
};

const nuevoCliente = {
  id_: "11111111C",
  nombre_: 'Pablo',
  contacto_: 678901236,
  membresia_: true,
  compras_: []
};
  
before(async () => {
  await clienteModel.create(primerCliente);
  await clienteModel.create(segundoCliente);
});

after(async () => {
  await clienteModel.deleteOne({ id_: primerCliente.id_ });
  await clienteModel.deleteOne({ id_: segundoCliente.id_ });
  await clienteModel.deleteOne({ id_: nuevoCliente.id_ });
});

describe('Model Cliente', () => {
  // Test for GET /clientes (fetch all clients)
  describe('GET /clientes', () => {
    it('should return all clients', async () => {
      const res = await request(app).get('/clientes');
      expect(res.status).to.equal(200);
    });
  });

  // Test for GET /clientes/:id (fetch a client by ID)
  describe('GET /clientes/:id', () => {
    it('should return a client by specific ID', async () => {
      const res = await request(app).get('/clientes/11111111A');
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('nombre_', primerCliente.nombre_);
    });

    it('should return 404 if client does not exist', async () => {
      const res = await request(app).get('/clientes/99999999X');
      expect(res.status).to.equal(404);
      expect(res.body).to.include({ msg: 'No se encontró al cliente' });
    });
  });

  // Test for POST /clientes (create a new client)
  describe('POST /clientes', () => {
    it('should create a new client', async () => {
      const res = await request(app).post('/clientes').send(nuevoCliente);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id_', nuevoCliente.id_);
      expect(res.body).to.have.property('nombre_', nuevoCliente.nombre_);
    });

    it('should return 500 if client data is invalid', async () => {
      const invalidClient = { id_: "11111111D", nombre_: 'Carlos' }; 
      const res = await request(app).post('/clientes').send(invalidClient);
      expect(res.status).to.equal(500);
      expect(res.body).to.include({ msg: 'Error al guardar el cliente' });
    });
  });

  // Test for PATCH /clientes/:id (update a client by ID)
  describe('PATCH /clientes/:id', () => {
    it('should update an existing client', async () => {
      const updatedData = { id_: "11111111A",
        nombre_: 'Juanito',
        contacto_: 689758496,
        membresia_: true,
        compras_: []};
      const res = await request(app).patch('/clientes/11111111A').send(updatedData);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('nombre_', updatedData.nombre_);
      expect(res.body).to.have.property('contacto_', updatedData.contacto_);
    });

    it('should return 404 if client to update is not found', async () => {
      const res = await request(app).patch('/clientes/99999999X').send({ nombre_: 'Nonexistent' });
      expect(res.status).to.equal(404);
      expect(res.body).to.include({ msg: 'No se encontró al cliente' });
    });
  });

  // Test for DELETE /clientes/:id (delete a client by ID)
  describe('DELETE /clientes/:id', () => {
    it('should delete a client by ID', async () => {
      const res = await request(app).delete(`/clientes/${segundoCliente.id_}`);
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id_', segundoCliente.id_);
    });

    it('should return 404 if client to delete is not found', async () => {
      const res = await request(app).delete('/clientes/99999999X');
      expect(res.status).to.equal(404);
      expect(res.body).to.include({ msg: 'No se encontró al cliente' });
    });
  });
});