const nodemailer = require('nodemailer');
const util = require('util');
const { MailAccount } = require('../db');

async function sendEmail(subject, message, toList) {

    const { email, host, port, secure, username, password } = MailAccount.findOne({})[0];

    const transporter = nodemailer.createTransport({
        host: host,
        port: port,
        secure: secure,
        auth: {
            user: username,
            pass: password
        }
    });

    const sendMailAsync = util.promisify(transporter.sendMail).bind(transporter)

    const mailOptions = {
        from: email,
        to: toList,
        subject: subject,
        html: message
    };

    try {
        const info = await sendMailAsync(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    sendEmail
}