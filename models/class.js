var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var classSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    teacher: {
        type: mongoose.Types.ObjectId,
        ref: 'Teacher'
    },

    students: {
        type: [{
            sid: {
                type: mongoose.Types.ObjectId,
                ref: 'Student'
            }
        }]
    },
    quizzes:{
        type:[String]
<<<<<<< HEAD
    },
    assignments:{
        type:[String]
    },

    quizResponse:[{
        quiznumber : Number,
        responses:[
            {
                sid:{
                    type: mongoose.Types.ObjectId,
                    ref:"Student"
                },
                answer: String
            }
        ]

    }],

    assignmentResponse:[{
        assignmentnumber : Number,
        responses:[
            {
                sid:{
                    type: mongoose.Types.ObjectId,
                    ref:"Student"
                },
                answer: String
            }
        ]

    }]
=======
    }
>>>>>>> dd48ffc0b5ee0a5b037a7b685a2cf5ace77a53b2


});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;