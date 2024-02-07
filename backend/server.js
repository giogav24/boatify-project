const express = require('express')
const config = require('./config')
const cors = require('cors')
require("dotenv").config();

const app = express()

// chiamata alla funzione per la connessione con il database
const db_connection = require('./dbconnection')

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


let server

const startServer = async () => {
  try {
    await db_connection.connectDB()

    const PORT = process.env.PORT;
    console.log("Starting server...")

    return new Promise((resolve, reject) => {
      server = app.listen(PORT, (error) => {
        if (error) {
          console.error('Error starting the server:', error);
          reject(error);
        } else {
          console.log(`Boatify server listening on port ${config.PORT}`);
          resolve(server);
        }
      });
    })
  }catch (error) {
    console.error('Error starting server: ', error);
    throw error;
  }
}

const closeServer = async () => {
  // Close the Express app server
  try{ 
    console.log("Trying to stop the server...");
    if(server){
      await new Promise((resolve) => server.close(resolve));
      console.log("Server stopped!")
    }

    await db_connection.closeDB();
  }catch(error){
    console.log("Error stopping the server: " + error);
    throw error;
  }
};

// Only start the server if this script is executed directly
if (require.main === module) {
  startServer().catch(error => {
    process.exit(1); // Exit with a non-zero exit code to indicate failure
  });
}

module.exports = { app, startServer, closeServer };