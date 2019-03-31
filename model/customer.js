const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = mongoose.model('Customer', new mongoose.Schema({        
    isGold: {
        type: Boolean,        
        default: false        
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    phone: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 15
    }
}));

function validateCustomer(customer) {    
    const schema = {
        isGold: Joi.boolean().default(false).optional(),
        name: Joi.string().min(3).required(),
        phone: Joi.string().regex(/^\d+$/).min(10).max(15).required()
    };

    return Joi.validate(customer, schema);    
}

exports.Customer = Customer; 
exports.validate = validateCustomer;