const Barca = require('../models/Barca')

// controllare se l'utente che sta facendo l'operazione è il proprietario del locale
exports.checkPermessiProprietarioBarca = async (req, res, next) => {
    const userData = req.userData

    try {
        const BarcaOrganizzatore = await Barca.findById(userData.barca)

        if (! BarcaOrganizzatore)
            return res.status(404).json({ success: false, message: 'Barca inesistente' })

        // controllo se la barca espressa nella route è quella del Proprietario che sta facendo la richiesta
        if (req.params.barcaID !== userData.barca)
        return res.status(403).json({ success: false, message: 'Permessi mancanti per accedere alla risorsa' })

        // controllo incrociato dalla parte della barca con il suo campo proprietario
        if (String(BarcaOrganizzatore.proprietario) !== userData.id)
            return res.status(403).json({ success: false, message: 'Permessi mancanti per effettuare questa operazione' })

        next()

    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
},


// verificare se un utente è proprietario
exports.checkPermessiProprietario = async (req, res, next) => {
    if (req.userData.ruolo === 'Proprietario')
        next()
    else
        return res.status(401).json({ success: false, message: 'Non autorizzato ad accedere a questa risorsa' })
}
