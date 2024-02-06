const express = require('express')
const router = express.Router()

const controllerBarca = require('../controllers/controllerBarca')
const checkRole = require('../middleware/check-role')

router.post('/aggiungiBarca', controllerBarca.aggiungiBarca);
router.get('/getDatiBarca', checkRole.checkPermessiProprietarioBarca, controllerBarca.getDatiBarca);
router.delete('/eliminaBarca', checkRole.checkPermessiProprietarioBarca, controllerBarca.eliminaBarca);

router.post('/creaPrenotazione', controllerBarca.creaPrenotazione);
router.get('/getDatiPrenotazione', controllerBarca.getDatiPrenotazione);
router.delete('/eliminaPrenotazione', controllerBarca.eliminaPrenotazione);
router.get('/verificaBarcheDisponibili', controllerBarca.verificaBarcheDisponibili);
router.post('/avviaNoleggio', controllerBarca.avviaNoleggio);
router.post('/terminaNoleggio', controllerBarca.terminaNoleggio);


module.exports = router
