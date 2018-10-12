const express = require('express');
const router = express.Router();
const { Movie, validateMovie } = require('../models/movie');
const { Genre } = require('../models/genre');

//Obtener Movies
router.get('/', async(req, res) => {
    let movies = await Movie.find().sort('title');
    res.send(movies);
});

router.get('/:id', async(req, res) =>{
    let movie = await Movie.findById(req.params.id)
    if(!movie) return res.status(404).send("Película no encontrado");
    res.send(movie);
});

//Crear Movies
router.post('/', async (req, res) =>{
    const { error } = validateMovie(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send("Género no encontrado");

    const movie = new Movie({ 
        title: req.body.title,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
        genre: {
            _id: genre._id,
            name: genre.name
        }
    });
    await movie.save();
    res.send(movie);
});

//Editar Movies
router.put('/:id', async (req, res) =>{
    let movie = await Movie.findById(req.params.id);
    if(!movie) return res.status(404).send("Película no encontrada!!");
    
    const genre = await Genre.findById(req.body.genreId);
    if(!genre) return res.status(404).send("Género no encontrado");

    movie.genre._id = genre._id;
    movie.genre.name = genre.name;

    movie = await movie.save();
    res.send(movie);
});

//Borrar Movies
router.delete('/:id', async (req, res) =>{
    const movie = await Movie.findByIdAndRemove(req.params.id)
    if(!movie) return res.status(404).send("Película no encontrada");

    res.send(movie);
});


module.exports = router;