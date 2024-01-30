var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const schemaPatente = new mongoose.Schema({
    tipo_patente: {
        type: String,
        enum : ['A motore', 'A motore e vela', 'B motore', 'B motore e vela', 'C motore', 'C motore e vela']
    },
    noleggiatore: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        validate: {
            validator: async function (userId) {
                const user = await mongoose.model('user').findById(userId);
                return user.ruolo === 'noleggiatore';
            },
            message: 'Utente deve avere il ruolo di noleggiatore'
        }
    },
    numero_patente: {
        type: String,
        required: true
    },
    data_emissione: {
        type: String,
        required: true
    },
    data_scadenza: {
        type: String,
        required: true
    },
    verificaScadenza: {
        type: Boolean,
        default: false
    }

})

module.exports= mongoose.model('Patente',schemaPatente);
