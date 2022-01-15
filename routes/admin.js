const express = require('express');
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);
const bcrypt = require('bcrypt');
var router = express.Router();
// var Admin = require('../models/admin');
var Class = require('../models/class');
var Teacher = require('../models/teacher');
var {Student} = require('../models/student');

var {Admin} = require("../models/admin");

//Authenticating login
router.post("/adminlogin",async function(req,res){
    const {error} = validateAdminLogin(req.body);
    if(error) return res.status(400).send("The entered login details are invalid");
    const admin = await Admin.findOne({username:req.body.username});

    if(!admin) return res.status(200).send("Invalid Email or password");

    const validPassword = await bcrypt.compare(req.body.password,admin.password)
    if(!validPassword) return res.status(200).send("Invalid Email or password");
    res.send("Logged in successfully");


})



/* GET Operations */

router.get('/', function(req, res) {
    res.send('Welcome to Admin panel');

});


router.get('/classes',async function(req, res) {
    const classes = await Class.find()
    .populate('teacher','-_id name')
    .populate('students.sid','name rollno')
    .select("name teacher students.name students.rollno");
    if(classes.length==0) return res.send("No classes available");
    res.send(classes);
});


router.get('/students',async function(req, res) {
    const students = await Student.find()
                        .sort("name");
   if(students.length == 0) return res.send("No Students found");
   res.send(students);
});


router.get('/teachers',async function(req, res) {
    const teachers = await Teacher.find()
                        .sort("name");
   if(!teachers.length>0) return res.send("No teachers found");
   res.send(teachers);
});


router.get('/classes/:id',async function(req, res) {
    const classes = await Class.findById(req.params.id);
    if(!classes) return res.status(400).send("Class not found");
    res.send(classes);
    
});


router.get('/students/:id',async function(req, res) {
    const student = await Student.findById(req.params.id);
    
    if(!student) return res.status(400).send("Student not found");

    res.send(student);   

});
router.get('/teachers/:id',async function(req, res) {
    
    const teacher = await Teacher.findById(req.params.id);

    if(!teacher) return res.status(400).send("Teacher not found");

    res.send(teacher);   

});


//POST Operations
router.post('/addteacher',async function(req, res) {
    
    const {error} = validateTeacher(req.body);

    if(error) return res.status(400).send("The entered teacher details are invalid");
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(req.body.password,salt);
    const teacher = new Teacher({

        name:req.body.name,
        designation:req.body.designation,
        username:req.body.username,
        password : pass

    });

    await teacher.save();
    res.send(teacher);
});

router.post('/addclass',async function(req, res) {
    const {error} = validateClass(req.body);
    
    if(error) return res.status(400).send("The entered class details are invalid");
    const newClass = new Class({
        name:req.body.name,
        teacher:req.body.teacher,
        students:req.body.students
    })
    await newClass.save()
    
    
    res.send(newClass);

/*
{

	"name":"Theory of Automata",
	"teacher":"61cefde86baaeaa3adf32b39",
	"students":[{"sid":"61c9e9e503aa64dd5d9d6256"},{"sid":"61c9dc7e2e6cf32fff236954"},{"sid":"61c9e9ef03aa64dd5d9d6258"}]
}
*/


    
});

router.post('/addstudent',async function(req, res) {

    const {error} = validateStudent(req.body);
    
    if(error) return res.status(400).send("The entered student details are invalid");
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(req.body.password,salt);

    const student = new Student({
        name:req.body.name,
        rollno:req.body.rollno,
        username: req.body.username,
        password:pass
    });

    await student.save();
    res.send(student);




/*
{
	"name":"Haeaf Malik",
	"rollno":"BCS 080",
	"username":"hm@gmail.com",
	"password": "12345"
}
*/
   
});
//PUT Operations
router.put('/assign/:cid/Student/:sid',async function(req, res) {
    
    const check = await Class.findById({_id:req.params.cid});

    if(!check) return res.status(400).send("Class not found");

    const exist = check.students.find(function(sid){
        const id = JSON.stringify(req.params.sid);
        if(JSON.stringify(sid.sid) == id){
            return true;
        }
        
    });
    console.log(exist);
    if(exist) return res.send("Student is already present in the class");
    
        
    const updateclass = await Class.findByIdAndUpdate({_id:req.params.cid},{

            "$addToSet": {
                "students": {
                    "sid": req.params.sid,
                }
            }
    },{new:true,upsert:false});

    res.send(updateclass);
    
});

//Delete Operations
router.delete('/delteacher/:id',async function(req, res) {
    const teacher = await  Teacher.findByIdAndRemove(req.params.id);
    if(!teacher) return res.status(400).send("No teacher found with the given ID");
    res.send("Deleted teacher: ",teacher);
});
router.delete('/delclass/:id',async function(req, res) {
    const delclass = await  Class.findByIdAndRemove(req.params.id);
    if(!delclass) return res.status(400).send("No Class found with the given ID");
    res.send("Deleted class: ",delclass);
    
});
router.delete('/delstudent/:id',async function(req, res) {
    const delstudent = await  Student.findByIdAndDelete(req.params.id);
    if(!delstudent) return res.status(400).send("No Student found with the given ID");
    res.send("Deleted student: ",delstudent);
    
});
module.exports = router;


//Validations
function validateTeacher(teacher){
    const schema = Joi.object({
            name : Joi.string().min(3).max(255).required(),
            designation:Joi.string().min(3).max(255).required(),
            username:Joi.string().min(5).max(255).required(),
            password:Joi.string().min(5).max(1024).required()
        });
        return schema.validate(teacher);
}

function validateStudent(student){
    const schema = Joi.object({
            name:Joi.string().min(3).max(255).required(),
            rollno:Joi.string().min(3).max(255).required(),
            username:Joi.string().min(5).max(255).required(),
            password:Joi.string().min(5).max(1024).required()
        });
        console.log(schema.validate(student));
        return schema.validate(student);
}

function validateClass(classDetails){
    const schema = Joi.object({
        name:Joi.string().min(3).max(255).required(),
        teacher:Joi.objectId(),
        students:Joi.array()
    });
    return schema.validate(classDetails);
}

//Admin login validation
function validateAdmin(logindetails){
    const schema = Joi.object({
        name:Joi.string().required(),
        username:Joi.string().required(),
        password:Joi.string().required()
    });
    return schema.validate(logindetails);
}

function validateAdminLogin(logindetails){
    const schema = Joi.object({
        username:Joi.string().required(),
        password:Joi.string().required()
    });
    return schema.validate(logindetails);
}