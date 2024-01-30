const express = require('express')
const config = require('./config')
const cors = require('cors')
require("dotenv").config();

const app = express()

// chiamata alla funzione per la connessione con il database
const db_connection = require('./dbconnection')
const db = require('./models')
db_connection.connect()

const authRouter = require('./routes/autenticazione')

// middleware utili
app.use(express.json())
app.use(cors())

app.use(async(req, res, next)=>{
  //await db_connection.connect(); 
  res.setheader("Access-Control-Allow-Origin", "*");
  req.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// gestione delle routes
app.use(`/api/${config.API_VERSION}/auth`, authRouter)


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


