// test ('sample test',()=>{
//     expect (true).toBe(true)
// })

const request = require('supertest')
const express = require('express')
require('dotenv').config()
const userRouter = require('../routes/userRouter')

const app = express()
app.use(express.json())
app.use('/users', userRouter)
// Setup
require('./setup')


describe('Test of User Route', () => {
    
    test('should be able to register a user', () => {
        return request(app).post('/users/register')
            .send({
                username: 'testme',
                password: 'testme',
                firstName: 'test',
                lastName: 'test'
            })
            .then((res) => {
                console.log(res.body)
                expect(res.statusCode).toBe(200)
            })

    })

    test('should not register user with same username', () => {
        return request(app).post('/users/register')
            .send({
                username: 'testme',
                password: 'testme',
                firstName: 'test',
                lastName: 'test'
            }).then((res) => {
                console.log(res.body)
                expect(res.status).toBe(401)
                expect(res.body.status).toBe('error')
            })
    })

    test('should be able to login', () => {
        return request(app).post('/users/login')
            .send({
                username: 'testme',
                password: 'testme'
            }).then((res) => {
                console.log(res.body)
                expect(res.statusCode).toBe(200)
                expect(res.body.token).not.toBe('undefined')
            })
    })    
})

describe('Validation of User', () => {
    test('should not register user with short username', () => {
        return request(app).post('/users/register')
            .send({
                username: 'aau',
                password: 'aashik123'
            }).then((res) => {
                console.log(res.body)
                expect(res.statusCode).toBe(400)
                expect(res.body.status).toBe('error')
            })
    })

    test('should not register user with short password', () => {
        return request(app).post('/users/register')
            .send({
                username: 'aashik123',
                password: 'aau'
            }).then((res) => {
                console.log(res.body)
                expect(res.statusCode).toBe(400)
                expect(res.body.status).toBe('error')
            })
    })    

    test('should be not be able to login with wrong password', () => {
        return request(app).post('/users/login')
            .send({
                username: 'testme',
                password: 'test'
            }).then((res) => {
                console.log(res.body)
                expect(res.statusCode).toBe(401)
                expect(res.body.status).toBe('error')
            })
    })

    test('should not be able to login with wrong username', () => {
        return request(app).post('/users/login')
            .send({
                username: 'test',
                password: 'testme'
            }).then((res) => {
                console.log(res.body)
                expect(res.statusCode).toBe(401)
                expect(res.body.status).toBe('error')
            })
    })
})
