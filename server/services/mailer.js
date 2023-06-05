const nodemailer = require('nodemailer');
const util = require('util');
const { MailAccount, TaskActivityLog } = require('../db');
const { taskActivityAction } = require('../constants/activityActionConstants');
const { sendNotification } = require('../services/notification-service')
const dayjs = require('dayjs');

async function sendReminderMail(taskManager, taskPerson, taskCreator, taskid, taskTitle) {
    const curDate = getDateAndTime(new Date);

    // İş için daha önce kaç defa hatırlatma yapıldığını bul
    const reminderCount = TaskActivityLog.find({ task: taskid, action: taskActivityAction.REMINDER_SENT }).length;

    // Yöneticiye gönderilen e-posta
    var subject = `${reminderCount}.Hatırlatma - ${taskTitle} - ${curDate}`;
    var message = "Merhaba " + taskManager.full_name + ",<br/><br/>";
    message += "Yöneticisi olduğunuz bir iş için " + taskCreator.full_name + " tarafından hatırlatma yapıldı.<br/><br/>";
    message += `Talebi görüntülemek için <a href="${getRoutingURL(taskid)}">tıklayınız</a>.<br/><br/>`;

    await sendEmail(subject, message, taskManager.email);

    // İşi yapan kişi ile yönetici aynı kişiyse e-posta gönderme
    if (taskManager._id == taskPerson._id) return;

    // İşi yapan kişiye gönderilen e-posta
    message = "Merhaba " + taskPerson.full_name + ",<br/><br/>";
    message += "Görevlisi olduğunuz bir iş için " + taskCreator.full_name + " tarafından hatırlatma yapıldı.<br/><br/>";
    message += `Talebi görüntülemek için <a href="${getRoutingURL(taskid)}">tıklayınız</a>.<br/><br/>`;

    await sendEmail(subject, message, taskPerson.email);
}

async function sendTaskCreatedMail(taskManager, taskPerson, taskCreator, taskTitle, taskDescription, taskProject, taskId) {
    const curDate = getDateAndTime(new Date);

    // Yöneticiye gönderilen e-posta
    var subject = `Yeni Talep - ${taskTitle} - ${curDate}`;
    var message = `Merhaba ${taskManager.full_name}, <br/><br/>`;
    message += `${taskCreator.full_name} tarafından, yöneticisi olduğunuz departman için bir talep oluşturuldu.<br/><br/>`;

    message += `Proje: ${taskProject.name}<br/>`;
    message += `Başlık: ${taskTitle}<br/>`;
    message += `Açıklama: ${taskDescription}<br/>`
    message += `Görevli: ${taskPerson.full_name}<br/>`
    message += `Oluşturulma Tarihi: ${curDate}<br/><br/>`;
    message += `Talebi görüntülemek için <a href="${getRoutingURL(taskId)}">tıklayınız</a>.<br/><br/>`;

    sendEmail(subject, message, taskManager.email);

    // İşi yapan kişi ile yönetici aynı kişiyse e-posta gönderme
    if (taskManager._id == taskPerson._id) return;

    // İşi yapan kişiye gönderilen e-posta
    message = "Merhaba " + taskPerson.full_name + ",<br/><br/>";
    message += `${taskCreator.full_name} tarafından, görevlisi olduğunuz bir talep oluşturuldu.<br/><br/>`;

    message += `Proje: ${taskProject.name}<br/>`;
    message += `Başlık: ${taskTitle}<br/>`;
    message += `Açıklama: ${taskDescription}<br/>`
    message += `Görevli: ${taskPerson.full_name}<br/>`
    message += `Oluşturulma Tarihi: ${getDateAndTime(new Date)}<br/><br/>`;
    message += `Talebi görüntülemek için <a href="${getRoutingURL(taskId)}">tıklayınız</a>.<br/><br/>`;

    sendEmail(subject, message, taskPerson.email);
}

async function sendConversationAddedMessageMail(taskPerson, conversationCreator, taskTitle, taskId) {
    const curDate = getDateAndTime(new Date);

    var subject = `Yeni Yorum - ${taskTitle} - ${curDate}`;
    var message = "Merhaba " + taskPerson.full_name + ",<br/><br/>";
    message += `${conversationCreator.full_name} tarafından, görevlisi olduğunuz bir talebe yeni bir yorum eklendi.<br/><br/>`;
    message += `Talebi görüntülemek için <a href="${getRoutingURL(taskId)}">tıklayınız</a>.<br/><br/>`;

    sendEmail(subject, message, taskPerson.email);
}

async function sendEmail(subject, message, toList) {

    const mailAccount = await MailAccount.findOne();

    const transporter = nodemailer.createTransport({
        host: mailAccount.host,
        port: mailAccount.port,
        secure: mailAccount.secure,
        tls: { rejectUnauthorized: false },
        auth: {
            user: mailAccount.username,
            pass: mailAccount.password
        }
    });

    const sendMailAsync = util.promisify(transporter.sendMail).bind(transporter)

    const mailOptions = {
        from: mailAccount.username,
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

function getDateAndTime(date) {
    return dayjs(date).format('DD/MM/YYYY HH:mm:ss')
}

function getRoutingURL(taskId) {
    return `https://istakip.kurumsalb2c.com/conversations/${taskId}`;
}

module.exports = {
    sendEmail,
    sendReminderMail,
    sendTaskCreatedMail,
    sendConversationAddedMessageMail
}