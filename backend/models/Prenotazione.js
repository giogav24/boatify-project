const mongoose= require ('mongoose');
//const bcrypt= require ('bcryptjs');

const schemaPrenotazione = new mongoose.Schema({
    barca:{
        type: mongoose.Types.ObjectId,
        ref : 'Barca'
    },
    data_inizio:{
        type: Date,
        required: true
    },
    data_fine:{
        type: Date,
        required: true
    },
    utente:{
        type: mongoose.Types.ObjectId,
        ref: 'Utente'
    }
})

module.exports= mongoose.model('Prenotazione',schemaPrenotazione);