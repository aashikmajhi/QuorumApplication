const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const auth = require('../routes/auth');


const validation = require('../validation');
const { route } = require('./questionRouter');

router.post('/register', (req, res, next) => {
    const { errors, isValid } = validation.registerInput(req.body);
    if (!isValid) {

        return res.status(400).json({
            status: 'error',
            message: errors
        });
    }
    let { username, password, firstName, lastName, role } = req.body;
    User.findOne({ username: req.body.username })
        .then((user) => {
            if (user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'User already exists'
                })
            }
            bcrypt.hash(password, 10)
                .then(hashed => {
                    User.create({ username, password: hashed, firstName, lastName, role })
                        .then((user) => {
                            res.json({ status: 'Registration Successful!' });
                        }).catch(next);
                }).catch(next);
        }).catch(next);
})

router.post('/login', (req, res, next) => {
    let { username, password } = req.body;
    User.findOne({ username })
        .then((user) => {
            if (!user) {

                return res.status(401).json({
                    status: 'error',
                    message: 'User not found'
                })
            }
            bcrypt.compare(password, user.password)
                .then((isMatched) => {
                    if (!isMatched) {
                        return res.status(401).json({
                            status: 'error',
                            message: 'Password does not exist'
                        })
                    }
                    //using jwt
                    let payload = {
                        id: user.id,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role
                    }
                    jwt.sign(payload, process.env.SECRET, (err, token) => {
                        if (err) {
                            return next(err);
                        }
                        res.json({
                            status: 'Login Successful',
                            token: `Bearer ${token}`,
                            owner: user.id
                        });
                    });
                }).catch(next);
        }).catch(next);
})

router.route('/')
.get((req, res, next) => {
    User.find()
        .then((user) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(user);
        }).catch(next);
})

router.route('/:user_id')
.get((req,res,next)=>{
    User.findById(req.params.user_id)
    .then((user)=>{
        res.json(user);
    }).catch(next);
})

.put((req, res, next) => { 
    User.findByIdAndUpdate(req.params.user_id, { $set: req.body }, { new: true })
        .then(user => {
            res.json(user);
        }).catch(next);
})
.delete (auth.verifyAdmin, (req, res, next) => {
    User.deleteOne({ owner: req.user.id })
        .then(reply => {
            res.json(reply);
        }).catch(next);
})

module.exports = router;