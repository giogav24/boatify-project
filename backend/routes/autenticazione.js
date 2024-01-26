const express = require('express')
const router = express.Router()

const controllerUtenti = require('../controllers/controllerUtente')

const checkAuth = require('../middleware/check-auth')


router.get('/utenti', controllerUtenti.getUtenti)

router.post('/new/cliente', controllerUtenti.registrazioneUtente)

router.post('/login', controllerUtenti.loginUtente)

router.post('/passworddimenticata', controllerUtenti.resetPasswordRequest)

router.put('/cambiopassword', checkAuth, controllerUtenti.changePassword)

module.exports = router