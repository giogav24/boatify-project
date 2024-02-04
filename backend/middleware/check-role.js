const Barca = require('../models/Barca')
const Utente = require('../models/Utente')

// verificare se un utente è proprietario
exports.checkPermessiProprietario = async (req, res, next) => {
    try {
      const utente = req.body; 
      if (utente && utente.ruolo === 'Proprietario') {
        next();
      } else {
        res.status(403).json({ success: false, message: 'Utente non autorizzato' });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

// controllare se l'utente che sta facendo l'operazione è il proprietario della barca
exports.checkPermessiProprietarioBarca = async (req, res, next) => {
    try {
      const { email, targa } = req.body;
  
      // Trova l'utente associato alla mail fornita
      const utente = await Utente.findOne({ email });
  
      if (!utente) {
        return res.status(404).json({ success: false, message: 'Utente non trovato' });
      }
  
      // Trova la barca utilizzando il numero della targa e l'ID dell'utente
      const barcaDaVerificare = await Barca.findOne({
        proprietario: utente._id,
        targa: targa,
      });
  
      if (!barcaDaVerificare) {
        return res.status(404).json({ success: false, message: "Barca non trovata per l'utente specificato" });
      }
  
      // Se l'utente ha i permessi, passa al prossimo middleware o alla funzione del controller
      req.barcaDaVerificare = barcaDaVerificare;
      next();
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };


// Middleware per verificare se l'utente è un noleggiatore e il creatore della prenotazione
exports.checkPermessiNoleggiatore = async (req, res, next) => {
  try {
    const { email, idPrenotazione } = req.body;

    // Trova l'utente associato alla mail fornita
    const utente = await Utente.findOne({ email });

    if (!utente || utente.ruolo !== 'Noleggiatore') {
      return res.status(403).json({ success: false, message: 'Utente non autorizzato' });
    }

    // Trova la prenotazione da eliminare
    const prenotazione = await Prenotazione.findById(idPrenotazione);

    if (!prenotazione || prenotazione.utente.toString() !== utente._id.toString()) {
      return res.status(403).json({ success: false, message: 'Utente non autorizzato' });
    }

    // Se tutte le verifiche passano, passa al middleware successivo
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
  