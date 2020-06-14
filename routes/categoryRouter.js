const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Category = require('../models/Category');
const question = require('../models/question');

router.route('/')
    .get((req, res, next) => {
        Category.find()
            .then((categories) => {
                res.json(categories);
            }).catch(next);
    })
    .post((req, res, next) => {
        Category.create(req.body)
            .then(category => {
                res.status(201).json(category);
            }).catch(next);
    })
    .delete((req, res, next) => {
        Category.deleteMany()
            .then(reply => {
                res.json(reply);
            }).catch(next);
    })

router.route('/:category_id')
    .get((req, res, next) => {
        Category.findById(req.params.category_id)
            .then(categories => {
                res.json(categories);
            }).catch(next);
    })
    .put((req, res, next) => {
        Category.findByIdAndUpdate(req.params.category_id, { $set: req.body }, { new: true })
            .then(category => {
                req.json(category);
            }).catch(next);
    })
    .delete((req, res, next) => {
        Category.deleteOne({ _id: req.params.category_id })
            .then(reply => {
                res.json(reply);
            }).catch(next);
    })

router.route('/:category_id/questions')
    .get((req, res, next) => {
        Category.findById(req.params.category_id)
            .then(category => {
                res.json(category.questions);
            }).catch(next);
    })
    .post((req, res, next) => {
        Category.findById(req.params.category_id)
            .then(category => {
                question.create(req.body)
                    .then(question => {
                        category.questions.push(question_id);
                        category.save()
                            .then(updateCategory => {
                                res.status(201).json(updateCategory.questions);
                            }).catch(next);
                    }).catch(next);
            }).catch(next);
    })
    .delete((req, res, next) => {
        Category.findById(req.params.category_id)
            .then(category => {
                question.deleteMany({ _id: { $in: category.question } })
                    .then(reply => {
                        category.questions = [];
                        category.save()
                            .then(updatedCategory => {
                                res.json({ reply, updatedCategory })
                            }).catch(next);
                    }).catch(next);
            }).catch(next);
    })

router.route('/:category_id/questions/:question_id')
    .get((req, res, next) => {
        Category.findById(req.params.category_id)
            .then(category => {
                if (category.questions.includes(req.params.question_id)) {
                    question.findById(req.params.question_id)
                        .then(question => {
                            res.json(question);
                        }).catch(next);
                }
                else {
                    let err = new Error('question not Found');
                    err.status = 404;
                    next(err);
                }
            }).catch(next);
    })
    .put((req, res, next) => {
        Category.findById(req.params.category_id)
            .then(category => {
                if (category.questions.includes(req.params.question_id)) {
                    question.findByIdAndUpdate(req.params.question_id, { $set: req.body }, { new: true })
                        .then(question => {
                            res.json(question);
                        }).catch(next);
                }
                else {
                    throw new Error('Not Found');
                }
            }).catch(next);
    })
    .delete((req, res, next) => {
        Category.findById(req.params.category_id)
            .then(category => {
                if (category.questions.includes(req.params.question_id)) {
                    question.deleteOne({ _id: req.params.question_id })
                        .then(reply => {
                            category.questions = category.questions.filter((value) => {
                                return value !== req.params.question_id;
                            })
                            category.save()
                                .then(updatedCategory => {
                                    res.json({ reply, updatedCategory })
                                }).catch(next);
                        }).catch(next);
                }
                else {
                    throw new Error('Not Found');
                }
            }).catch(next);
    })

module.exports = router;