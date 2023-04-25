const { ActivityLog } = require('../db');

async function getActivities(task_id, user_id) {
    let query = {};
    
    if (task_id) query.task_id = task_id;
    if (user_id) query.user_id = user_id;

    return await ActivityLog.find(query).populate('task_id').populate('user_id');
}

async function addActivityLog(task_id, user_id, message) {
    const newActivityLog = new ActivityLog({ task_id, user_id, message });
    return await newActivityLog.save();
}

module.exports = {
    getActivities,
    addActivityLog
};