/*
◦	Log in 
◦	View Dashboard
◦	Add Quiz
◦	view attempted Quizzes  
◦	Download attempted Quizzes
◦	Add Assignment
◦	View submitted Assignment
◦	Download Submitted assignment
◦	Add Material
◦	View Materials
◦	Delete Material
◦	Add Marks
◦	Delete Marks
◦	Update Marks
◦	Delete Quiz
◦	Delete Assignment
*/

const express = require('express');
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);
const bcrypt = require('bcrypt');
var router = express.Router();
// var Admin = require('../models/admin');
var Class = require('../models/class');
var Teacher = require('../models/teacher');


var t_id;
//Login
router.post("/login",async function(req,res){
    const {error} = validateTeacherLogin(req.body);
    if(error) return res.status(400).send("The entered login details are invalid");
    const teacher = await Teacher.findOne({username:req.body.username});

    if(!teacher) return res.status(200).send("Invalid Email or password");

    const validPassword = await bcrypt.compare(req.body.password,teacher.password)
    if(!validPassword) return res.status(200).send("Invalid Email or password");
    t_id = teacher._id;
    
    res.send(teacher.name+" Logged in");

    /*

    {
	"username":"mrm@gmail.com",
	"password":"12345"
    }

    */
})
router.get("/dashboard", (req,res)=>{
    res.send("View Dashboard");
})

// Add quiz
router.get('/addquiz',async function(req, res) {
    
    const thisclass = await Class.find({teacher:t_id}).populate('teacher','-_id name');
    if(thisclass.length == 0) return res.send("Sorry, You are not assigned to any class");

    res.send(thisclass);
});





function validateTeacherLogin(logindetails){
    const schema = Joi.object({
        username:Joi.string().required(),
        password:Joi.string().required()
    });
    return schema.validate(logindetails);
}
module.exports = router;