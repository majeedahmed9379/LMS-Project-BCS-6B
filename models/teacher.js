

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var teacherSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
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
    isTeacher:true
});
const Teacher = mongoose.model('Teacher', teacherSchema);;

module.exports = Teacher;
