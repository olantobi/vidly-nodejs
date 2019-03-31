const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const home = require('./routes/home');
const genres = require('./routes/genres');
const customers = require('./routes/customers');

const app = express();

app.use(helmet());
app.use(morgan('tiny'));

app.use(express.json());

mongoose.connect('mongodb://localhost/vidly', {
    "auth": {"authSource": "admin"},
    "useNewUrlParser": true,
    "user": "root",
    "pass": "mongodb"   
    
})
.then(() => console.log('Connected to db'))
.catch(err => console.error('Could not connect to MongoDB', err));

app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/', home);

app.listen(3400, () => console.log("Vidly server is listening on port 3400"));