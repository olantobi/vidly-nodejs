
const Joi = require('joi');

exports.validateCustomer = function (customer) {    
    const schema = {
        isGold: Joi.boolean().default(false).optional(),
        name: Joi.string().min(3).required(),
        phone: Joi.string().regex(/^\d+$/).min(10).max(15).required()
    };

    return Joi.validate(customer, schema);    
}

exports.validateGenre = function (genre) {    
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(genre, schema);    
}