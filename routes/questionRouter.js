const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const question = require('../models/Question');
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

router.route('/:question_id/answers')
    .get((req, res, next) => {
        question.findById(req.params.question_id)
            .then(question => {
                res.json(question.answers);
            }).catch(next);
    })
    .post((req, res, next) => {
        question.findById(req.params.question_id)
            .then(question => {
                question.answers.push(req.body);
                question.save()
                    .then(updateQuestion => {
                        res.json(updateQuestion.answers);
                    }).catch(next);
            }).catch(next);
    })
    .delete((req, res, next) => {
        question.findById(req.params.question_id)
            .then(question => {
                question.answers = [];
                question.save()
                    .then(updateQuestion => {
                        res.json(updateQuestion.answers);
                    }).catch(next);
            }).catch(next);
    })

router.route('/:question_id/answers/:answer_id')
    .get((req, res, next) => {
        question.findById(req.params.question_id)
            .then(question => {
                res.json(question.answers.id(req.params.answer_id));
            }).catch(next);
    })
    .put((req, res, next) => {
        question.findById(req.params.question_id)
            .then(question => {
                let answer = question.answers.id(req.params.answer_id);
                answer.text = req.body.text;
                question.save()
                    .then(updateQuestion => {
                        res.json(question.answers.id(req.params.answer_id));
                    }).catch(next);
            }).catch(next);
    })
    .delete((req, res, next) => {
        question.findById(req.params.question_id)
            .then(question => {
                question.answers = question.answers.filter((answer) => {
                    return answer.id !== req.params.answer_id;
                })
                question.save()
                    .then(updateQuestion => {
                        res.json(question.answers);
                    }).catch(next);
            }).catch(next);
    })

router.route('/:question_id/comments')
    .get((req, res, next) => {
        question.findById(req.params.question_id)
            .then(question => {
                res.json(question.comments);
            }).catch(next);
    })
    .post((req, res, next) => {
        question.findById(req.params.question_id)
            .then(question => {
                question.comments.push(req.body);
                question.save()
                    .then(updateQuestion => {
                        res.json(updateQuestion.comments);
                    }).catch(next);
            }).catch(next);
    })
    .delete((req, res, next) => {
        question.findById(req.params.question_id)
            .then(question => {
                question.comments = [];
                question.save()
                    .then(updateQuestion => {
                        res.json(updateQuestion.comments);
                    }).catch(next);
            }).catch(next);
    })
router.route('/:question_id/comments/:comment_id')
    .get((req, res, next) => {
        question.findById(req.params.question_id)
            .then(question => {
                res.json(question.comments.id(req.params.comment_id));
            }).catch(next);
    })
    .put((req, res, next) => {
        question.findById(req.params.question_id)
            .then(question => {
                let comment = question.comments.id(req.params.comment_id);
                comment.text = req.body.text;
                question.save()
                    .then(updateQuestion => {
                        res.json(question.comments.id(req.params.comment_id));
                    }).catch(next);
            }).catch(next);
    })
    .delete((req, res, next) => {
        question.findById(req.params.question_id)
            .then(question => {
                question.comments = question.comments.filter((comment) => {
                    return comment.id !== req.params.comment_id;
                })
                question.save()
                    .then(updateQuestion => {
                        res.json(question.comments);
                    }).catch(next);
            }).catch(next);
    })

module.exports = router;

