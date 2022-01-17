/*
◦	
◦	Add Marks
◦	Delete Marks
◦	Update Marks
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
    console.log(teacher.name+" Logged in");
    
    res.json(teacher.name+" Logged in");

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
router.put('/addquiz/:cid',async function(req, res) {
    const thisclass = await Class.findById(req.params.cid);
    if(JSON.stringify(thisclass.teacher) != JSON.stringify(t_id)) return res.send("Sorry, You are not assigned to this class");
    if(!thisclass) return res.send("Sorry, You are not assigned to any class");
    const quiz = req.body.quiz;
    var quizzes = [];
    if(thisclass.quizzes.length == 0){
        console.log("No previous quizzes added");
        quizzes.push(quiz);
    }
    else{
        quizzes = thisclass.quizzes;
        quizzes.push(quiz);
    }
    const classupdate = await Class.findOneAndUpdate({teacher:t_id},{
        $set:{
            quizzes:quizzes
        },
    new:true,upsert:false});
    res.send(classupdate);
});

//Delete Quiz
router.delete('/deletequiz/:cid/:index', async function(req,res) {
    const thisclass = await Class.findById(req.params.cid);
    const index = req.params.index;
    if (thisclass.quizzes.length>index){
        var quizzes = thisclass.quizzes;
        quizzes.splice(index,1);
        const classupdate = await Class.findByIdAndUpdate(req.params.cid,{
            $set:{
                quizzes:quizzes
            },new:true
        });
        res.send(classupdate);
    }else{
        res.send("Sorry not scuh quiz exists");
    }
});

// Add Assignment
router.put('/addassignment/:cid',async function(req, res) {
    const thisclass = await Class.findById(req.params.cid);
    t_id = req.body.id;
    if(JSON.stringify(thisclass.teacher) != JSON.stringify(t_id)) return res.send("Sorry, You are not assigned to this class");
    if(!thisclass) return res.send("Sorry, You are not assigned to any class");
    const assignment = req.body.assignment;
    var assignments = [];
    if(thisclass.assignments.length == 0){
        console.log("No previous quizzes added");
        assignments.push(assignment);
    }
    else{
        assignments = thisclass.assignments;
        assignments.push(assignment);
    }
    const classupdate = await Class.findOneAndUpdate({teacher:t_id},{
        $set:{
            assignments:assignments
        },new:true
    });
    res.send(classupdate);
});

//Delete Assignment
router.delete('/deleteassignment/:cid/:index', async function(req,res) {
    const thisclass = await Class.findById(req.params.cid);
    const index = req.params.index;
    if (thisclass.quizzes.length>index){
        var assignments = thisclass.assignments;
        assignments.splice(index,1);
        const classupdate = await Class.findByIdAndUpdate(req.params.cid,{
            $set:{
                assignments:assignments
            },new:true
        });
        res.send(classupdate);
    }else{
        res.send("Sorry not scuh quiz exists");
    }
});

//View Quiz responses
router.get('/veiwquizresponse/:cid/:index', async function(req,res){
    const thisclass = await Class.findById(req.params.cid);
    const index = req.params.index;
    if (thisclass.quizzes.length>index){
        var responded_quizes = await Class.findById(req.params.cid);
        var responses = 0;
        responded_quizes = responded_quizes.quizResponse;
        for(let i=0;i<responded_quizes.length;i++){
            if(responded_quizes[i].quiznumber){
                responses = responded_quizes[i].responses;
            }
        }
        if(responses==0){
            res.send("Quiz is not responded yet");
        }else{
            res.send(responses);
        }
    }else{
        res.send("Sorry not scuh quiz exists");
    }
});

router.put('/addquiz/:cid',async function(req, res) {

   

    const thisclass = await Class.findById(req.params.cid);

    if(JSON.stringify(thisclass.teacher) != JSON.stringify(t_id)) return res.send("Sorry, You are not assigned to this class");

    if(!thisclass) return res.send("Sorry, You are not assigned to any class");

    const quiz = req.body.quiz;

    var quizzes = [];

    if(thisclass.quizzes.length == 0){

        console.log("No previous quizzes added");

        quizzes.push(quiz);

    }

    else{

        quizzes = thisclass.quizzes;

        quizzes.push(quiz);

    }

    const classupdate = await Class.findOneAndUpdate({teacher:t_id},{

        $set:{

            quizzes:quizzes

        },new:true

    });

    res.send(classupdate);

});



//View Assignment responses
router.get('/veiwassignmentresponse/:cid/:index', async function(req,res){
    const thisclass = await Class.findById(req.params.cid);
    const index = req.params.index;
    if (thisclass.assignment.length>index){
        var responded_assignment = await Class.findById(req.params.cid);
        var responses = 0;
        responded_assignment = responded_assignment.assignmentResponse;
        for(let i=0;i<responded_assignment.length;i++){
            if(responded_assignment[i].assignmentnumber){
                responses = responded_quizes[i].responses;
            }
        }
        if(responses==0){
            res.send("Quiz is not responded yet");
        }else{
            res.send(responses);
        }
    }else{
        res.send("Sorry not scuh quiz exists");
    }
});


function validateTeacherLogin(logindetails){
    const schema = Joi.object({
        username:Joi.string().required(),
        password:Joi.string().required()
    });
    return schema.validate(logindetails);
}
module.exports = router;