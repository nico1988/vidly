const auth = require('../middleware/auth');
const moment = require('moment');
const express = require('express');
const router = express.Router();
const validateObjectId = require('../middleware/validateObjectId');
const { Rental } = require('../models/rental');

//Crear Genero
router.post('/', auth, async (req, res) =>{
    if(!req.body.customerId) return res.status(400).send('CustomerId not provided');
    if(!req.body.movieId) return res.status(400).send('MovieId not provided');
    let rental = await Rental.findOne({ 
        "customer._id": req.body.customerId, 
        "movie._id": req.body.movieId 
    });
    if(!rental) return res.status(404).send("Arriendo no encontrado");
    if(rental.dateReturned) return res.status(400).send("El arriendo ya ha sido devuelto");

    rental.dateReturned = new Date();
    const rentalDays = moment.diff(rental.dateOut, 'days');
    rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
    await rental.save();
    
    return res.status(200).send(rental);
});

module.exports = router; 