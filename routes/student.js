/*
•   View Classes
•	View Quiz
•	Attempt Quiz
•	View Assignment 
•	Attempt Assignment
•	Submit Assignment
•	View Material
•	Download material (Optional)
•	View Grade
•	View Dashboard (Current screen with all the options is dashboard)
•	View Result

*/



const express = require('express');
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);
const bcrypt = require('bcrypt');
var router = express.Router();
// var Admin = require('../models/admin');
var Class = require('../models/class');
var {Student} = require('../models/student');
const { json } = require('express/lib/response');

var sid;
var myClasses = [];
router.post("/login",async function(req,res){
    myClasses=[];
    const {error} = validateStudentLogin(req.body);
    if(error) return res.status(400).send("The entered login details are invalid");
    const student = await Student.findOne({username:req.body.username});

    if(!student) return res.status(200).send("Invalid Email or password");

    const validPassword = await bcrypt.compare(req.body.password,student.password)
    if(!validPassword) return res.status(200).send("Invalid Email or password");
    sid = student._id;
    
    var classes = await Class.find().select({_id:1,students:1});
    
    for(i=0;i<classes.length;i++){

        students = classes[i].students;

        for(j=0;j<students.length;j++){

            let id = (students[j].sid).toString();

            if(students[j].sid ==  sid.toString()){
                console.log("Found");
                var c = await Class.find({_id:classes[i]._id}).populate('teacher','-_id name');
                myClasses.push(c);

            }
        }
    }

    res.send(student.name+" Logged in successfully"+sid);


})
router.get("/dashboard", async function(req,res){
    

    if(myClasses.length>0) return res.send(myClasses);
    else return res.send("You are not in any class");

})




function validateStudentLogin(logindetails){
    const schema = Joi.object({
        username:Joi.string().required(),
        password:Joi.string().required()
    });
    return schema.validate(logindetails);
}

module.exports = router;