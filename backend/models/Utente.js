const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
var Schema = mongoose.Schema;

// set up my mongoose model
const schemaUtente = new Schema({
    ruolo: {
        type: String,
        enum: ['Noleggiatore', 'Proprietario'], //vedi diagrammi classi domanda prof
        required: true
    },
    nome: {
        type: String,
        required: true
    },
    cognome: {
        type: String,
        required: true
    },
    data_nascita: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // regex per controllo email valida
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    nr_telefono: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    //per il ruolo di proprietario viene registrato l'id della barca, per noleggiatore questo campo resta vuoto
    barca: {
        type: mongoose.Types.ObjectId,
        ref: 'Barca'
    },
    prenotazioni: {
        type: [mongoose.Types.ObjectId],
        ref: 'Evento'
    },
    verifiedEmail: {
        type: Boolean,
        default: false
    },
    verifiedTelefono: {
        type: Boolean,
        default: false

    }
})
// funzione che automaticamente, prima di salvare un (nuovo) utente, hasha la password prima di salvarla nel database
schemaUtente.pre('save', async function(next) {
    if (! this.isModified('password'))
        next()
    
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

schemaUtente.methods.checkPassword = async function(password) {
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('Utente', schemaUtente)