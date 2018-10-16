require('express-async-errors'); // No es necesario guardarlo en una const 
const winston = require('winston');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const app = express();
require('./startup/routes')(app);
require('./startup/db')();

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
    console.log("FATAL ERROR!!!, PrivateKey Undefined");
    process.exit(1);
}

app.get('/', (req, res) =>{
    res.send("Welcome to Video :D ");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Running on ${port}....`);
})


