/* const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
 
exports.put('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
 
    //  Now find the user by their email address
    let user = await User.findByIdAndUpdate(req.params.name, {
        name:req.body.name,
        username:req.body.username,
        email:req.body.email,
        number:req.body.number,
        password:req.body.password
      
    }, {new: true})
    .then(user => {
        if(!user) {
            return res.status(404).send({
                message: "Name not found " + req.params.name
            });
        }
        res.send(user);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Note not found with id " + req.params.name
            });                
        }
        return res.status(500).send({
            message: "Error updating note with id " + req.params.name
        });
    });
 
    // Then validate the Credentials in MongoDB match
    // those provided in the request
    const validPassword = await bcrypt.compare(req.body.password, user.password);
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

module.exports = router; */