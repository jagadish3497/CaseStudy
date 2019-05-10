const Joi = require('joi');
const mongoose = require('mongoose');
 
const BorrowerData = mongoose.model('BorrowerData', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    number: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10
    },
   
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    },
    type: {
        type: String,
        required: true,
        maxlength: 1024
    }
}));
 
function validatedBorrowerData(borrowerdata) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        username: Joi.string().min(5).max(50).required(),
        email: Joi.string().required().email(),
        number: Joi.string().min(10).max(10).required(),
        password: Joi.string().min(5).max(255).required(),
        type: Joi.string().max(255).required()
    };
    return Joi.validate(borrowerdata, schema);
}
 
exports.BorrowerData = BorrowerData;
exports.validate = validatedBorrowerData;
//module.exports = ('UserDetails', User); 