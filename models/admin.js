const jwt = require("jsonwebtoken");
const config = require('config');

var mongoose = require('mongoose');
var adminSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        min:5,
        max:50
    },
    username: {
        type:String,
        unique:true,
        required:true,
        min:5,
        max:255
    },
    password:{
        type:String,
        required:true,
        min:5,
        max:1024
    },
    isAdmin:Boolean
});

adminSchema.methods.generateAuthToken= function(){
    return jwt.sign({id:this._id,isAdmin:true,name:this.name},config.get("jwtPrivateKey"));
    
}

const Admin = mongoose.model('admin', adminSchema);
module.exports = {Admin};