const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const { User, validateLogin } = require('../model/user');

const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (!user)   return res.status(400).send('Invalid email or password.');
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);  
    
    if (!validPassword)  return res.status(400).send('Invalid email or password.');
    
    const token = jwt.sign({sub: user._id, name: user.name, email: user.email}, process.env.SECRET_KEY);

    res.send({"access_token": token});
});

module.exports = router;