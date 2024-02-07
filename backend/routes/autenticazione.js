const express = require('express')
const router = express.Router()

const controllerUtenti = require('../controllers/controllerUtente')

const checkAuth = require('../middleware/check-auth.js')


router.get('/getDatiUtente', controllerUtenti.getDatiUtente);

router.post('/registraUtente', controllerUtenti.registraUtente);

router.post('/loginUtente', controllerUtenti.loginUtente);

router.post('/resetPassword', controllerUtenti.resetPassword);

router.post('/cambiaPassword', controllerUtenti.cambiaPassword);

router.post('/logoutUtente',  checkAuth, controllerUtenti.logoutUtente);

router.delete('/eliminaProfilo', checkAuth, controllerUtenti.eliminaProfilo);


module.exports = router
