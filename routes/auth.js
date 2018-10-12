const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const { User } = require('../models/user'); 

router.post('/', async (req, res) => {
    const { error } = validateAuth(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Email o password incorrecto');
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Email o password incorrecto');

    const token = jwt.sign({ _id: user._id}, 'MyOwnPrivateKey');

    res.send(token);
});

function validateAuth(req){
    const schema = {
        email: Joi.string().required().min(6).max(255).email(),
        password:  Joi.string().required().min(6).max(30)
    };
    return Joi.validate(req, schema);
}

module.exports = router; 
