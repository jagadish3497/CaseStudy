const bcrypt = require('bcrypt');
const _ = require('lodash');
const { BorrowerData, validate } = require('../models/borrowermodel');
const express = require('express');
const router = express.Router();
 
 router.post('/', async (req, res) => {
    // First Validate The Request
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } 
    
 
    // Check if this user already exisits
    let borrowerdata = await BorrowerData.findOne({ email: req.body.email });
    if (borrowerdata) {
        return res.status(400).send('That user already exisits!');
    } else {
        // Insert the new user if they do not exist yet
         borrowerdata = new BorrowerData({
            name: req.body.name,
            username: req.body.username, 
            email: req.body.email,
            number: req.body.number,
            password: req.body.password,
            type: req.body.type
        }); 
      
        const salt = await bcrypt.genSalt(5);
        borrowerdata.password = await bcrypt.hash(borrowerdata.password, salt);
        await borrowerdata.save();
        res.send(borrowerdata);
       
    }

    
});
 
module.exports = router;