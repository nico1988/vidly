const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const validateObjectId = require('../middleware/validateObjectId');
const { Rental } = require('../models/rental');

//Crear Genero
router.post('/', auth, async (req, res) =>{
    if(!req.body.customerId) res.status(400).send('CustomerId not provided');
    if(!req.body.movieId) res.status(400).send('MovieId not provided');
    let rental = await Rental.find({ "customerId": req.body.customerId, "movieId": req.body.movieId });
    if(!rental) return res.status(404).send("Arriendo no encontrado");
    res.status(200).send('everything ok');
});

module.exports = router; 