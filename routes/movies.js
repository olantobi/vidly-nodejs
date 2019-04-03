const express = require('express');

const { Movie, validate } = require('../model/movie');
const { Genre } = require('../model/genre');

const router = express.Router();

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('title');
    res.send(movies);
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).send(`Movie with id ${req.params.id} does not exist`);

    res.send(movie);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = await Genre.findOne({'name': req.body.genre});

    if (!genre) return res.status(400).send('Invalid genre provided');

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate        
    });    
    await movie.save();

    res.send(movie);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let movie = await Movie.findByIdAndUpdate(req.params.id, 
        {
            title: req.body.name,
            genre: req.body.genre,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate 
        }, 
        {new: true});

    if (!movie) return res.status(404).send(`Movie with id ${req.params.id} does not exist`);

    res.send(movie);
});

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie) return res.status(404).send(`Movie with id ${req.params.id} does not exist`);
     
    res.send(movie);
});

module.exports = router;