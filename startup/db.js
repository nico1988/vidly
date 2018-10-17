const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function(){
    const db = config.get('db');
    mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true })  
    .then( () => { 
        console.log(`Connected to MongoDB ${db}`);
        //winston.info("Connected to MongoDB");
    });
}