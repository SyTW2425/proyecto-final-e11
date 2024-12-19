import request from 'supertest';
import { app } from '../src/index.js';
import { expect } from 'chai';
import { describe, it, before, after } from 'mocha';
import { usuarioModel } from '../src/models/usuario.js';

const primerUsuario = {
  id_: "11111111A",
  nombre_: 'Juan',
  contacto_: 678901234,
  claves_: ['clave1', 'clave2'],
  rol_: 'administrador'
};

const segundoUsuario = {
  id_: "22222222B",
  nombre_: 'Pedro',
  contacto_: 612345678,
  claves_: ['clave3', 'clave4'],
  rol_: 'gestor de almacén'
};

before(async () => {
  await usuarioModel.create(primerUsuario);
  await usuarioModel.create(segundoUsuario);
});

after(async () => {
  await usuarioModel.deleteOne({ id_: primerUsuario.id_ });
  await usuarioModel.deleteOne({ id_: segundoUsuario.id_ });
  await usuarioModel.deleteOne({ id_: "11111111B" });
});

describe('Model Usuario', () => {
  // Test for GET /usuarios (fetch all users)
  describe('GET /usuarios', () => {
    it('should return all users', async () => {
      const res = await request(app).get('/usuarios');
      expect(res.status).to.equal(200);
    });
  });

  // Test for GET /usuarios/:id (fetch a user by ID)
  describe('GET /usuarios/:id', () => {
    it('should return a user', async () => {
      const res = await request(app).get(`/usuarios/${primerUsuario.id_}`);
      expect(res.status).to.equal(200);
    });

    it('should return 404 if the user is not found', async () => {
      const res = await request(app).get('/usuarios/12345678Z');
      expect(res.status).to.equal(404);
      expect(res.body).to.include({ msg: 'No se encontró al usuario' });
    });
  });

  // Test for POST /usuarios (create a new user)
  describe('POST /usuarios', () => {
    it('should create a user', async () => {
      const res = await request(app)
        .post('/usuarios')
        .send({
          "id_": "11111111B",
          "nombre_": "Luis",
          "contacto_": 662345678,
          "claves_": ['clave9', 'clave10'],
          "rol_": 'administrador'
        });
      expect(res.status).to.equal(201);
    });

    it('should return 404 if the user is not created', async () => {
      const res = await request(app)
        .post('/usuarios')
        .send({
          id_: "11111111A",
          contacto_: 678901234,
          claves_: ['clave7', 'clave8'],
          rol_: 'admin'
        });
      expect(res.status).to.equal(500);
    });
  });

  // describe('PATCH /usuarios/:id', () => {
  //   it('should update a user', async () => {
  //     const res = await request(app)
  //       .patch(`/usuarios/${primerUsuario.id_}`)
  //       .send({
  //         nombre_: 'Juanita',
  //         contacto_: 678901234,
  //         claves_: ['clave1', 'clave2'],
  //         rol_: 'admin'
  //       });
  //     expect(res.status).to.equal(200);
  //   });

  //   it('should return 404 if the user is not found', async () => {
  //     const res = await request(app)
  //       .patch('/usuarios/12345678Z')
  //       .send({
  //         nombre_: 'Juanito',
  //         contacto_: 678901234,
  //         claves_: ['clave9', 'clave2'],
  //         rol_: 'admin'
  //       });
  //     expect(res.status).to.equal(500);
  //   });
  // });

  // Test for DELETE /usuarios/:id (delete a user by ID)
  describe('DELETE /usuarios/:id', () => {
    it('should delete a user', async () => {
      const res = await request(app).delete(`/usuarios/${primerUsuario.id_}`);
      expect(res.status).to.equal(200);
      await usuarioModel.create(primerUsuario);
    });

    it('should return 404 if the user is not found', async () => {
      const res = await request(app).delete('/usuarios/12345678Z');
      expect(res.status).to.equal(404);
      expect(res.body).to.include({ msg: 'No se encontró al usuario' });
    });
  });

  // Test for login
  describe('POST /login', () => {
    it('should return 400 if data is missing', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          nombre_usuario: primerUsuario.claves_[0]
        });
      expect(res.status).to.equal(400);
    });
  });
});