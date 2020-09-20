const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const auth = require('../routes/auth');
router.route('/')
    .get((req, res, next) => {
        Question.find()
            // .populate({ path: "category", models: "Category" })
            // .populate({ path: "owner", models: "User" })
            .then((question) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(question);
            }).catch(next);
    })
    .post((req, res, next) => {
        const qsn = new Question({  
            question: req.body.question, 
            desc: req.body.desc,
            category: req.body.category,  
            owner: req.user.id }); 
            qsn.save()
            .then(result => {
            console.log(result); res.status(201).json(result);
        }).catch(err => { console.log(err); res.status(500).json({ error: err }); });
    })

    .delete (auth.verifyUser, (req, res, next) => {
    Question.deleteMany({ owner: req.user.id })
        .then(reply => {
            res.json(reply);
        }).catch(next);
})

router.route('/:question_id')

    .get((req, res, next) => {
        Question.findById(req.params.question_id)
            .populate({ path: "category", models: "Category" })
            .populate({ path: "owner", models: "User" })
            .then(question => {
                res.json(question);
            }).catch(next);
    })
    .put(auth.verifyUser, (req, res, next) => {
        Question.findByIdAndUpdate(req.params.question_id, { $set: req.body }, { new: true })
            .then(question => {
                res.json(question);
            }).catch(next);
    })
    .delete((req, res, next) => {
        Question.deleteOne({ _id: req.params.question_id })
            .then(reply => {
                res.json(reply);
            }).catch(next);
    })

router.route('/:question_id/answers')
    .get((req, res, next) => {
        Question.findById(req.params.question_id)
            .then(question => {
                res.json(question.answers);
            }).catch(next);
    })
    .post((req, res, next) => {

        Question.findById(req.params.question_id)
            .then(question => {
                let {answer}=req.body;
                question.answers.push({owner:req.user.id,answer});
                question.save()
                    .then(updateQuestion => {
                        res.json(updateQuestion.answers);
                    }).catch(next);
            }).catch(next);
    })
    .delete((req, res, next) => {
        Question.findById(req.params.question_id)
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
        Question.findById(req.params.question_id)
            .then(question => {
                res.json(question.answers.id(req.params.answer_id));
            }).catch(next);
    })
    .put((req, res, next) => {
        Question.findById(req.params.question_id)
            .then(question => {
                let answer = question.answers.id(req.params.answer_id);
                answer.answer = req.body.answer;
                question.save()
                    .then(updateQuestion => {
                        res.json(question.answers.id(req.params.answer_id));
                    }).catch(next);
            }).catch(next);
    })
    .delete((req, res, next) => {
        Question.findById(req.params.question_id)
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

    router.route('/:question_id/answers/:answer_id/comments')
    .get((req, res, next) => {
        Question.findById(req.params.question_id)
            .then(question => {
                let answer = question.answers.id(req.params.answer_id)
                console.log(answer.comments);
                res.json(answer.comments);
                
            }).catch(next);
    })
    .post((req, res, next) => {
        Question.findById(req.params.question_id)
            .then(question => {
                let answer = question.answers.id(req.params.answer_id);
                answer.comments.push(req.body, {owner:req.user.id});
                question.save()
                    .then(updateAnswer => {
                        res.json(answer.comments);
                    }).catch(next);
            }).catch(next);
    })
    .delete((req, res, next) => {
        Question.findById(req.params.question_id.answer_id)
            .then(answer => {
                answer.comments = [];
                question.save()
                    .then(updateAnswer => {
                        res.json(updateAnswer.comments);
                    }).catch(next);
            }).catch(next);
    })

router.route('/:question_id/answers/:answer_id/comments/:comment_id')
    .get((req, res, next) => {
        Question.findById(req.params.question_id.answer_id)
            .then(question => {
                res.json(question.comments.id(req.params.comment_id));
            }).catch(next);
    })
    .put((req, res, next) => {
        Question.findById(req.params.question_id.answer_id)
            .then(question => {
                let comment = question.comments.id(req.params.comment_id);
                comment.text = req.body.text;
                question.save()
                    .then(updateQuestion => {
                        res.json(updateQuestion.comments.id(req.params.comment_id));
                    }).catch(next);
            }).catch(next);
    })
    .delete((req, res, next) => {
        Question.findById(req.params.question_id.answer_id)
            .then(question => {
                question.comments = question.comments.filter((comment) => {
                    return comment.id !== req.params.comment_id;
                })
                question.save()
                    .then(updateQuestion => {
                        res.json(updateQuestion.comments);
                    }).catch(next);
            }).catch(next);
    })
module.exports = router;

