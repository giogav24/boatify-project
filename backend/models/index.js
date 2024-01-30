const mongoose= require('mongoose');

const db={};
db.mongoose= mongoose;

db.user= require("./Utente");


module.exports=db;