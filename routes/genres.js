const express = require('express');
const router = express.Router();
const { Genre, validateGenre } = require('../models/genre');

//Obtener generos
router.get('/', async(req, res) => {
    let genres = await Genre.find().sort('name');
    res.send(genres);
});

router.get('/:id', async(req, res) =>{
    let genre = await Genre.findById(req.params.id)
    if(!genre) return res.status(404).send("Genero no encontrado");
    res.send(genre);
});

//Crear Genero
router.post('/', async (req, res) =>{
    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    const genre = new Genre({ name: req.body.name });
    await genre.save();
    res.send(genre);
});

//Editar Genero
router.put('/:id', async (req, res) =>{
    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findByIdAndUpdate(req.params.id, 
        { name: req.body.name }, 
        { new: true }
    );

    if(!genre) return res.status(404).send("Genero no encontrado");
    
    res.send(genre);
});

//Borrar Genero
router.delete('/:id', async (req, res) =>{
    const genre = await Genre.findByIdAndRemove(req.params.id)
    if(!genre) return res.status(404).send("Genero no encontrado");

    res.send(genre);
});


module.exports = router;