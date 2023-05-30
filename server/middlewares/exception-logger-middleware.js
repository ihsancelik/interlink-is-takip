const { SystemExceptionLog } = require('../db');

const logErrorMiddleware = (error, request, response, next) => {
    if (error.status === 500) {
        new SystemExceptionLog({
            message: error.message,
            stack: error.stack,
            date: new Date()
        }).save();

        response.status(500).json({ message: "Beklenmeyen bir hata oluştu. Lütfen sakin olun. Geliştirici ekip bilgilendirildi." });
    }
    else {
        response.status(error.status).json({ message: error.message });
    }
};


module.exports = {
    logErrorMiddleware
};