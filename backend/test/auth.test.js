const { app, startServer, closeServer } = require('../server'); 
const request = require('supertest');
const mongoose = require('mongoose');

// Import your models
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


  
});
