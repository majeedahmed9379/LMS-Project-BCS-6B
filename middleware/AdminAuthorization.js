const jwt = require("jsonwebtoken");
const config = require('config');
const express = require('express');
var router = express.Router();

function AdminAuthorization(req,res,next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send("Request token not found");
    try{
        const decoded = jwt.verify(token,config.get("jwtPrivateKey"));
        req.user = decoded;
        next();
    }
    catch(error){
        console.log("Error while decoding the token");
        res.status(401).send("Invalid token");
    }
}
module.exports = AdminAuthorization;
