const mongoose = require('mongoose');
const Joi = require('joi');
const moment = require('moment');

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                minlength: 2,
                maxlength: 30,
                required: true
            },
            isGold: {
                type: Boolean,
                required: true
            },
            phone: { 
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                minlength: 2,
                maxlength: 50
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

//static method
rentalSchema.statics.lookup = function (customerId, movieId){
    return this.findOne({ 
        "customer._id": customerId, 
        "movie._id": movieId 
    });
}

//instance method
rentalSchema.methods.return = function(){
    this.dateReturned = new Date();
    
    const rentalDays = moment().diff(this.dateOut, 'days');
    this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('rental', rentalSchema);

function validateRental(movie){
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }

    return Joi.validate(movie, schema);
}


exports.Rental = Rental;
exports.validateRental = validateRental;