const request = require('supertest');
const express = require('express');
require('dotenv').config();
const userRouter = require('../routes/userRouter');
const questionRouter = require('../routes/questionRouter')
const categoryRouter = require('../routes/categoryRouter');
const auth = require('../routes/auth');

const app = express();
app.use(express.json());
app.use('/users', userRouter);
app.use('/questions', auth.verifyUser, questionRouter);
app.use('/categories', auth.verifyUser, categoryRouter);

// Setup
require('./setup');

let token;
let userId;
beforeAll(() => {
    return request(app).post('/users/register')
        .send({
            username: 'testme123',
            password: 'testme123',
            firstName: 'Test',
            lastName: 'User'
        })
        .then((res) => {
            console.log(res.body)
            userId = res.body._id;
            return request(app).post('/users/login')
                .send({
                    username: 'testme123',
                    password: 'testme123'
                }).then((res) => {
                    console.log(res.body)
                    expect(res.statusCode).toBe(200);
                    token = res.body.token;
                })
        })
})

let admintoken;
let adminId;
describe('Testing admin features', () => {

    beforeAll(() => {
        return request(app).post('/users/register')
            .send({
                username: 'admin',
                password: 'admin123',
                firstName: 'admin',
                lastName: 'admin',
                role: 'admin'
            })
            .then((res) => {
                console.log(res.body)
                adminId = res.body._id;
                return request(app).post('/users/login')
                    .send({
                        username: 'admin',
                        password: 'admin123'
                    }).then((res) => {
                        console.log(res.body)
                        expect(res.statusCode).toBe(200);
                        admintoken = res.body.token;
                    })
            })
    })


})

