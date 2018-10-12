const _ = require('lodash');
const express = require('express');
const router = express.Router();
const { User, validateUser } = require('../models/user');

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send('El email ingresado ya se encuentra registrado');
    
    user = new User( _.pick(req.body, ['name', 'email', 'password']) );

    await user.save();
    res.send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router; 
