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
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    multimedia: {
        type: multimedia,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    answers: [answerSchema],
    comments: [commentSchema],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('question', questionSchema);
