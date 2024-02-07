const Utente = require('../models/Utente')
const Patente = require('../models/Patente')


exports.registraPatente = async (req, res) => {
  try {
    const { email, tipo_patente, numero_patente, data_emissione, data_scadenza } = req.body;

    // Trovo l'utente associato alla mail fornita
    const utente = await Utente.findOne({ email: email });

    // Se l'utente esiste e ha il ruolo di "noleggiatore", procedo con la creazione della patente
    if (utente && utente.ruolo === 'Noleggiatore') {
      // Crea una nuova istanza di Patente
      const nuovaPatente = new Patente({
        tipo_patente: tipo_patente,
        noleggiatore: utente._id,
        numero_patente:numero_patente,
        data_emissione:data_emissione,
        data_scadenza: data_scadenza,
      });

      await nuovaPatente.save();

      res.status(200).json({ success: true, message: 'Patente registrata con successo' });
    } else {
      res.status(400).json({ success: false, message: 'Utente non trovato o ruolo non valido' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPatentiUtente = async (req, res) => {
  try {
    const { email } = req.body;

    // Trova l'utente associato alla mail fornita
    const utente = await Utente.findOne({ email });

    if (!utente) {
      return res.status(404).json({ success: false, message: "Utente non trovato" });
    }

    // Trova le patenti associate all'utente
    const patenti = await Patente.find({ noleggiatore: utente._id });

    if (patenti.length === 0) {
      return res.status(404).json({ success: false, message: "L'utente non ha patenti registrate" });
    }

    res.status(200).json({ success: true, patenti });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.eliminaPatente = async (req, res) => {
  try {
    const { email, numero_patente } = req.body;

    // Trova l'utente associato alla mail fornita
    const utente = await Utente.findOne({ email:email });

    if (!utente) {
      return res.status(404).json({ success: false, message: "Utente non trovato" });
    }

    // Trova la patente da eliminare utilizzando il numero della patente e l'ID dell'utente
    const patenteDaEliminare = await Patente.findOne({
      noleggiatore: utente._id,
      numero_patente: numero_patente,
    });

    if (!patenteDaEliminare) {
      return res.status(404).json({ success: false, message: "Patente non trovata per l'utente specificato" });
    }

    // Elimina la patente
    await Patente.findByIdAndDelete(patenteDaEliminare._id);

    res.status(200).json({ success: true, message: 'Patente eliminata con successo' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
