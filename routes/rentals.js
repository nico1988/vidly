const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Fawn = require('fawn');
const { Rental, validateRental } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');

Fawn.init(mongoose);

//Obtener Arriendos
router.get('/', async(req, res) => {
    let rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

router.get('/:id', async(req, res) =>{
    let rental = await Rental.findById(req.params.id).sort('-dateOut');
    if(!rental) return res.status(404).send("Arriendo no encontrado");
    res.send(rental);
});

//Crear Arriendos
router.post('/', async (req, res) =>{
    const { error } = validateRental(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(404).send("Cliente no encontrado");

    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(404).send("Película no encontrada");

    if(movie.numberInStock === 0) return res.status(400).send("Película sin Stock");

    let rental = new Rental({ 
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },
        rentalFee: 4990
    });

    //Two phase commits
    //Realiza una transaccion para guardar el arriendo y actualizar 
    //la cantidad de movie en stock
    try{
        new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { _id: movie._id }, {
                $inc: { numberInStock: -1 }
            })
            .run();

        res.send(rental);
    }
    catch(ex){
        res.status(500).send("BD error");
    }
});


module.exports = router;