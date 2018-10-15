require('express-async-errors'); // No es necesario guardarlo en una const 
const winston = require('winston');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const error = require('./middleware/error'); 

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

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

app.use(error);

app.get('/', (req, res) =>{
    res.send("Welcome to Video");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Running on ${port}....`);
})


