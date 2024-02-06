//Modelli Mongoose per MongoDB. Modello barca.

var mongoose = require('mongoose');

const schemaBarca = new mongoose.Schema({
    proprietario: {
        type: mongoose.Types.ObjectId,
        ref: 'Utente',
        validate: {
            validator: async function (userId) {
                const user = await mongoose.model('Utente').findById(userId);
                return user.ruolo === 'Proprietario';
            },
            message: 'Utente deve avere il ruolo di proprietario'
        }
    },
    targa: {
        type: String,
        required: true,
        unique: true
    },
    tipo_barca: {
        type: String,
        enum: ['yacht', 'pedalo', 'canoa', 'barca a vela', 'motoscafo'],
        required: true
    },
    patente: {
        type: String,
        enum : ['A motore', 'A motore e vela', 'B motore', 'B motore e vela', 'C motore', 'C motore e vela']
    },
    posizione:{
        type: String,
        required: true
    },
    prezzo_ora: {
        type: Number,
        required: true
    },
    prezzo_giorno: {
        type: Number,
        required: true
    },
    prenotazioni: [{
        type: mongoose.Types.ObjectId,
        ref: 'Prenotazione' 
    }],
    codiceNoleggio: {
        codice: String,
        scadenza: Date
    }

})

module.exports = mongoose.model('Barca', schemaBarca)

