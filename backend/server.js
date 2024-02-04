const express = require('express')
const config = require('./config')
const cors = require('cors')
require("dotenv").config();

const app = express()

// chiamata alla funzione per la connessione con il database
const db_connection = require('./dbconnection')
db_connection.connect()

const authRoute = require('./routes/autenticazione')
const patenteRoute = require('./routes/patenti')
const barcaRoute = require('./routes/barca')

// middleware utili
app.use(express.json())
app.use(cors())

app.use((req, res, next)=>{
  res.header("Access-Control-Allow-Origin", "*");
  req.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// gestione delle routes
app.use(`/api/${config.API_VERSION}/auth`, authRoute)
app.use(`/api/${config.API_VERSION}/patenti`, patenteRoute)
app.use(`/api/${config.API_VERSION}/barca`, barcaRoute)


app.use('/*', (req, res) => res.status(404).json({ success: false, message: 'Route inesistente' }))

if (config.NODE_ENV === 'production') {
  app.use(express.static(__dirname + '/static/'))
}

if(config.NODE_ENV !== "testing"){
  app.listen(config.PORT, () => {
    console.log(`Boatify server listening on ${config.PORT}`)
  })
}

module.exports = app
