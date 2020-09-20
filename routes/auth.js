const jwt = require('jsonwebtoken');

function verifyUser(req, res, next) {
    let authHeader = req.headers.authorization;
    if (!authHeader) {
        let err = new Error('Unauthenticated information');
        err.status = 401;
        return next(err);
    }


    let token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.SECRET, (err, payload) => {
        if (err) {
            let err = new Error('Token could not be verified');
            return next(err);
        }
        // console.log(payload);
        req.user = payload;
        next();
    })
}

function verifyAdmin(req, res, next) {
    if (!req.user) {
        let err = new Error('No authenticated information');
        err.status = 401;
        return next(err);
    }
    else if (req.user.role !== 'admin') {
        let err = new Error('Forbidden');
        err.status = 403;
        return next(err);
    }
    next();
}

module.exports = {
    verifyUser,
    verifyAdmin
}