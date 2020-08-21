const request = require('supertest');
const express = require('express');
require('dotenv').config();
const userRouter = require('../routes/userRouter');
const categoryRouter = require('../routes/categoryRouter');
const auth = require('../routes/auth');

const app = express();
app.use(express.json());
app.use('/users', userRouter);
app.use('/categories', auth.verifyUser, categoryRouter);

// Setup
require('./setup');

let token;
beforeAll(() => {
    return request(app).post('/users/register')
        .send({
            username: 'test1234',
            password: 'test1234',
            firstName: 'Test',
            lastName: 'User',
            role: 'admin'
        })
        .then((res) => {
            console.log(res.body)
            return request(app).post('/users/login')
                .send({
                    username: 'test1234',
                    password: 'test1234'
                }).then((res) => {
                    console.log(res.body)
                    expect(res.statusCode).toBe(200);
                    token = res.body.token;
                })
        })
})

describe('Getting Category by ID',()=>{
    
    let catId
    test('Should create a new category', () => {
        return request(app.use(auth.verifyAdmin)).post('/categories')
            .set('authorization', token)
            .send({
                name: 'Home'
            })
            .then((res) => {
                console.log(res.body);
                catId = res.body._id;
                expect(res.statusCode).toBe(201);
            })
    })

    test('Should get Category with id', () => {
        return request(app).get(`/categories/${catId}`)
            .then((res) => {
                console.log(res.body);
                expect(res.statusCode).toBe(200);
            })
    })
})

describe('Category router test', () => {

        test('Should create a new category', () => {
        return request(app.use(auth.verifyAdmin)).post('/categories')
            .set('authorization', token)
            .send({
                name: 'Home'
            })
            .then((res) => {
                console.log(res.body);
                expect(res.statusCode).toBe(201);
            })
    })

    test('Should get all categories', () => {
        return request(app).get('/categories')
            .set('authorization', token)
            .then((res) => {
                expect(res.statusCode).toBe(200);
                expect(res.body[0].name).toBe('Home');
            })
    })

    test('Should delete all categories', () => {
        return request(app).delete('/categories')
            .set('authorization', token)
            .then((res) => {
                console.log(res.body);
                expect(res.statusCode).toBe(200);
            })
    })


})

