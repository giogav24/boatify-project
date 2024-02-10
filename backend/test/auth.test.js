const { app, startServer, closeServer } = require('../server'); 
const request = require('supertest');
const mongoose = require('mongoose');

// Import my models
const Utente = require('../models/Utente');


beforeAll(async () => {
    await startServer();
});

afterEach(async () => {
    await Utente.deleteMany({});
})

afterAll(async () => {
    
    await closeServer();
});

describe('Test auth', () => {

  test('POST /registraUtente ok', async () => {
    const res = await request(app)
      .post('/api/v1/auth/registraUtente')
      .set('Content-Type', 'application/json')
      .send({
        nome: 'John',
        cognome: 'Doe',
        nr_telefono: '123456789',
        data_nascita: '1990-01-01',
        email: 'john.doe@example.com',
        password: 'password123',
        ruolo: 'Noleggiatore',
      });

    expect(res.status).toBe(200);
    
  });

  test('POST /registraUtente data non valida', async () => {
    const res = await request(app)
      .post('/api/v1/auth/registraUtente')
      .set('Content-Type', 'application/json')
      .send({
        nome: 'John',
        cognome: 'Doe',
        nr_telefono: '123456789',
        data_nascita: '2024-01-01',
        email: 'john.doe@example.com',
        password: 'password123',
        ruolo: 'Noleggiatore',
      });

    expect(res.status).toBe(400);
    
  });

  test('POST /registraUtente campo mancante', async () => {
    const res = await request(app)
      .post('/api/v1/auth/registraUtente')
      .set('Content-Type', 'application/json')
      .send({
        nome: 'John',
        cognome: 'Doe',
        data_nascita: '1990-01-01',
        email: 'john.doe@example.com',
        password: 'password123',
        ruolo: 'Noleggiatore',
      });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: "Compilare tutti i campi!", success: false })
    
  });

  test('POST /loginUtente ok', async () => {
    // Register a user first
    const res =await request(app)
        .post('/api/v1/auth/registraUtente')
        .set('Content-Type', 'application/json')
        .send({
        nome: 'John',
        cognome: 'Doe',
        nr_telefono: '123456789',
        data_nascita: '1990-01-01',
        email: 'john.doe@example.com',
        password: 'password123',
        ruolo: 'Noleggiatore',
        });
    expect(res.status).toBe(200);

    // Then, attempt to login with the registered user
    const loginRes = await request(app)
        .post('/api/v1/auth/loginUtente')
        .set('Content-Type', 'application/json')
        .send({
        email: 'john.doe@example.com',
        password: 'password123',
        });
    expect(loginRes.status).toBe(200);
    
    });

    test('POST /loginUtente campo mancante', async () => {
        // Register a user first
        const res =await request(app)
            .post('/api/v1/auth/registraUtente')
            .set('Content-Type', 'application/json')
            .send({
            nome: 'John',
            cognome: 'Doe',
            nr_telefono: '123456789',
            data_nascita: '1990-01-01',
            email: 'john.doe@example.com',
            password: 'password123',
            ruolo: 'Noleggiatore',
            });
            expect(res.status).toBe(200);
    
        // Then, attempt to login with the registered user
        const loginRes = await request(app)
            .post('/api/v1/auth/loginUtente')
            .set('Content-Type', 'application/json')
            .send({
            email: 'john.doe@example.com',
            });
    
        expect(loginRes.status).toBe(400);
        expect(loginRes.body).toEqual({ message: "Compilare tutti i campi", success: false })
      });

    test('POST /loginUtente utente inesistente', async () => {
      // Then, attempt to login with the registered user
        const loginRes = await request(app)
            .post('/api/v1/auth/loginUtente')
            .set('Content-Type', 'application/json')
            .send({
              email: 'john.doe@example.com',
              password: 'password123',
            });
        
        expect(loginRes.status).toBe(404);
        expect(loginRes.body).toEqual({ message: 'Utente inesistente', success: false })
      });

    test('POST /loginUtente campo mancante', async () => {
        const res =await request(app)
            .post('/api/v1/auth/registraUtente')
            .set('Content-Type', 'application/json')
            .send({
              nome: 'John',
              cognome: 'Doe',
              nr_telefono: '123456789',
              data_nascita: '1990-01-01',
              email: 'john.doe@example.com',
              password: 'password123',
              ruolo: 'Noleggiatore',
            });
        expect(res.status).toBe(200);
    
        const loginRes = await request(app)
            .post('/api/v1/auth/loginUtente')
            .set('Content-Type', 'application/json')
            .send({
              email: 'john.doe@example.com',
              password: 'password111',
            });
    
        expect(loginRes.status).toBe(401);
        expect(loginRes.body).toEqual({ message: 'Password incorretta', success: false })
      });

    test('POST /cambiaPassword ok', async() => {
      //register a user first
      const res =await request(app)
            .post('/api/v1/auth/registraUtente')
            .set('Content-Type', 'application/json')
            .send({
              nome: 'John',
              cognome: 'Doe',
              nr_telefono: '123456789',
              data_nascita: '1990-01-01',
              email: 'john.doe@example.com',
              password: 'password123',
              ruolo: 'Noleggiatore',
            });
      expect(res.status).toBe(200);

      const cambioPassRes = await request(app)
            .post('/api/v1/auth/cambiaPassword')
            .set('Content-Type', 'application/json')
            .send({
              email: 'john.doe@example.com',
              oldPassword: 'password123',
              newPassword: 'test1234'
            });
      expect(cambioPassRes.status).toBe(200);
      
    });

    test.todo('DELETE Account');
    test.todo('LOGOUT Account');
});

