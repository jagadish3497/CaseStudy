const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { OwnerData } = require('../models/ownermodel');
const express = require('express');
const router = express.Router();
 
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
 
    //  Now find the user by their email address
    let ownerdata = await OwnerData.findOne({ email: req.body.email });
    if (!ownerdata) {
        return res.status(400).send('Incorrect email or password.');
    }
 
    // Then validate the Credentials in MongoDB match
    // those provided in the request
    const validPassword = await bcrypt.compare(req.body.password, ownerdata.password);
    if (!validPassword) {
        return res.status(400).send('Incorrect email or password.');
    }
 
    res.send(true);
});

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };
 
    return Joi.validate(req, schema);
}

module.exports = router;