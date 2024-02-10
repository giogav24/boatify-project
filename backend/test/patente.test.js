const { app, startServer, closeServer } = require('../server'); 
const request = require('supertest');

// Import my models
const Utente = require('../models/Utente');
const Patente = require('../models/Patente');


beforeAll(async () => {
    await startServer();
});

afterEach(async () => {
    await Utente.deleteMany({});
    await Patente.deleteMany({});
})

afterAll(async () => {
    await closeServer();
});

describe('Test patente', () => {

  test('POST /registraPatente ok', async () => {
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

    const patenteRes = await request(app)
        .post('/api/v1/patenti/registraPatente')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe@example.com', 
            tipo_patente: 'A motore', 
            numero_patente: '11111', 
            data_emissione: '2021-01-24', 
            data_scadenza: '2025-01-24',
        });

    expect(patenteRes.status).toBe(200);
    
    });

    test('POST /registraPatente utente non noleggiatore', async () => {
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
            ruolo: 'Proprietario',
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
    
        const patenteRes = await request(app)
            .post('/api/v1/patenti/registraPatente')
            .set('Content-Type', 'application/json')
            .send({
                email: 'john.doe@example.com', 
                tipo_patente: 'A motore', 
                numero_patente: '11111', 
                data_emissione: '2021-01-24', 
                data_scadenza: '2025-01-24'
            });
        expect(patenteRes.status).toBe(400);
        expect(patenteRes.body).toEqual({ message: 'Utente non trovato o ruolo non valido' , success: false })
    });

    test('GET /getPatentiUtente ok', async () => {
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
    
        const patenteRes = await request(app)
            .post('/api/v1/patenti/registraPatente')
            .set('Content-Type', 'application/json')
            .send({
                email: 'john.doe@example.com', 
                tipo_patente: 'A motore', 
                numero_patente: '11111', 
                data_emissione: '2021-01-24', 
                data_scadenza: '2025-01-24',
            });
        expect(patenteRes.status).toBe(200);

        const patenteRes1 = await request(app)
            .post('/api/v1/patenti/registraPatente')
            .set('Content-Type', 'application/json')
            .send({
                email: 'john.doe@example.com', 
                tipo_patente: 'C motore e vela', 
                numero_patente: '11222', 
                data_emissione: '2021-01-24', 
                data_scadenza: '2025-01-24',
            });
        expect(patenteRes1.status).toBe(200);

        const getDatiRes = await request(app)
            .get('/api/v1/patenti/getPatentiUtente')
            .set('Content-Type', 'application/json')
            .send({
                email: 'john.doe@example.com', 
            });

        expect(getDatiRes.status).toBe(200);
        expect(getDatiRes.body).toEqual({
            success: true,
            responsePatenti: expect.arrayContaining([
                {
                  numero_patente: '11111',
                  tipo_patente: 'A motore',
                  data_emissione: '2021-01-24T00:00:00.000Z',
                  data_scadenza: '2025-01-24T00:00:00.000Z'
                },
                {
                  numero_patente: '11222',
                  tipo_patente: 'C motore e vela',
                  data_emissione: '2021-01-24T00:00:00.000Z',
                  data_scadenza: '2025-01-24T00:00:00.000Z'
                }
              ])
          }); 
        
    });

    test('GET /getPatentiUtente utente senza patenti', async () => {
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
    
        const getDatiRes = await request(app)
            .get('/api/v1/patenti/getPatentiUtente')
            .set('Content-Type', 'application/json')
            .send({
                email: 'john.doe@example.com', 
            });
    
        expect(getDatiRes.status).toBe(404);
        expect(getDatiRes.body).toEqual({success: false, message: "L'utente non ha patenti registrate"}); 
            
    });

    test('DELETE /eliminaPatente ok', async () => {
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
    
        const patenteRes = await request(app)
            .post('/api/v1/patenti/registraPatente')
            .set('Content-Type', 'application/json')
            .send({
                email: 'john.doe@example.com', 
                tipo_patente: 'A motore', 
                numero_patente: '11111', 
                data_emissione: '2021-01-24', 
                data_scadenza: '2025-01-24',
            });
    
        expect(patenteRes.status).toBe(200);

        const deletePatRes = await request(app)
            .delete('/api/v1/patenti/eliminaPatente')
            .set('Content-Type', 'application/json')
            .send({
                email: 'john.doe@example.com', 
                tipo_patente: 'A motore', 
                numero_patente: '11111', 
                data_emissione: '2021-01-24', 
                data_scadenza: '2025-01-24',
            });
    
        expect(deletePatRes.status).toBe(200);
        
    });

    test('DELETE /eliminaPatente patente non esistente', async () => {
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
    
        const patenteRes = await request(app)
            .post('/api/v1/patenti/registraPatente')
            .set('Content-Type', 'application/json')
            .send({
                email: 'john.doe@example.com', 
                tipo_patente: 'A motore', 
                numero_patente: '11111', 
                data_emissione: '2021-01-24', 
                data_scadenza: '2025-01-24',
            });
    
        expect(patenteRes.status).toBe(200);

        const deletePatRes = await request(app)
            .delete('/api/v1/patenti/eliminaPatente')
            .set('Content-Type', 'application/json')
            .send({
                email: 'john.doe@example.com', 
                tipo_patente: 'A motore', 
                numero_patente: '11222', 
                data_emissione: '2021-01-24', 
                data_scadenza: '2025-01-24',
            });
    
        expect(deletePatRes.status).toBe(404);
        expect(deletePatRes.body).toEqual({ message: "Patente non trovata per l'utente specificato"  , success: false })
        
    });

    
});

