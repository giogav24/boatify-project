const express = require('express')
const router = express.Router()

const controllerPatente = require('../controllers/controllerPatente')

router.post('/registraPatente', controllerPatente.registraPatente);
