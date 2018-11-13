
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');
const { Rental } = require('../models/rental');
const { Movie } = require('../models/movie');
const validate = require('../middleware/validate');

//Crear Genero
router.post('/', [auth, validate(validateReturn)], async (req, res) =>{
    let rental = await Rental.lookup(req.body.customerId, req.body.movieId);
    if(!rental) return res.status(404).send("Arriendo no encontrado");
    if(rental.dateReturned) return res.status(400).send("El arriendo ya ha sido devuelto");

    rental.return();
    await rental.save();

    await Movie.update({_id: rental.movie._id}, {
        $inc: { numberInStock: 1}
    });
    return res.send(rental);
});

function validateReturn(req){
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }

    return Joi.validate(req, schema);
}

module.exports = router; 