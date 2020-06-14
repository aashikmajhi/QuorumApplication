const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const question = require('../models/question');
const auth = require('../routes/auth');

router.route('/')
    .get((req, res, next) => {
        question.find({ owner: req.user.id })
            .then((question) => {
                res.json(question);
            }).catch(next);
    })
    .post((req, res, next) => {
        let { name, desc, done } = req.body;
        question.create({ name, desc, done, owner: req.user.id })
            .then(question => {
                res.status(201).json(question);
            }).catch(next);
    })
    .delete(auth.verifyAdmin, (req, res, next) => {
        question.deleteMany({ owner: req.user.id })
            .then(reply => {
                res.json(reply);
            }).catch(next);
    })

router.route('/:question_id')

    .get((req, res, next) => {
        question.findById(req.params.question_id)
            .then(question => {
                res.json(question);
            }).catch(next);
    })
    .put((req, res, next) => {
        question.findByIdAndUpdate(req.params.question_id, { $set: req.body }, { new: true })
            .then(question => {
                req.json(question);
            }).catch(next);
    })
    .delete((req, res, next) => {
        question.deleteOne({ _id: req.params.question_id })
            .then(reply => {
                res.json(reply);
            }).catch(next);
    })


router.route('/:question_id/notes')
    .get((req, res, next) => {
        question.findById(req.params.question_id)
            .then(question => {
                res.json(question.notes);
            }).catch(next);
    })
    .post((req, res, next) => {
        question.findById(req.params.question_id)
            .then(question => {
                question.notes.push(req.body);
                question.save()
                    .then(updatequestion => {
                        res.json(updatequestion.notes);
                    }).catch(next);
            }).catch(next);
    })
    .delete((req, res, next) => {
        question.findById(req.params.question_id)
            .then(question => {
                question.notes = [];
                question.save()
                    .then(updatequestion => {
                        res.json(updatequestion.notes);
                    }).catch(next);
            }).catch(next);
    })
router.route('/:question_id/notes/:note_id')
    .get((req, res, next) => {
        question.findById(req.params.question_id)
            .then(question => {
                res.json(question.notes.id(req.params.note_id));
            }).catch(next);
    })
    .put((req, res, next) => {
        question.findById(req.params.question_id)
            .then(question => {
                let note = question.notes.id(req.params.note_id);
                note.text = req.body.text;
                question.save()
                    .then(updatequestion => {
                        res.json(question.notes.id(req.params.note_id));
                    }).catch(next);
            }).catch(next);
    })
    .delete((req, res, next) => {
        question.findById(req.params.question_id)
            .then(question => {
                question.notes = question.notes.filter((note) => {
                    return note.id !== req.params.note_id;
                })
                question.save()
                    .then(updatequestion => {
                        res.json(question.notes);
                    }).catch(next);
            }).catch(next);
    })

module.exports = router;

