const bcrypt = require('bcrypt');
const _ = require('lodash');
const { OwnerData, validate } = require('../models/ownermodel');
const express = require('express');
const router = express.Router();
 
 router.post('/', async (req, res) => {
    // First Validate The Request
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } 
    
 
    // Check if this user already exisits
    let ownerdata = await OwnerData.findOne({ email: req.body.email });
    if (ownerdata) {
        return res.status(400).send('That user already exisits!');
    } else {
        // Insert the new user if they do not exist yet
         ownerdata = new OwnerData({
            name: req.body.name,
            username: req.body.username, 
            email: req.body.email,
            number: req.body.number,
            password: req.body.password,
            type: req.body.type
        }); 
      
        const salt = await bcrypt.genSalt(5);
        ownerdata.password = await bcrypt.hash(ownerdata.password, salt);
        await ownerdata.save();
        res.send(ownerdata);
       
    }

    
});
 
module.exports = router;