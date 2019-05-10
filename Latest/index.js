const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const ownerdata = require('./signup/ownerreg');
const borrowerdata = require('./signup/borrowerreg');
const owner = require('./signin/ownerlogin');
const borrower = require('./signin/borrowerlogin');
const forgot = require('./routes/forgot');
const express = require('express');
const app = express();
 

mongoose.connect('mongodb://localhost/UserDetails');
 
app.use(express.json());
app.use('/ownerreg', ownerdata);
app.use('/borrowerreg', borrowerdata);
app.use('/ownerlogin', owner);
app.use('/borrowerlogin', borrower);
//app.use('/forgot/:name', forgot.update);


app.listen(5000, function () {
    console.log('Server running at http://127.0.0.1:5000/');
  });
  