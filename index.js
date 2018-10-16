require('express-async-errors'); // No es necesario guardarlo en una const 
const winston = require('winston');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const express = require('express');
const app = express();
require('./startup/routes')(app);

winston.exceptions.handle( 
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
);

process.on('unhandledRejection', (ex) => {
    throw ex;
});

winston.add(new winston.transports.File({
    filename: 'logfile.log',
    handleExceptions: true
}));

if(!config.get('jwtPrivateKey')){
    console.log("clave",config.get('jwtPrivateKey'));
    console.log("FATAL ERROR!, jwtPrivateKey undefined ");
    process.exit(1);
}

mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true, useCreateIndex: true })  
    .then( () => { console.log("Connected to MongoDB") })
    .catch(error => { console.log("No conectado") });

app.get('/', (req, res) =>{
    res.send("Welcome to Video");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Running on ${port}....`);
})


