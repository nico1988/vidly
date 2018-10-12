const mongoose = require('mongoose');
const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 6,
        maxlength: 255
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    }
});

const User = mongoose.model('user', userSchema);

function validateUser(user){

    const passComplex = new PasswordComplexity({
        min: 6,
        max: 30,
        lowerCase: 1,
        upperCase: 1,
        //numeric: 1,
        //symbol: 1,
        requirementCount: 2,
    });

    const schema = {
        name: Joi.string().required().min(2).max(50),
        email: Joi.string().required().min(6).max(255).email(),
        password: passComplex //Joi.string().required().min(6).max(30)
    };
    
    return Joi.validate(user, schema);
}

exports.User = User;
exports.validateUser = validateUser;