const express = require('express');
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);
const bcrypt = require('bcrypt');
var router = express.Router();
// var Admin = require('../models/admin');
const jwt = require("jsonwebtoken");
const config = require('config');

var {Admin} = require("../models/admin");
//Authenticating login
router.post("/",async function(req,res){
    const {error} = validateAdminLogin(req.body);
    if(error) return res.status(400).send("The entered login details are invalid");
    const admin = await Admin.findOne({username:req.body.username});

    if(!admin) return res.status(200).send("Invalid Email or password");

    const validPassword = await bcrypt.compare(req.body.password,admin.password)
    if(!validPassword) return res.status(200).send("Invalid Email or password");
    const token = jwt.sign({id:admin._id,isAdmin:true},config.get("jwtPrivateKey"))
    res.send(token);


})

function validateAdminLogin(logindetails){
    const schema = Joi.object({
        username:Joi.string().required(),
        password:Joi.string().required()
    });
    return schema.validate(logindetails);
}

module.exports = router;