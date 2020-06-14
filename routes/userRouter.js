const express = require('express');
//const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const validation = require('../validation');

router.post('/register', (req, res, next) => {
    const { errors, isValid } = validation.registerInput(req.body);
    if (isValid) {
        res.status(404).json({
            status: 'error',
            message: errors
        });
    }
    let { username, password, firstName, lastName, role } = req.body;
    User.findOne({ username: req.body.username })
        .then((user) => {
            if (user) {
                let err = new Error('User already exists!');
                err.status = 401;
                return next(err);
            }
            bcrypt.hash(password, 8)
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
                let err = new Error('User not Found!');
                err.status = 401;
                return next(err);
            }
            bcrypt.compare(password, user.password)
                .then((isMatched) => {
                    if (!isMatched) {
                        let err = new Error('Password does not exist!');
                        err.status = 401;
                        return next(err);
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
                            token: `Bearer ${token}`
                        });
                    });
                }).catch(next);
        }).catch(next);
})

module.exports = router;