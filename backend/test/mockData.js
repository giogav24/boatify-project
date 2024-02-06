const casual = require('casual');
const mongoose = require('mongoose');

const Utente = require('../models/Utente')
const Barca = require('../models/Barca')
const Prenotazione = require('../models/Prenotazione')
const Patente = require('../models/Patente');

casual.define('Utente', () => ({
    ruolo: casual.random_element(['Noleggiatore', 'Proprietario']),
    nome: casual.first_name,
    cognome: casual.last_name,
    data_nascita: casual.date('YYYY-MM-DD'),
    email: casual.email,
    nr_telefono: casual.phone,
    password: casual.password,
    barca: casual.barca, 
    patenti: casual.patente,
    prenotazioni: [], 
    verifiedEmail: casual.boolean,
    verifiedTelefono: casual.boolean
}));

casual.define('Barca', () => ({
    proprietario: casual.utente, 
    targa: casual.random_element(['AAA123', 'BBB456', 'CCC789']),
    tipo_barca: casual.random_element(['yacht', 'pedalo', 'canoa', 'barca a vela', 'motoscafo']),
    patente: casual.random_element(['A motore', 'A motore e vela', 'B motore', 'B motore e vela', 'C motore', 'C motore e vela']),
    posizione: casual.city,
    prezzo_ora: casual.double({ min: 5, max: 20, fixed: 2 }),
    prezzo_giorno: casual.double({ min: 50, max: 200, fixed: 2 }),
    prenotazioni: []
}));

casual.define('prenotazione', () => ({
    barca: casual.barca,
    data_inizio: casual.date('YYYY-MM-DD'),
    data_fine: casual.date('YYYY-MM-DD'),
    utente: casual.utente,
    posizione: casual.city
}));

casual.define('patente', () => ({
    tipo_patente: casual.random_element(['A motore', 'A motore e vela', 'B motore', 'B motore e vela', 'C motore', 'C motore e vela']),
    noleggiatore: casual.utente,
    numero_patente: casual.word,
    data_emissione: casual.date('YYYY-MM-DD'),
    data_scadenza: casual.date('YYYY-MM-DD')
}));

const createFakeData = async () => {
    // Creazione di utenti di esempio
    const fakeUtenti = Array.from({ length: 5 }, () => casual.utente);
    await Utente.create(fakeUtenti);

    // Creazione di barche di esempio
    const fakeBarche = Array.from({ length: 5 }, () => casual.barca);
    await Barca.create(fakeBarche);

    // Creazione di prenotazioni di esempio
    const fakePrenotazioni = Array.from({ length: 5 }, () => casual.prenotazione);
    await Prenotazione.create(fakePrenotazioni);

    // Creazione di patenti di esempio
    const fakePatenti = Array.from({ length: 5 }, () => casual.patente);
    await Patente.create(fakePatenti);

    console.log('Dati fittizi creati con successo.');
};

createFakeData();
