const express = require('express')
const router = express.Router()

const controllerPatente = require('../controllers/controllerPatente')


router.post('/registraPatente', controllerPatente.registraPatente);

router.get('/getPatentiUtente', controllerPatente.getPatentiUtente);

router.delete('/eliminaPatente', controllerPatente.eliminaPatente);


module.exports = router