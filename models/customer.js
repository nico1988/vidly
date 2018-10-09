const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
    isGold: {
        type: Boolean,
        required: true
    },
    name: {
        type: String,
        minlength: 2,
        maxlength: 30,
        required: true
    },
    phone: { type: String }
});

const Customer = mongoose.model('customer', customerSchema);

function validateCustomer(customer){
    const schema = {
        isGold: Joi.boolean().required(),
        name: Joi.string().min(3).required(),
        phone: Joi.number()
    }

    return Joi.validate(customer, schema);
}


exports.Customer = Customer;
exports.validateCustomer = validateCustomer;