const express = require('express');
const mongoose = require('mongoose');
// const config = require('config');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');

app.use(helmet());
app.use(express.json());

const index = require('./routes/index');
const admin = require('./routes/admin');
const teacher = require('./routes/teacher');
const student = require('./routes/student');
const { ifError } = require('assert');
// if(!config.get('jwtPrivateKey')){
//     console.log("Fatal error, Private key not defined");
//     process.exit(1)
// }
mongoose.connect('mongodb://localhost/LMS')
    .then(()=>console.log("Connected to database successfully"))
    .catch((err)=>console.log(err.message));



app.use("/lms/",index);
app.use("/admin",admin);
app.use("/teacher",teacher);
app.use("/student",student)

//Checking environment
if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    console.log("Morgan enabled");
}
var port = 3000;

app.listen(port,()=>{
    console.log(`LMS Listening on port: ${port}`);
});







/* Path to follow 

make index router  done
make admin router 
make teacher router
make student router
make head router

*/