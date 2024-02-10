const { app, startServer, closeServer } = require('../server'); 
const request = require('supertest');

// Import my models
const Utente = require('../models/Utente');
const Barca = require('../models/Barca')
const Prenotazione = require('../models/Prenotazione')


beforeAll(async () => {
    await startServer();
});

afterEach(async () => {
    await Utente.deleteMany({});
    await Barca.deleteMany({});
    await Prenotazione.deleteMany({});
})

afterAll(async () => {
    await closeServer();
});

describe('Test barca', () => {

  test('POST /aggiungiBarca ok', async () => {
    //register a user as a proprietario
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
        ruolo: 'Proprietario',
      });
    expect(res.status).toBe(200);

    //login 
    const loginRes = await request(app)
        .post('/api/v1/auth/loginUtente')
        .set('Content-Type', 'application/json')
        .send({
        email: 'john.doe@example.com',
        password: 'password123',
        });
    expect(loginRes.status).toBe(200);

    //add a boat
    const addBarcaRes = await request(app)
        .post('/api/v1/barca/aggiungiBarca')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe@example.com',
            targa: 'ABC123', 
            tipo_barca: 'yacht', 
            posizione: 'Esempio', 
            prezzo_ora: 20, 
            prezzo_giorno: 110
        });
    expect(addBarcaRes.status).toBe(200);

    
  });

  test('POST /aggiungiBarca utente non autorizzato', async () => {
    //register a user as a proprietario
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
        ruolo: 'Noleggiatore'
      });
    expect(res.status).toBe(200);

    //login 
    const loginRes = await request(app)
        .post('/api/v1/auth/loginUtente')
        .set('Content-Type', 'application/json')
        .send({
        email: 'john.doe@example.com',
        password: 'password123'
        });
    expect(loginRes.status).toBe(200);

    //add a boat
    const addBarcaRes = await request(app)
        .post('/api/v1/barca/aggiungiBarca')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe@example.com',
            targa: 'ABC123', 
            tipo_barca: 'yacht', 
            posizione: 'Esempio', 
            prezzo_ora: 20, 
            prezzo_giorno: 110
        });
    expect(addBarcaRes.status).toBe(400);
    expect(addBarcaRes.body).toEqual({ message: 'Utente non trovato o ruolo non valido', success: false })
    
  });

  test('GET /getDatiBarca ok', async () => {
    //register a user as a proprietario
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
        ruolo: 'Proprietario'
      });
    expect(res.status).toBe(200);

    //login 
    const loginRes = await request(app)
        .post('/api/v1/auth/loginUtente')
        .set('Content-Type', 'application/json')
        .send({
        email: 'john.doe@example.com',
        password: 'password123'
        });
    expect(loginRes.status).toBe(200);

    //add a boat
    const addBarcaRes = await request(app)
        .post('/api/v1/barca/aggiungiBarca')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe@example.com',
            targa: 'ABC123', 
            tipo_barca: 'yacht', 
            posizione: 'Esempio', 
            prezzo_ora: 20, 
            prezzo_giorno: 110
        });
    
    expect(addBarcaRes.status).toBe(200);
    
    const getDatiRes = await request(app)
        .get('/api/v1/barca/getDatiBarca')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe@example.com',
            targa: 'ABC123'
        });

    expect(getDatiRes.status).toBe(200);

  });

  test('GET /getDatiBarca barca non trovata', async () => {
    //register a user as a proprietario
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
        ruolo: 'Proprietario'
      });
    expect(res.status).toBe(200);

    //login 
    const loginRes = await request(app)
        .post('/api/v1/auth/loginUtente')
        .set('Content-Type', 'application/json')
        .send({
        email: 'john.doe@example.com',
        password: 'password123'
        });
    expect(loginRes.status).toBe(200);

    //add a boat
    const addBarcaRes = await request(app)
        .post('/api/v1/barca/aggiungiBarca')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe@example.com',
            targa: 'ABC123', 
            tipo_barca: 'yacht', 
            posizione: 'Esempio', 
            prezzo_ora: 20, 
            prezzo_giorno: 110
        });
    
    expect(addBarcaRes.status).toBe(200);
    
    const getDatiRes = await request(app)
        .get('/api/v1/barca/getDatiBarca')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe@example.com',
            targa: 'ABC1111'
        });

    expect(getDatiRes.status).toBe(404);
    expect(getDatiRes.body).toEqual({ message: 'Barca non trovata per l\'utente specificato', success: false })

  });

  test('DELETE /eliminaBarca ok', async () => {
    //register a user as a proprietario
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
        ruolo: 'Proprietario'
      });
    expect(res.status).toBe(200);

    //login 
    const loginRes = await request(app)
        .post('/api/v1/auth/loginUtente')
        .set('Content-Type', 'application/json')
        .send({
        email: 'john.doe@example.com',
        password: 'password123'
        });
    expect(loginRes.status).toBe(200);

    //add a boat
    const addBarcaRes = await request(app)
        .post('/api/v1/barca/aggiungiBarca')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe@example.com',
            targa: 'ABC123', 
            tipo_barca: 'yacht', 
            posizione: 'Esempio', 
            prezzo_ora: 20, 
            prezzo_giorno: 110
        });
    expect(addBarcaRes.status).toBe(200);
    
    const delBarcaRes = await request(app)
        .delete('/api/v1/barca/eliminaBarca')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe@example.com',
            targa: 'ABC123'
        });
    expect(delBarcaRes.status).toBe(200);
    
  });

  test('DELETE /eliminaBarca barca non trovata', async () => {
    //register a user as a proprietario
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
        ruolo: 'Proprietario'
      });
    expect(res.status).toBe(200);

    //login 
    const loginRes = await request(app)
        .post('/api/v1/auth/loginUtente')
        .set('Content-Type', 'application/json')
        .send({
        email: 'john.doe@example.com',
        password: 'password123'
        });
    expect(loginRes.status).toBe(200);

    //add a boat
    const addBarcaRes = await request(app)
        .post('/api/v1/barca/aggiungiBarca')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe@example.com',
            targa: 'ABC123', 
            tipo_barca: 'yacht', 
            posizione: 'Esempio', 
            prezzo_ora: 20, 
            prezzo_giorno: 110
        });
    expect(addBarcaRes.status).toBe(200);
    
    const delBarcaRes = await request(app)
        .delete('/api/v1/barca/eliminaBarca')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe@example.com',
            targa: 'ABC111'
        });
    expect(delBarcaRes.status).toBe(404);
    expect(delBarcaRes.body).toEqual({ message: "Barca non trovata per l'utente specificato", success: false })

    
  });

  test('DELETE /eliminaBarca barca con prenotazione', async () => {
    //register a user as a proprietario
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
        ruolo: 'Proprietario'
      });
    expect(res.status).toBe(200);

    //login 
    const loginRes = await request(app)
        .post('/api/v1/auth/loginUtente')
        .set('Content-Type', 'application/json')
        .send({
        email: 'john.doe@example.com',
        password: 'password123'
        });
    expect(loginRes.status).toBe(200);

    //add a boat
    const addBarcaRes = await request(app)
        .post('/api/v1/barca/aggiungiBarca')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe@example.com',
            targa: 'ABC123', 
            tipo_barca: 'yacht', 
            posizione: 'Esempio', 
            prezzo_ora: 20, 
            prezzo_giorno: 110
        });
    expect(addBarcaRes.status).toBe(200);
    
    //add a booking:
    //register a user as noleggiatore
    const res2 = await request(app)
      .post('/api/v1/auth/registraUtente')
      .set('Content-Type', 'application/json')
      .send({
        nome: 'John2',
        cognome: 'Doe2',
        nr_telefono: '123456789',
        data_nascita: '1990-01-01',
        email: 'john.doe2@example.com',
        password: 'password123',
        ruolo: 'Noleggiatore'
      });
    expect(res2.status).toBe(200);

    //login
    const loginRes1 = await request(app)
        .post('/api/v1/auth/loginUtente')
        .set('Content-Type', 'application/json')
        .send({
        email: 'john.doe2@example.com',
        password: 'password123'
        });
    expect(loginRes1.status).toBe(200);
    
    //add a booking
    const addPrenotazioneRes = await request(app)
        .post('/api/v1/barca/creaPrenotazione')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe2@example.com',
            targa: 'ABC123', 
            data_inizio: "2024-04-01T12:30:00.000Z",
            data_fine : "2024-04-01T16:30:00.000Z"
        });
    expect(addPrenotazioneRes.status).toBe(200);

    const delBarcaRes = await request(app)
        .delete('/api/v1/barca/eliminaBarca')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe@example.com',
            targa: 'ABC123'
        });
    expect(delBarcaRes.status).toBe(400);
    expect(delBarcaRes.body).toEqual({ message: "Ci sono prenotazioni per questa barca, impossibile eliminarla !!", success: false })

  });

  test('POST /creaPrenotazione ok', async () => {
    //register a user as a proprietario
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
        ruolo: 'Proprietario'
      });
    expect(res.status).toBe(200);

    //login 
    const loginRes = await request(app)
        .post('/api/v1/auth/loginUtente')
        .set('Content-Type', 'application/json')
        .send({
        email: 'john.doe@example.com',
        password: 'password123'
        });
    expect(loginRes.status).toBe(200);

    //add a boat
    const addBarcaRes = await request(app)
        .post('/api/v1/barca/aggiungiBarca')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe@example.com',
            targa: 'ABC123', 
            tipo_barca: 'yacht', 
            posizione: 'Esempio', 
            prezzo_ora: 20, 
            prezzo_giorno: 110,
        });
    expect(addBarcaRes.status).toBe(200);
    
    //register a user as noleggiatore
    const res2 = await request(app)
      .post('/api/v1/auth/registraUtente')
      .set('Content-Type', 'application/json')
      .send({
        nome: 'John2',
        cognome: 'Doe2',
        nr_telefono: '123456789',
        data_nascita: '1990-01-01',
        email: 'john.doe2@example.com',
        password: 'password123',
        ruolo: 'Noleggiatore'
      });
    expect(res2.status).toBe(200);

    //login
    const loginRes1 = await request(app)
        .post('/api/v1/auth/loginUtente')
        .set('Content-Type', 'application/json')
        .send({
        email: 'john.doe2@example.com',
        password: 'password123'
        });
    expect(loginRes1.status).toBe(200);
    
    //add a booking
    const addPrenotazioneRes = await request(app)
        .post('/api/v1/barca/creaPrenotazione')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe2@example.com',
            targa: 'ABC123', 
            data_inizio: "2024-04-01T12:30:00.000Z",
            data_fine : "2024-04-01T16:30:00.000Z"
        });
    expect(addPrenotazioneRes.status).toBe(200);
  });

  test('POST /creaPrenotazione barca non trovata', async () => {
    //register a user as a proprietario
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
        ruolo: 'Proprietario'
      });
    expect(res.status).toBe(200);

    //login 
    const loginRes = await request(app)
        .post('/api/v1/auth/loginUtente')
        .set('Content-Type', 'application/json')
        .send({
        email: 'john.doe@example.com',
        password: 'password123'
        });
    expect(loginRes.status).toBe(200);

    //add a boat
    const addBarcaRes = await request(app)
        .post('/api/v1/barca/aggiungiBarca')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe@example.com',
            targa: 'ABC123', 
            tipo_barca: 'yacht', 
            posizione: 'Esempio', 
            prezzo_ora: 20, 
            prezzo_giorno: 110,
        });
    expect(addBarcaRes.status).toBe(200);
    
    //register a user as noleggiatore
    const res2 = await request(app)
      .post('/api/v1/auth/registraUtente')
      .set('Content-Type', 'application/json')
      .send({
        nome: 'John2',
        cognome: 'Doe2',
        nr_telefono: '123456789',
        data_nascita: '1990-01-01',
        email: 'john.doe2@example.com',
        password: 'password123',
        ruolo: 'Noleggiatore'
      });
    expect(res2.status).toBe(200);

    //login
    const loginRes1 = await request(app)
        .post('/api/v1/auth/loginUtente')
        .set('Content-Type', 'application/json')
        .send({
        email: 'john.doe2@example.com',
        password: 'password123'
        });
    expect(loginRes1.status).toBe(200);
    
    //add a booking
    const addPrenotazioneRes = await request(app)
        .post('/api/v1/barca/creaPrenotazione')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe2@example.com',
            targa: 'AAAAA', 
            data_inizio: "2024-04-01T12:30:00.000Z",
            data_fine : "2024-04-01T16:30:00.000Z"
        });
    expect(addPrenotazioneRes.status).toBe(404);
    expect(addPrenotazioneRes.body).toEqual({ message: 'Barca non trovata', success: false })

  });

  test('POST /creaPrenotazione prenotazioni conflittuali sulla stessa barca', async () => {
    //register a user as a proprietario
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
        ruolo: 'Proprietario'
      });
    expect(res.status).toBe(200);

    //login 
    const loginRes = await request(app)
        .post('/api/v1/auth/loginUtente')
        .set('Content-Type', 'application/json')
        .send({
        email: 'john.doe@example.com',
        password: 'password123'
        });
    expect(loginRes.status).toBe(200);

    //add a boat
    const addBarcaRes = await request(app)
        .post('/api/v1/barca/aggiungiBarca')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe@example.com',
            targa: 'ABC123', 
            tipo_barca: 'yacht', 
            posizione: 'Esempio', 
            prezzo_ora: 20, 
            prezzo_giorno: 110,
        });
    expect(addBarcaRes.status).toBe(200);
    
    //register a user as noleggiatore
    const res2 = await request(app)
      .post('/api/v1/auth/registraUtente')
      .set('Content-Type', 'application/json')
      .send({
        nome: 'John2',
        cognome: 'Doe2',
        nr_telefono: '123456789',
        data_nascita: '1990-01-01',
        email: 'john.doe2@example.com',
        password: 'password123',
        ruolo: 'Noleggiatore'
      });
    expect(res2.status).toBe(200);

    //login
    const loginRes1 = await request(app)
        .post('/api/v1/auth/loginUtente')
        .set('Content-Type', 'application/json')
        .send({
        email: 'john.doe2@example.com',
        password: 'password123'
        });
    expect(loginRes1.status).toBe(200);
    
    //add a booking
    const addPrenotazioneRes = await request(app)
        .post('/api/v1/barca/creaPrenotazione')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe2@example.com',
            targa: 'ABC123', 
            data_inizio: "2024-04-01T12:30:00.000Z",
            data_fine : "2024-04-01T16:30:00.000Z"
        });
    expect(addPrenotazioneRes.status).toBe(200);

    //register a second user as noleggiatore
    const res3 = await request(app)
      .post('/api/v1/auth/registraUtente')
      .set('Content-Type', 'application/json')
      .send({
        nome: 'John3',
        cognome: 'Doe3',
        nr_telefono: '123456789',
        data_nascita: '1990-01-01',
        email: 'john.doe3@example.com',
        password: 'password123',
        ruolo: 'Noleggiatore'
      });
    expect(res3.status).toBe(200);

    //login
    const loginRes3 = await request(app)
        .post('/api/v1/auth/loginUtente')
        .set('Content-Type', 'application/json')
        .send({
        email: 'john.doe2@example.com',
        password: 'password123'
        });
    expect(loginRes3.status).toBe(200);

    //add a booking
    const addPrenotazioneRes2 = await request(app)
        .post('/api/v1/barca/creaPrenotazione')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe3@example.com',
            targa: 'ABC123', 
            data_inizio: "2024-04-01T16:00:00.000Z",
            data_fine : "2024-04-01T18:30:00.000Z"
        });
    expect(addPrenotazioneRes2.status).toBe(400);
    expect(addPrenotazioneRes2.body).toEqual({ message: 'La barca ha prenotazioni nello stesso intervallo di tempo', success: false })
  });

  test('POST /creaPrenotazione prenotazioni conflittuali sulla stessa barca', async () => {
    //register a user as a proprietario
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
        ruolo: 'Proprietario'
      });
    expect(res.status).toBe(200);

    //login 
    const loginRes = await request(app)
        .post('/api/v1/auth/loginUtente')
        .set('Content-Type', 'application/json')
        .send({
        email: 'john.doe@example.com',
        password: 'password123'
        });
    expect(loginRes.status).toBe(200);

    //add a boat
    const addBarcaRes = await request(app)
        .post('/api/v1/barca/aggiungiBarca')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe@example.com',
            targa: 'ABC123', 
            tipo_barca: 'yacht', 
            posizione: 'Esempio', 
            prezzo_ora: 20, 
            prezzo_giorno: 110,
        });
    expect(addBarcaRes.status).toBe(200);
    
    //add another boat
    const addBarcaRes1 = await request(app)
        .post('/api/v1/barca/aggiungiBarca')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe@example.com',
            targa: 'AAA111', 
            tipo_barca: 'yacht', 
            posizione: 'Esempio', 
            prezzo_ora: 20, 
            prezzo_giorno: 110,
        });
    expect(addBarcaRes1.status).toBe(200);
    
    //register a user as noleggiatore
    const res2 = await request(app)
      .post('/api/v1/auth/registraUtente')
      .set('Content-Type', 'application/json')
      .send({
        nome: 'John2',
        cognome: 'Doe2',
        nr_telefono: '123456789',
        data_nascita: '1990-01-01',
        email: 'john.doe2@example.com',
        password: 'password123',
        ruolo: 'Noleggiatore'
      });
    expect(res2.status).toBe(200);

    //login
    const loginRes1 = await request(app)
        .post('/api/v1/auth/loginUtente')
        .set('Content-Type', 'application/json')
        .send({
        email: 'john.doe2@example.com',
        password: 'password123'
        });
    expect(loginRes1.status).toBe(200);
    
    //add a booking
    const addPrenotazioneRes = await request(app)
        .post('/api/v1/barca/creaPrenotazione')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe2@example.com',
            targa: 'ABC123', 
            data_inizio: "2024-04-01T12:30:00.000Z",
            data_fine : "2024-04-01T16:30:00.000Z"
        });
    expect(addPrenotazioneRes.status).toBe(200);

    //add a booking
    const addPrenotazioneRes2 = await request(app)
        .post('/api/v1/barca/creaPrenotazione')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe2@example.com',
            targa: 'AAA111', 
            data_inizio: "2024-04-01T13:00:00.000Z",
            data_fine : "2024-04-01T18:30:00.000Z"
        });
    expect(addPrenotazioneRes2.status).toBe(400);
    expect(addPrenotazioneRes2.body).toEqual({ message: 'L\'utente ha già altre prenotazioni nello stesso intervallo di tempo', success: false })
  });

  test('GET /verificaBarcheDisponibili ok', async () => {
    //register a user as a proprietario
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
        ruolo: 'Proprietario',
      });
    expect(res.status).toBe(200);

    //login 
    const loginRes = await request(app)
        .post('/api/v1/auth/loginUtente')
        .set('Content-Type', 'application/json')
        .send({
        email: 'john.doe@example.com',
        password: 'password123',
        });
    expect(loginRes.status).toBe(200);

    //add a boat
    const addBarcaRes = await request(app)
        .post('/api/v1/barca/aggiungiBarca')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe@example.com',
            targa: 'ABC123', 
            tipo_barca: 'yacht', 
            posizione: 'Riva', 
            prezzo_ora: 20, 
            prezzo_giorno: 110
        });
    expect(addBarcaRes.status).toBe(200);
    
    //add a second boat
    const addBarcaRes1 = await request(app)
        .post('/api/v1/barca/aggiungiBarca')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe@example.com',
            targa: 'CDE456', 
            tipo_barca: 'yacht', 
            posizione: 'Riva', 
            prezzo_ora: 20, 
            prezzo_giorno: 110
        });
    expect(addBarcaRes1.status).toBe(200);

    //add a third boat
    const addBarcaRes2 = await request(app)
        .post('/api/v1/barca/aggiungiBarca')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe@example.com',
            targa: 'FGH789', 
            tipo_barca: 'yacht', 
            posizione: 'Peschiera', 
            prezzo_ora: 20, 
            prezzo_giorno: 110
        });
    expect(addBarcaRes2.status).toBe(200);

    //register a user as noleggiatore
    const res1 = await request(app)
      .post('/api/v1/auth/registraUtente')
      .set('Content-Type', 'application/json')
      .send({
        nome: 'John1',
        cognome: 'Doe1',
        nr_telefono: '123456789',
        data_nascita: '1990-01-01',
        email: 'john.doe1@example.com',
        password: 'password123',
        ruolo: 'Noleggiatore'
      });
    expect(res1.status).toBe(200);

    //login
    const loginRes1 = await request(app)
        .post('/api/v1/auth/loginUtente')
        .set('Content-Type', 'application/json')
        .send({
        email: 'john.doe1@example.com',
        password: 'password123'
        });
    expect(loginRes1.status).toBe(200);
    
    //add a booking
    const addPrenotazioneRes = await request(app)
        .post('/api/v1/barca/creaPrenotazione')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe1@example.com',
            targa: 'ABC123', 
            data_inizio: "2024-04-01T12:30:00.000Z",
            data_fine : "2024-04-01T16:30:00.000Z"
        });
    expect(addPrenotazioneRes.status).toBe(200);

    const dispRes = await request(app)
        .get('/api/v1/barca/verificaBarcheDisponibili')
        .set('Content-Type', 'application/json')
        .send({
            data: "2024-05-01",
            luogo: "Riva"
        });
    expect(dispRes.status).toBe(200)
    
    expect(dispRes.body).toEqual({
        success: true,
        barcheDisponibili: expect.arrayContaining([
          {
            targa: 'ABC123',
            tipo_barca: 'yacht',
            posizione: 'Riva',
            prezzo_ora: 20,
            prezzo_giorno: 110,
            __v: 0
          },
          {
            targa: 'CDE456',
            tipo_barca: 'yacht',
            posizione: 'Riva',
            prezzo_ora: 20,
            prezzo_giorno: 110,
            __v: 0
          }
        ])
      });      

    const dispRes1 = await request(app)
        .get('/api/v1/barca/verificaBarcheDisponibili')
        .set('Content-Type', 'application/json')
        .send({
            data: "2024-04-01T12:30:00.000Z",
            luogo: "Riva"
        });
    expect(dispRes1.status).toBe(200)
    expect(dispRes1.body).toEqual({
        success: true,
        barcheDisponibili: expect.arrayContaining([
          {
            targa: 'ABC123',
            tipo_barca: 'yacht',
            posizione: 'Riva',
            prezzo_ora: 20,
            prezzo_giorno: 110,
            __v: 0
          }
        ])
      });  
  });

  test('GET /getDatiPrenotazione ok', async () => {
    //register a user as a proprietario
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
        ruolo: 'Proprietario'
      });
    expect(res.status).toBe(200);

    //login 
    const loginRes = await request(app)
        .post('/api/v1/auth/loginUtente')
        .set('Content-Type', 'application/json')
        .send({
        email: 'john.doe@example.com',
        password: 'password123'
        });
    expect(loginRes.status).toBe(200);

    //add a boat
    const addBarcaRes = await request(app)
        .post('/api/v1/barca/aggiungiBarca')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe@example.com',
            targa: 'ABC123', 
            tipo_barca: 'yacht', 
            posizione: 'Esempio', 
            prezzo_ora: 20, 
            prezzo_giorno: 110,
        });
    expect(addBarcaRes.status).toBe(200);
    
    //register a user as noleggiatore
    const res2 = await request(app)
      .post('/api/v1/auth/registraUtente')
      .set('Content-Type', 'application/json')
      .send({
        nome: 'John2',
        cognome: 'Doe2',
        nr_telefono: '123456789',
        data_nascita: '1990-01-01',
        email: 'john.doe2@example.com',
        password: 'password123',
        ruolo: 'Noleggiatore'
      });
    expect(res2.status).toBe(200);

    //login
    const loginRes1 = await request(app)
        .post('/api/v1/auth/loginUtente')
        .set('Content-Type', 'application/json')
        .send({
        email: 'john.doe2@example.com',
        password: 'password123'
        });
    expect(loginRes1.status).toBe(200);
    
    //add a booking
    const addPrenotazioneRes = await request(app)
        .post('/api/v1/barca/creaPrenotazione')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe2@example.com',
            targa: 'ABC123', 
            data_inizio: "2024-04-01T12:30:00.000Z",
            data_fine : "2024-04-01T16:30:00.000Z"
        });
    expect(addPrenotazioneRes.status).toBe(200);

    const datiBarcaRes = await request(app)
        .get('/api/v1/barca/getDatiPrenotazione')
        .set('Content-Type', 'application/json')
        .send({
            email: 'john.doe2@example.com',
        });
    expect(datiBarcaRes.status).toBe(200);
    expect(datiBarcaRes.body).toEqual({
        success: true,
        datiPrenotazioni: expect.arrayContaining([
            {
                barca: expect.objectContaining({
                    targa: "ABC123",
                    tipo_barca: "yacht",
                    proprietario: expect.objectContaining({
                        nome: 'John',
                        cognome: 'Doe',
                        email: 'john.doe@example.com'
                    }),
                    prezzo_ora: 20,
                    prezzo_giorno: 110,
                }),
                data_inizio: '2024-04-01T12:30:00.000Z',
                data_fine: '2024-04-01T16:30:00.000Z',
                posizione: 'Esempio'
            }
        ])
      });      

  });




  

    test.todo('Avvio noleggio');
    test.todo('Termina noleggio');
});