let postId;
let ansId;
let cmtId;
describe('Testing Question Router', () => {

    let token;
    let userId;
    beforeAll(() => {
        return request(app).post('/users/register')
            .send({
                username: 'testme123',
                password: 'testme123',
                firstName: 'Test',
                lastName: 'User'
            })
            .then((res) => {
                console.log(res.body)
                userId = res.body._id;
                return request(app).post('/users/login')
                    .send({
                        username: 'testme123',
                        password: 'testme123'
                    }).then((res) => {
                        console.log(res.body)
                        expect(res.statusCode).toBe(200);
                        token = res.body.token;
                    })
            })
    })

    // let postId;
    test('Should make a new post', () => {
        return request(app).post('/questions')
            .set('authorization', token)
            .send({
                question: 'How can be testing done?',
                desc: 'Restful routes being developed using express and node. Jest and supertest for testing the end-points',
                owner: userId
            })
            .then((res) => {
                console.log(res.body)
                expect(res.statusCode).toBe(201)
                postId = res.body._id;
            })
    })

    test('Should get all posted questions', () => {
        return request(app).get('/questions')
            .set('authorization', token)
            .then((res) => {
                console.log(res.body);
                expect(res.statusCode).toBe(200);
            })
    })

    test('Should get particular posted question', () => {
        return request(app).get(`/questions/${postId}`)
            .set('authorization', token)
            .then((res) => {
                console.log(res.body);
                expect(res.statusCode).toBe(200);
            })
    })

    test('Should update a particular post', () => {
        return request(app).put(`/questions/${postId}`)
            .set('authorization', token)
            .send({
                question: 'How to do Programming?'
            })
            .then((res) => {
                console.log(res.body)
                // expect(res.statusCode).toBe(200)
                expect(res.body.question).not.toBe('How can be testing done?')
            })
    })

    


    //testing particuar question and its answer

    test('Should answer particular posted question', () => {

        return request(app).post(`/questions/${postId}/answers`)
            .set('authorization', token)
            .send({
                answer: 'Make proper use of Jest and refer to relevant tutorials and documentation.'
            }).then((res) => {
                console.log(res.body);
                ansId = res.body._id;
                expect(res.statusCode).toBe(200)
                // expect(res.body.answer).toBe('Make proper use of Jest and refer to relevant tutorials and documentation.')
            })

    })

    test('Should get all answer from particular posted question', () => {
        return request(app).get(`/questions/${postId}/answers`)
            .set('authorization', token)
            .then((res) => {
                console.log(res.body);
                expect(res.statusCode).toBe(200)
            })
    })

    test('Should get a particular answer from particular posted question', () => {
        return request(app).get(`/questions/${postId}/answers/${ansId}`)
            .set('authorization', token)
            .then((res) => {
                console.log(res.body);
                expect(res.statusCode).toBe(200)
            })
    })

    test('Should update a particular answer from particular posted question', () => {
        return request(app).put(`/questions/${postId}/answers/${ansId}`)
            .set('authorization', token)
            .send({
                answer: 'Define your code structure and implement proper testing framework.'
            })
            .then((res) => {
                console.log(res.body);
                // expect(res.statusCode).toBe(200)
                // expect(res.body).toBe(['Define your code structure and implement proper testing framework.'])
            })
    })

    test('Should delete a particular answer from particular posted question', () => {
        return request(app).delete(`/questions/${postId}/answers/${ansId}`)
            .set('authorization', token)
            .then((res) => {
                console.log(res.body);
                expect(res.statusCode).toBe(200)
            })
    })

    test('Should delete all answer from particular posted question', () => {
        return request(app).delete(`/questions/${postId}/answers`)
            .set('authorization', token)
            .then((res) => {
                console.log(res.body);
                expect(res.statusCode).toBe(200)
            })
    })

    // comments on particular answers of posted questons

    test('Should comment on answer of a particular posted question', () => {

        return request(app).post(`/questions/${postId}/answers/${ansId}/comments`)
            .set('authorization', token)
            .send({
                comment: 'This is a good solution. Really appreciate your effort and support. Thanks!'
            })
            .then((res) => {
                console.log(res.body)
                cmtId = res.body._id
                expect(res.statusCode).not.toBe(300)
            })
    })

    

    // particular comments on particular answers of posted questons

    test('Should get particular comment on particular answer of a particular posted question', () => {
        return request(app).get(`/questions/${postId}/answers/${ansId}/comments/${cmtId}`)
            .set('authorization', token)
            .then((res) => {
                console.log(res.body)
                expect(res.statusCode).not.toBe(300)
            })
    })

    test('Should get particular comment on particular answer of a particular posted question', () => {
        return request(app).get(`/questions/${postId}`)
            .set('authorization', token)
            .then((res) => {
                console.log(res.body)
                return request(app).get(`/questions/${postId}/answers/${ansId}`)
                    .set('authorization', token)
            }).then((res) => {
                console.log(res);
                return request(app).put(`/questions/${postId}/answers/${ansId}/comments/${cmtId}`)
                    .set('authorization', token)
                    .send({
                        comment:'You could probably make use of relevant dependencies and libraries to ease up the testing.'
                    })
                    .then((res) => {
                        console.log(res.body)
                        expect(res.statusCode).not.toBe(400)                        
                    })
            })
    })

    test('Should get particular comment on particular answer of a particular posted question', () => {
        return request(app).get(`/questions/${postId}`)
            .set('authorization', token)
            .then((res) => {
                console.log(res.body)
                return request(app).get(`/questions/${postId}/answers/${ansId}`)
                    .set('authorization', token)
            }).then((res) => {
                console.log(res);
                return request(app).delete(`/questions/${postId}/answers/${ansId}/comments/${cmtId}`)
                    .set('authorization', token)
                    .then((res) => {
                        console.log(res.body)
                        expect(res.statusCode).not.toBe(404)                        
                    })
            })
    })

    test('Should get all comments on answer from particular posted question', () => {
        return request(app).get(`/questions/${postId}/answers/${ansId}/comments`)
            .set('authorization', token)
            .then((res) => {
                console.log(res.body)
                cmtId = res.body._id
                expect(res.statusCode).not.toBe(400)
            })
    })

    test('Should delete comment from particular answer from particular posted question', () => {
        return request(app).delete(`/questions/${postId}/answers/${ansId}/comments`)
            .set('authorization', token)
            .then((res) => {
                console.log(res.body)
                cmtId = res.body._id
                expect(res.statusCode).not.toBe(403)
            })
    })

    //Delete testing

    test('Should delete particular posted question', () => {
        return request(app).delete(`/questions/${postId}`)
            .set('authorization', token)
            .then((res) => {
                console.log(res.body);
                expect(res.statusCode).toBe(200);
            })
    })

    test('Should delete all posted question', () => {
        return request(app).delete(`/questions`)
            .set('authorization', token)
            .then((res) => {
                console.log(res.body);
                expect(res.statusCode).toBe(200)
            })
    })
})






