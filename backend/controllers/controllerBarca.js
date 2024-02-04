const Utente = require('../models/Utente')
const Barca = require('../models/Barca')
const Prenotazione = require('../models/Prenotazione')

exports.aggiungiBarca = async (req, res) => {
    try {
  
      const { email,targa, tipo_barca, posizione, prezzo_ora, prezzo_giorno } = req.body;

      const utente = await Utente.findOne({ email: email });

      if (utente && utente.ruolo === 'Proprietario') {
        // Crea una nuova istanza di Patente
        const nuovaBarca = new Barca({
            proprietario: utente._id, 
            targa: targa,
            tipo_barca: tipo_barca,
            posizione: posizione,
            prezzo_ora: prezzo_ora,
            prezzo_giorno: prezzo_giorno,
        });
  
      await nuovaBarca.save();
  
      res.status(200).json({ success: true, message: 'Barca aggiunta con successo' });
    } else {
        res.status(400).json({ success: false, message: 'Utente non trovato o ruolo non valido' });
    }
    }catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

exports.eliminaBarca = async (req, res) => {
    try {
      const { email, targa } = req.body;
  
      // Trova l'utente associato alla mail fornita
      const utente = await Utente.findOne({ email:email });
  
      if (!utente) {
        return res.status(404).json({ success: false, message: "Utente non trovato" });
      }
  
      // Trova la patente da eliminare utilizzando il numero della patente e l'ID dell'utente
      const barcaDaEliminare = await Barca.findOne({
        proprietario: utente._id,
        targa: targa,
      });
  
      if (!barcaDaEliminare) {
        return res.status(404).json({ success: false, message: "Barca non trovata per l'utente specificato" });
      }

      // Verifica se ci sono prenotazioni per la barca
      const prenotazioni = await Prenotazione.find({ barca: barcaDaEliminare._id });
      if (prenotazioni.length > 0) {
        return res.status(400).json({ success: false, message: "Ci sono prenotazioni per questa barca, impossibile eliminarla !!" });
      }

      await Barca.findByIdAndDelete(barcaDaEliminare._id);
  
      res.status(200).json({ success: true, message: 'Barca eliminata con successo' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }   
  };

exports.getDatiBarca = async (req, res) => {
    try {
      const { targa } = req.body; 
  
      // Trova la barca con il numero di targa specificato
      const barca = await Barca.findOne({ targa });
  
      if (!barca) {
        return res.status(404).json({ success: false, message: 'Barca non trovata' });
      }
  
      const datiBarca = {
        proprietario: barca.proprietario,
        targa: barca.targa,
        tipo_barca: barca.tipo_barca,
        prezzo_ora: barca.prezzo_ora,
        prezzo_giorno: barca.prezzo_giorno,
        posizione: barca.posizione,
      };
      const prenotazioni = await Prenotazione.find({ barca: barca._id });

      datiBarca.prenotazioni = prenotazioni;

      res.status(200).json({ success: true, datiBarca });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

exports.creaPrenotazione = async (req, res) => {
  try {
    const { email, targa, data_inizio, data_fine } = req.body;

    // Trova l'utente associato alla mail fornita
    const utente = await Utente.findOne({ email });

    // Se l'utente non esiste o non ha il ruolo di "Noleggiatore", restituisci un errore
    if (!utente || utente.ruolo !== 'Noleggiatore') {
      return res.status(400).json({ success: false, message: 'Utente non trovato o ruolo non valido' });
    }

    // Trova la barca associata alla targa fornita
    const barca = await Barca.findOne({ targa });

    // Se la barca non esiste, restituisci un errore
    if (!barca) {
      return res.status(404).json({ success: false, message: 'Barca non trovata' });
    }

    // Verifica se la barca ha prenotazioni nello stesso intervallo di tempo
    const prenotazioniConflittuali = await Prenotazione.find({
      barca: barca._id,
      $or: [
        { data_inizio: { $lt: data_fine }, data_fine: { $gt: data_inizio } },
        { data_inizio: { $gte: data_inizio, $lte: data_fine } },
      ],
    });

    if (prenotazioniConflittuali.length > 0) {
      return res.status(400).json({ success: false, message: 'La barca ha prenotazioni nello stesso intervallo di tempo' });
    }

    // Crea una nuova istanza di Prenotazione
    const nuovaPrenotazione = new Prenotazione({
      barca: barca._id,
      data_inizio,
      data_fine,
      utente: utente._id,
    });

    // Salva la prenotazione
    await nuovaPrenotazione.save();

    res.status(200).json({ success: true, message: 'Prenotazione creata con successo' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

  
