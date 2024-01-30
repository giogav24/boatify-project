const mongoose= require ('mongoose');
//const bcrypt= require ('bcryptjs');

const schemaPrenotazione = new mongoose.Schema({
    barca:{
        type: mongoose.Types.ObjectId,
        ref : 'Barca'
    },
    data:{
        type: String,
        required: true
    },
    orario:{
        type: String,
        required: true
    },
    utente:{
        type: mongoose.Types.ObjectId,
        ref: 'Utente'
    }
})

module.exports= mongoose.model('Prenotazione',schemaPrenotazione);