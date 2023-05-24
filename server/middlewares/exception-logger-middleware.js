const { SystemExceptionLog } = require('../db');

const logErrorMiddleware = (error, request, response, next) => {

    new SystemExceptionLog({
        message: error.message,
        stack: error.stack,
        date: new Date()
    }).save();

    response.status(500).json({ message: "Beklenmeyen bir hata oluştu.Sakin olun. Geliştirici ekip bilgilendirildi." });
};


module.exports = {
    logErrorMiddleware
};