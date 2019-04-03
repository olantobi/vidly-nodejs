const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Joi = require('joi');
require('dotenv').config();
Joi.objectId = require('joi-objectid')(Joi);

const home = require('./routes/home');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');

const app = express();

app.use(helmet());
app.use(morgan('tiny'));

app.use(express.json());

mongoose.connect('mongodb://localhost/vidly', {
    "auth": {"authSource": "admin"},
    "useNewUrlParser": true,
    "useCreateIndex": true,
    "useFindAndModify": false,
    "user": "root",
    "pass": "mongodb"   
    
})
.then(() => console.log('Connected to db'))
.catch(err => console.error('Could not connect to MongoDB', err));

app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/', home);

// If no route is matched by now, it must be 404
app.use(function(req, res) {
    res.status(404).json('Endpoint Not Found');
});

app.listen(3400, () => console.log("Vidly server is listening on port 3400"));