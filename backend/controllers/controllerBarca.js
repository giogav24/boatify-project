const Utente = require('../models/Utente')
const Barca = require('../models/Barca')
const Prenotazione = require('../models/Prenotazione')

const { addDays } = require('date-fns');

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

    const utente = await Utente.findOne({ email : email });

    if (!utente || utente.ruolo !== 'Noleggiatore') {
      return res.status(400).json({ success: false, message: 'Utente non trovato o ruolo non valido' });
    }

    const barca = await Barca.findOne({ targa : targa});

    if (!barca) {
      return res.status(404).json({ success: false, message: 'Barca non trovata' });
    }

    // Verificoa se la barca ha prenotazioni nello stesso intervallo di tempo
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

    const prenotazioniConflittualiUtente = await Prenotazione.find({
        utente: utente._id,
        $or: [
          { data_inizio: { $lt: data_fine }, data_fine: { $gt: data_inizio } },
          { data_inizio: { $gte: data_inizio, $lte: data_fine } },
        ],
      });
  
    if (prenotazioniConflittualiUtente.length > 0) {
        return res.status(400).json({ success: false, message: 'L\'utente ha già altre prenotazioni nello stesso intervallo di tempo' });
    }
    
    /*if (barca.patente) {
        const patentiUtente = await Patente.find({ noleggiatore: utente._id, tipo_patente: barca.patente });
        const patenteCorrispondente = patentiUtente.some(patente => patente.tipo_patente === barca.patente);
        if (!patenteCorrispondente) {
          return res.status(400).json({ success: false, message: 'La patente della barca non corrisponde a una delle patenti dell\'utente' });
        }
    }*/


    const nuovaPrenotazione = new Prenotazione({
      barca: barca._id,
      data_inizio: data_inizio,
      data_fine: data_fine,
      posizione: barca.posizione,
      utente: utente._id,
    });

    await nuovaPrenotazione.save();

    res.status(200).json({ success: true, message: 'Prenotazione creata con successo' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDatiPrenotazione = async (req, res) => {
  try {
    const { email } = req.body;

    // Trova l'utente associato alla mail fornita
    const utente = await Utente.findOne({ email : email });

    if (!utente) {
      return res.status(404).json({ success: false, message: 'Utente non trovato' });
    }

    // Trova le prenotazioni associate all'utente
    const prenotazioni = await Prenotazione.find({ utente: utente._id }).populate('barca', 'targa tipo_barca proprietario prezzo_ora prezzo_giorno');

    // Estrai i dati richiesti
    const datiPrenotazioni = prenotazioni.map(prenotazione => ({
      id: prenotazione._id,
      barca: {
        targa: prenotazione.barca.targa,
        tipo_barca: prenotazione.barca.tipo_barca,
        proprietario: prenotazione.barca.proprietario,
        prezzo_ora: prenotazione.barca.prezzo_ora,
        prezzo_giorno: prenotazione.barca.prezzo_giorno,
      },
      data_inizio: prenotazione.data_inizio,
      data_fine: prenotazione.data_fine,
      posizione: prenotazione.posizione,
    }));

    res.status(200).json({ success: true, datiPrenotazioni });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.eliminaPrenotazione = async (req, res) => {
  try {
    const { email, idPrenotazione } = req.body;
    
    const utente = await Utente.findOne({ email : email });

    if (!utente || utente.ruolo !== 'Noleggiatore') {
      return res.status(403).json({ success: false, message: 'Utente non autorizzato' });
    }

    const prenotazione = await Prenotazione.findById(idPrenotazione);

    //verifica se utente che elimina è l'utente che ha creato la prenotazione
    if (!prenotazione || prenotazione.utente.toString() !== utente._id.toString()) {
      return res.status(403).json({ success: false, message: 'Utente non autorizzato' });
    }

    // Verifica se la data della richiesta è almeno un giorno prima di data_inizio
    const dataRichiesta = new Date();
    const dataInizio = new Date(prenotazione.data_inizio);

    if (dataRichiesta >= addDays(dataInizio, -1)) {
      return res.status(403).json({ success: false, message: 'Impossibile eliminare la prenotazione a meno di un giorno dalla data di inizio' });
    }

    await Prenotazione.findByIdAndDelete(idPrenotazione);

    res.status(200).json({ success: true, message: 'Prenotazione eliminata con successo' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

