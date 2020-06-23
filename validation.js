const validator = require('validator');

const registerInput = (data) => {
    let errors = {};

    if (data.username) {
        if (!validator.isLength(data.username.trim(), { min: 4, max: 30 })) {
            errors.username = 'Username must be between 4 to 30 charaters';
        }
    }
    else errors.username = 'Username is required';

    if (data.password) {
        if (!validator.isLength(data.password.trim(), { min: 6, max: 30 })) {
            errors.password = 'Password must be between 6 to 30 characters';
        }
    }
    else errors.password = 'Password is  required';
    return {
        errors,
        isValid: Object.keys(errors).length == 0
    }
}

module.exports = {
    registerInput
}