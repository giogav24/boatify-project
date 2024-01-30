//Modelli Mongoose per MongoDB. Modello barca.
var mongoose = require('mongoose');

const schemaBarca = new mongoose.Schema({
    proprietario: {
        type: Schema.Types.ObjectId,
        ref: 'Utente',
        validate: {
            validator: async function (userId) {
                const user = await mongoose.model('user').findById(userId);
                return user.ruolo === 'proprietario';
            },
            message: 'Utente deve avere il ruolo di proprietario'
        }
    },
    targa: {
        type: String,
        required: true
    },
    tipo_barca: {
        type: String,
        enum: ['yacht', 'pedalo', 'canoa', 'barca a vela', 'motoscafo'],
        required: true
    },
    patente: {
        type: String,
        //enum : ['A motore', 'A motore e vela', 'B motore', 'B motore e vela', 'C motore', 'C motore e vela']
        ref: 'Patente'
    },
    verificaDisponibile: {
        type: Boolean,
        default: false
    },
    prezzo_ora: {
        type: double,
        required: true
    },
    prezzo_giorno: {
        type: double,
        required: true
    },
    prenotazioni: {
        type: Schema.Types.ObjectId,
        ref: 'Prenotazione' 
    }

})

module.exports = mongoose.model('Barca', schemaBarca)

