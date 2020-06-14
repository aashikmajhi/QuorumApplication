const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const questionRouter = require('./routes/questionRouter');

const categoryRouter = require('./routes/categoryRouter');

const userRouter = require('./routes/userRouter');

const auth = require('./routes/auth');

const app = express(); //instantiating express
mongoose.connect(process.env.DbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true
})
    .then(() => { console.log('Database server Connected'); })
    .catch((err) => { console.log(err); });

app.use(express.json());
app.use(express.urlencoded({ extended: false })); //reading data sent by client to the server
app.get('/', (req, res, next) => {
    res.send('Welcome! To my app');
});

app.use('/api/users', userRouter);
app.use('/api/questions', auth.verifyUser, questionRouter);
app.use('/api/categories', auth.verifyUser, categoryRouter);

app.use((req, res, next) => {
    let err = new Error('Not Found!');
    err.status = 404;
    next(err);
})

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(err.status || 500);
    res.json({
        status: 'error',
        message: err.message
    })
})

app.listen(process.env.Port, () => {
    console.log(`Server is running at localhost: ${process.env.Port}`);
});

module.exports = questionRouter;