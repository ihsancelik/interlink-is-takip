const { TaskActivityLog, UserRole, Conversation, User, TaskActivityAction, TaskPriority, TaskStatus, TaskType } = require('../db');
const { sendEmail } = require('./mailer');
const dayjs = require('dayjs');
const { taskActivityAction } = require('../constants/activityActionConstants');
const { sendPushNotification } = require('./notification-service');
const { isUserOnline, sendLiveNotification } = require('./notificationHub');

async function getActivities(task_id, user_id) {
    let query = {};
    if (task_id) query.task = task_id;
    if (user_id) query.user = user_id;

    return await TaskActivityLog.find(query).populate('task').populate('user');
}

async function addActivityLog(user, task, action, old_data, new_data) {
    try {
        action_message = getActionMessage(user, task.title, task.created_at, action, old_data, new_data);

        const actionObject = TaskActivityAction.findOne({ name: action });

        const newActivityLog = new TaskActivityLog({ user, task, actionObject, action_message, old_data, new_data });
        await newActivityLog.save();

        const adminUser = await User.findOne({ username: 'admin' });
        const conversationMessage = getActionMessageForConversation(user, action, task, old_data, new_data);
        if (conversationMessage) {
            await (new Conversation({
                task: task._id,
                message: conversationMessage,
                created_from: adminUser._id,
            })).save();
        }
    } catch (error) {
        console.error(error)
    }
}

function sendEmailNotification(user, action, task, action_message) {

    if (action == taskActivityAction.REMINDER_SET) {
        const managerRoleId = UserRole.findOne({ name: 'yönetici' })._id;
        const departmentId = task.related_department._id;
        const toMails = User.find({ role: managerRoleId, department: departmentId }).map(user => user.email);
        toMails.append(task.related_person.email);

        sendEmail(user.email, action_message, toMails);

        return;
    }

    if (action == taskActivityAction.COMMENT_ADDED || action == taskActivityAction.STATUS_CHANGED ||
        action == taskActivityAction.PRIORITY_CHANGED || action == taskActivityAction.UPDATED ||
        action == taskActivityAction.TYPE_CHANGED || action == taskActivityAction.PROJECT_CHANGED ||
        action == taskActivityAction.CREATED) {
        const toMails = [task.related_person.email];

        sendEmail(user.email, action_message, toMails);

        return;
    }
}

function sendActivityNotification(user, action, task, oldTask) {
    const title = 'INTERLINK İŞ-TAKİP';
    const body = getActionMessageForConversation(user, action, task, oldTask);

    console.log(body);

    const userid = user._id;

    // online kullanıcı varsa websocket üzerinden notification'ı iletir
    if (isUserOnline(userid)) {
        sendLiveNotification(userid, title, body);
    }
    // online kullanıcı yoksa google servisleri üzerinden notification'ı iletir
    else {
        sendPushNotification(userid, title, body);
    }
}


function getActionMessage(user, taskTitle, taskCreatedAt, action, old_data, new_data) {

    const title = taskTitle;
    const datetime = dayjs(taskCreatedAt).format("DD/MM/YYYY HH:mm:ss");

    let message = `${title} başlıklı talep için ${datetime} tarihinde ${user.full_name} tarafından şu aksiyon alındı: ${action}. `
    message += `<s>${old_data}</s> ${new_data} olarak değiştirildi.`
    return message;
}

function getActionMessageForConversation(user, action, task, old_data, new_data) {
    let message = `${user.full_name} tarafından `;

    if (action == taskActivityAction.PRIORITY_CHANGED)
        message += "önceliği "

    else if (action == taskActivityAction.PROJECT_CHANGED)
        message += "projesi "

    else if (action == taskActivityAction.RELATED_PERSON_CHANGED)
        message += "ilgili kişisi "

    else if (action == taskActivityAction.STATUS_CHANGED)
        message += "durumu "

    else if (action == taskActivityAction.TYPE_CHANGED)
        message += "tipi "

    else
        return null;

    message += `<b><s>${old_data}</s> ${new_data}</b> olarak değiştirildi.`

    return message;
}

module.exports = {
    getActivities,
    addActivityLog,
    sendActivityNotification
};