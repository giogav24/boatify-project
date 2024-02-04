const express = require('express')
const router = express.Router()

const controllerBarca = require('../controllers/controllerBarca')
const checkRole = require('../middleware/check-role')

router.post('/aggiungiBarca', controllerBarca.aggiungiBarca);
router.get('/getDatiBarca', controllerBarca.getDatiBarca);
router.delete('/eliminaBarca', checkRole.checkPermessiProprietarioBarca, controllerBarca.eliminaBarca);

router.post('/creaPrenotazione', controllerBarca.creaPrenotazione);
router.get('/getDatiPrenotazione', controllerBarca.getDatiPrenotazione);
router.delete('/eliminaPrenotazione', controllerBarca.eliminaPrenotazione);


module.exports = router
