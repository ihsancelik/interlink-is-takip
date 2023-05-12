const { ActivityLog, UserRole } = require('../db');
const { sendEmail } = require('./mailer');
const dayjs = require('dayjs');
const { taskActivityAction } = require('../constants/activityActionConstants');

async function getActivities(task_id, user_id) {
    let query = {};

    if (task_id) query.task_id = task_id;
    if (user_id) query.user_id = user_id;

    return await ActivityLog.find(query).populate('task_id').populate('user_id');
}

async function addActivityLog(user, task, action, old_data, created_at) {
    try {
        action_message = getActionMessage(user, task, action);

        const newActivityLog = new ActivityLog({ user, task, action, action_message, old_data, created_at });
        await newActivityLog.save();

        sendEmailNotification(action, task, action_message);
    } catch (error) {

    }
}

function sendEmailNotification(action, task, action_message) {

    if (action == taskActivityAction.REMINDER_SET) {
        const managerRoleId = UserRole.findOne({ name: 'yönetici' })._id;
        const departmentId = task.related_department._id;
        const toMails = User.find({ role: managerRoleId, department: departmentId }).map(user => user.email);
        toMails.append(task.related_person.email);

        sendEmail(user.email, action_message, toMails);

        return;
    }

    if (action == taskActivityAction.COMMENT_ADDED) {
        const toMails = [task.related_person.email];

        sendEmail(user.email, action_message, toMails);

        return;
    }

    if (action == taskActivityAction.STATUS_CHANGED) {
        const toMails = [task.related_person.email];

        sendEmail(user.email, action_message, toMails);

        return;
    }

    if (action == taskActivityAction.PRIORITY_CHANGED) {
        const toMails = [task.related_person.email];

        sendEmail(user.email, action_message, toMails);

        return;
    }

    if (action == taskActivityAction.UPDATED) {
        const toMails = [task.related_person.email];

        sendEmail(user.email, action_message, toMails);

        return;
    }
}


function getActionMessage(user, task, action) {

    const title = task.title;
    const datetime = dayjs(task.created_at).format("DD/MM/YYYY HH:mm:ss");

    const message = `${title} başlıklı talep ${datetime} tarihinde ${user.full_name} tarafından şu aksiyon alındı: ${action}.`
    return message;
}

module.exports = {
    getActivities,
    addActivityLog
};