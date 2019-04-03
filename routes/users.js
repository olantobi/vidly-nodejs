const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const { User, validate, validateUpdate } = require('../model/user');

const router = express.Router();
const SALT_ROUNDS = 10;

router.get('/', async (req, res) => {
    const users = await User.find().sort('name');
    res.send(users);
});

router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send(`User with id ${req.params.id} does not exist`);

    res.send(user);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (user)   return res.status(400).send('User already registered');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));  
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);  

    await user.save();    
    
    res.send(_.pick(user, ['_id', 'name', 'email']));
});

router.put('/:id', async (req, res) => {
    const { error } = validateUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findByIdAndUpdate(req.params.id, 
        {
            name: req.body.name,            
            isEnabled: req.body.isEnabled
        }, 
        {new: true});

    if (!user) return res.status(404).send(`User with id ${req.params.id} does not exist`);

    res.send(user);
});

router.delete('/:id', async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).send(`User with id ${req.params.id} does not exist`);
     
    res.send(user);
});

module.exports = router;