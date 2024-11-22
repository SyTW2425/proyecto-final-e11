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
  await usuarioModel.deleteMany({});
});

describe('Model Usuario', () => {
  
    describe('GET /usuarios', () => {
      it('should return all users', async () => {
        const res = await request(app).get('/usuarios');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.lengthOf(2);
      });
  
      it('should return 404 if no users are found', async () => {
        await usuarioModel.deleteMany({});
        const res = await request(app).get('/usuarios');
        expect(res.status).to.equal(404);
        expect(res.body).to.include({ msg: 'No se encontró a los usuarios' });
        await usuarioModel.create(primerUsuario);
        await usuarioModel.create(segundoUsuario);
      });
    });
  
    describe('GET /usuarios/:id', () => {
      it('should return a user', async () => {
        const res = await request(app).get(`/usuarios/${primerUsuario.id_}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.include(primerUsuario);
      });
  
      it('should return 404 if the user is not found', async () => {
        const res = await request(app).get('/usuarios/12345678Z');
        expect(res.status).to.equal(404);
        expect(res.body).to.include({ msg: 'No se encontró al usuario' });
      });
    });
  
    describe('POST /usuarios', () => {
      it('should create a user', async () => {
        const res = await request(app)
          .post('/usuarios')
          .send({
            id_: "33333333C",
            nombre_: 'Luis',
            contacto_: 612345678,
            claves_: ['clave5', 'clave6'],
            rol_: 'user'
          });
        expect(res.status).to.equal(201);
        expect(res.body).to.include({ msg: 'Usuario creado' });
      });
  
      it('should return 400 if the user is not created', async () => {
        const res = await request(app)
          .post('/usuarios')
          .send({
            id_: "11111111A",
            nombre_: 'Juan',
            contacto_: 678901234,
            claves_: ['clave1', 'clave2'],
            rol_: 'admin'
          });
        expect(res.status).to.equal(400);
        expect(res.body).to.include({ msg: 'No se pudo crear al usuario' });
      });
    });

    // describe('PUT /usuarios/:id', () => {
    //   it('should update a user', async () => {
    //     const res = await request(app)
    //       .put(`/usuarios/${primerUsuario.id_}`)
    //       .send({
    //         nombre_: 'Juanito',
    //         contacto_: 678901234,
    //         claves_: ['clave1', 'clave2'],
    //         rol_: 'admin'
    //       });
    //     expect(res.status).to.equal(200);
    //     expect(res.body).to.include({ msg: 'Usuario actualizado' });
    //   });
  
    //   it('should return 404 if the user is not found', async () => {
    //     const res = await request(app)
    //       .put('/usuarios/12345678Z')
    //       .send({
    //         nombre_: 'Juanito',
    //         contacto_: 678901234,
    //         claves_: ['clave1', 'clave2'],
    //         rol_: 'admin'
    //       });
    //     expect(res.status).to.equal(404);
    //     expect(res.body).to.include({ msg: 'No se encontró al usuario' });
    //   });
    // });

    describe('DELETE /usuarios/:id', () => {
      it('should delete a user', async () => {
        const res = await request(app).delete(`/usuarios/${primerUsuario.id_}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.include({ msg: 'Usuario eliminado' });
      });
  
      it('should return 404 if the user is not found', async () => {
        const res = await request(app).delete('/usuarios/12345678Z');
        expect(res.status).to.equal(404);
        expect(res.body).to.include({ msg: 'No se encontró al usuario' });
      });
    });
});