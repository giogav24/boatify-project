const mongoose = require('mongoose')
const config = require('./config')

// funzione per la connessione con il database: 
// può essere DB_URL_LOCAL (database in localhost) oppure DB_URL_CLUSTER (database su cloud Atlas)
exports.connect = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log('connected to db')
    } catch (err) {
        console.error(err.message)
    }
}

