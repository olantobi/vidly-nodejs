const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({         
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 255
    },
    isEnabled: {
        type: Boolean,        
        default: true        
    },
    isAdmin: {
        type: Boolean,        
        default: false        
    },
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({
        sub: this._id, 
        name: this.name, 
        email: this.email, 
        isAdmin: this.isAdmin
    }, process.env.SECRET_KEY);

    return token;
}

const User = mongoose.model('User', userSchema);

function validateCreate(user) {    
    const schema = {        
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email({ minDomainAtoms: 2 }).min(5).max(100).required(),
        password: Joi.string().required(),
        isEnabled: Joi.boolean().default(true).optional()
    };

    return Joi.validate(user, schema);    
}

function validateUpdate(user) {    
    const schema = {        
        name: Joi.string().min(3).max(100).required(),          
        isEnabled: Joi.boolean().required()
    };

    return Joi.validate(user, schema);    
}

function validateLogin(user) {    
    const schema = {                
        email: Joi.string().email({ minDomainAtoms: 2 }).min(5).max(100).required(),
        password: Joi.string().required()        
    };

    return Joi.validate(user, schema);    
}

exports.User = User;
exports.validate = validateCreate;
exports.validateUpdate = validateUpdate;
exports.validateLogin = validateLogin;