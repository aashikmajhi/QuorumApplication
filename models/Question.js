const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},{ timestamps: true });

const answerSchema = new mongoose.Schema({
    answer: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    comments: [commentSchema],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
},{ timestamps: true });

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        max: 500,
        required: true
    },
    desc: {
        type: String,
        max:1000,
        required: true
    },
    multimedia: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category'
    },
    answers: [answerSchema],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
