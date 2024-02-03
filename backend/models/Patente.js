var mongoose = require('mongoose');

const schemaPatente = new mongoose.Schema({
    tipo_patente: {
        type: String,
        enum : ['A motore', 'A motore e vela', 'B motore', 'B motore e vela', 'C motore', 'C motore e vela']
    },
    noleggiatore: {
        type: Schema.Types.ObjectId,
        ref: 'Utente',
        validate: {
            validator: async function (userId) {
                const user = await mongoose.model('Utente').findById(userId);
                return user.ruolo === 'Noleggiatore';
            },
            message: 'Utente deve avere il ruolo di noleggiatore'
        }
    },
    numero_patente: {
        type: String,
        required: true,
        unique: true
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

schemaPatente.pre('save', async function (next) {
    const quattordiciGiorniDopo = new Date();
    quattordiciGiorniDopo.setDate(quattordiciGiorniDopo.getDate() + 14);
  
    const dataScadenza = new Date(this.data_scadenza);
  
    if (dataScadenza < quattordiciGiorniDopo) {
      // Se la data di scadenza non è valida ovvero deve essere almeno dopo 14 giorni dalla data di registrazione, interrompi il salvataggio
      const error = new Error('Data di scadenza non valida. La patente deve essere valida per almeno 14 giorni.');
      return next(error);
    }
    next();
  });
  

module.exports= mongoose.model('Patente',schemaPatente);
