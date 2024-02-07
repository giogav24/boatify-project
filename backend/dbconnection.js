const mongoose = require('mongoose')
const config = require('./config')

// funzione per la connessione con il database: 
// può essere DB_URL_LOCAL (database in localhost) oppure DB_URL_CLUSTER (database su cloud Atlas)
exports.connectDB = async () => {
    try {
        await mongoose.connect(config.DB_URL)
        console.log('connected to db')
    } catch (err) {
        console.error(err.message)
    }
}

exports.closeDB = async () => {
    try {
        await mongoose.connection.close();
        console.log('Connection to db closed');
    } catch (err) {
        console.error(err.message);
    }
}