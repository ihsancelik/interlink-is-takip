const jwt = require('jsonwebtoken');
const config = require('../config.json');

const secretKey = config.jwt['secret-key'];
const expiresIn = config.jwt['expires-in'];

function generateToken(department_id, department_name, user_id, full_name, username) {
    const token = jwt.sign({
        department_id: department_id,
        department_name: department_name,
        user_id: user_id,
        full_name: full_name,
        username: username
    }, secretKey, { expiresIn: expiresIn });
    return token;
}

function decodeToken(token) {
    try {
        const decoded = jwt.verify(token, privateKey);
        return decoded;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = {
    generateToken,
    decodeToken
}