const mongoose = require('mongoose');

const Rental = mongoose.model('Rental', new mongoose.Schema({        
    customer: {
        type: new mongoose.Schema({
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
        }),
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 50
    },    
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 5,
                maxlength: 50
            },    
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        default: Date.now        
    },
    dateReturned: {
        type: Date                
    },
    rentalFee: {
        type: Number,
        required: true,
        min: 0
    }
}));

function validate(rental) {    
    const schema = {        
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };

    return Joi.validate(rental, schema);    
}

exports.Rental = Rental; 
exports.validate = validate;