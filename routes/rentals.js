const express = require('express');
const Fawn = require('fawn');
const mongoose = require('mongoose');

const { Rental, validate } = require('../model/rental');
const { Customer } = require('../model/customer');
const { Movie } = require('../model/movie');

const router = express.Router();

Fawn.init(mongoose);

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).send(`Rental with id ${req.params.id} does not exist`);

    res.send(rental);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid customer provided');

    const movie = await Movie.findById(req.body.movieId);    
    if (!movie) return res.status(400).send('Invalid movie provided');

    if (movie.numberInStock === 0) return res.status(400).send('Movie not available');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            isGold: customer.isGold,
            phone: customer.phone,
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        },        
        rentalFee: movie.dailyRentalRate        
    });    

    try {
        new Fawn.Task()
        .save('rentals', rental)
        .update('movies', {_id: movie._id}, {$inc: {numberInStock: -1}} )
        .run();

        res.send(rental);
    } catch (ex) {
        res.status(500).send('Ooops, an error has occurred');
    }
    

    // rental = await rental.save();

    // movie.numberInStock--;
    // await movie.save();
});

router.put('/:id/return', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let rental = await Rental.findByIdAndUpdate(req.params.id, 
    {       
        dateReturned: Date.now             
    }, 
    {new: true});

    if (!rental) return res.status(404).send(`Rental with id ${req.params.id} does not exist`);

    const movie = await Movie.findById(rental.movie._id);

    movie.numberInStock++;
    await movie.save();

    res.send(rental);
});

router.delete('/:id', async (req, res) => {
    const rental = await Rental.findByIdAndRemove(req.params.id);
    if (!rental) return res.status(404).send(`Rental with id ${req.params.id} does not exist`);
     
    res.send(rental);
});

module.exports = router;