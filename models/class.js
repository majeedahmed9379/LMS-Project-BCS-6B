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
    },
    assignments:{
        type:[String]
    },

    quizResponse:{
        type:[
            {
                sid:{
                    type: mongoose.Types.ObjectId,
                    ref:"Student"
                },
                answer: String
            }
        ]

    },

    assignmentResponse:{
        type:[
            {
                sid:{
                    type: mongoose.Types.ObjectId,
                    ref:"Student"
                },
                answer: String
            }
        ]

    }

});

const Class = mongoose.model('Class', classSchema);

module.exports = Class;