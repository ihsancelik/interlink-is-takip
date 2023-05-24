const express = require('express');
const router = express.Router();
const { Task, User, UserRole, TaskType, TaskPriority, TaskStatus, Project } = require('../db');
const { addActivityLog } = require('../services/activity-log-service');
const { taskActivityAction } = require('../constants/activityActionConstants');
const { sendReminderMail, sendTaskCreatedMail } = require('../services/mailer')
const { sendNotification } = require('../services/notification-service')

// get task from id
router.get('/tasks/:id', async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId)
            .populate('related_project')
            .populate('related_person')
            .populate('related_department')
            .populate('type')
            .populate('status')
            .populate('priority')
            .populate('created_from')
        res.json(task);
    } catch (err) {
        next(err);
    }
});

router.get('/tasks/with-query/:queryString', async (req, res, next) => {
    try {
        let query = {};

        const queryVals = req.params.queryString;
        if (queryVals && queryVals.length > 1) {
            const queryArr = queryVals.split('&');
            queryArr.forEach(q => {
                const qArr = q.split('=');
                if (qArr[1] !== '0')
                    query[qArr[0]] = qArr[1];
            });
        }

        console.log(query);
        console.log(queryVals);

        const managerRole = await UserRole.findOne({ name: 'yönetici' });
        const userRole = await UserRole.findOne({ name: 'kullanıcı' });


        const user = await User.findById(req.auth.user_id);

        // Yönetici ise
        if (user.role._id == managerRole._id) {
            // Benim tarafımdan oluşturulmuşsa veya benim departmanımla ilişkiliyse
            query.$or = [{ created_from: user._id }, { related_department: user.department._id }];
        }

        // Kullanıcı ise
        if (user.role._id == userRole._id) {
            // Benim tarafımdan oluşturulmuşsa veya benimle ilişkiliyse
            query.$or = [{ created_from: user._id }, { related_person: user._id }]
        }

        const tasks = await Task.find(query)
            .sort({ created_at: 'desc' })
            .populate('related_project')
            .populate('related_person')
            .populate('related_department')
            .populate('type')
            .populate('status')
            .populate('priority')
            .populate('created_from')


        tasks.forEach(task => {
            task.related_person.password = undefined;
            task.created_from.password = undefined;
        });

        res.json(tasks);
    } catch (err) {
        next(err);
    }
});

router.post('/tasks', async (req, res, next) => {
    try {
        const { title, description, related_project, related_person, related_department, type, status, priority } = req.body.data;
        const created_from = req.auth.user_id;
        const task = new Task({ title, description, related_project, related_person, related_department, type, status, priority, created_from });
        const savedTask = await task.save();

        const related_person_user = await User.findById(related_person);
        const created_from_user = await User.findById(created_from);
        const taskManager = await getTaskManager(savedTask);
        sendTaskCreatedMail(taskManager, related_person_user, created_from_user, savedTask.title);

        const user_id = req.auth.user_id;
        const user = await User.findById(user_id);
        addActivityLog(user, savedTask, taskActivityAction.CREATED, null, savedTask._id);

        savedTask.related_person.password = undefined;
        savedTask.created_from.password = undefined;
        res.status(201).json(savedTask);
    } catch (err) {
        next(err);
    }
});

router.put('/tasks/change-status/:taskId', async (req, res, next) => {
    const taskId = req.params.taskId;
    const { status } = req.body.data;
    try {
        const task = await Task.findByIdAndUpdate(taskId).populate('status');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const changed_status = await TaskStatus.findById(status);
        if (!changed_status) {
            return res.status(404).json({ message: 'Status not found' });
        }

        const old_data = task.status.name;
        const new_data = changed_status.name;

        task.status = status;
        const updatedTask = await task.save();

        // Activity Log
        const user_id = req.auth.user_id;
        const user = await User.findById(user_id);
        addActivityLog(user, task, taskActivityAction.STATUS_CHANGED, old_data, new_data);

        updatedTask.related_person.password = undefined;
        updatedTask.created_from.password = undefined;
        res.json(updatedTask);
    } catch (err) {
        next(err);
    }
});


router.put('/tasks/change-priority/:taskId', async (req, res, next) => {
    const taskId = req.params.taskId;
    const { priority } = req.body.data;
    try {
        const task = await Task.findByIdAndUpdate(taskId).populate('priority');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const changed_priority = await TaskPriority.findById(priority);
        if (!changed_priority) {
            return res.status(404).json({ message: 'Priority not found' });
        }

        const old_data = task.priority.name;
        const new_data = changed_priority.name;

        task.priority = priority;
        const updatedTask = await task.save();

        // Activity Log
        const user_id = req.auth.user_id;
        const user = await User.findById(user_id);
        addActivityLog(user, task, taskActivityAction.PRIORITY_CHANGED, old_data, new_data);

        updatedTask.related_person.password = undefined;
        updatedTask.created_from.password = undefined;
        res.json(updatedTask);
    }
    catch (err) {
        next(err);
    }
});

router.put('/tasks/change-type/:taskId', async (req, res, next) => {
    const taskId = req.params.taskId;
    const { type } = req.body.data;
    try {
        const task = await Task.findByIdAndUpdate(taskId).populate('type');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const changed_type = await TaskType.findById(type);
        if (!changed_type) {
            return res.status(404).json({ message: 'Type not found' });
        }

        const old_data = task.type.name;
        const new_data = changed_type.name;


        task.type = type;
        const updatedTask = await task.save();

        // Activity Log
        const user_id = req.auth.user_id;
        const user = await User.findById(user_id);
        addActivityLog(user, task, taskActivityAction.TYPE_CHANGED, old_data, new_data);

        updatedTask.related_person.password = undefined;
        updatedTask.created_from.password = undefined;
        res.json(updatedTask);
    }
    catch (err) {
        next(err);
    }
});

router.put('/tasks/change-project/:taskId', async (req, res, next) => {
    const taskId = req.params.taskId;
    const { project } = req.body.data;
    try {
        const task = await Task.findByIdAndUpdate(taskId).populate('related_project');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const changed_project = await Project.findById(project);
        if (!changed_project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const old_data = task.related_project.name;
        const new_data = changed_project.name;

        task.related_project = project;
        const updatedTask = await task.save();

        // Activity Log
        const user_id = req.auth.user_id;
        const user = await User.findById(user_id);
        addActivityLog(user, task, taskActivityAction.PROJECT_CHANGED, old_data, new_data);

        updatedTask.related_person.password = undefined;
        updatedTask.created_from.password = undefined;
        res.json(updatedTask);
    }
    catch (err) {
        next(err);
    }
});

router.put('/tasks/change-related-person/:taskId', async (req, res, next) => {
    const taskId = req.params.taskId;
    const { related_person } = req.body.data;
    try {
        const task = await Task.findByIdAndUpdate(taskId).populate('related_person');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const changed_user = await User.findById(related_person);
        if (!changed_user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const old_data = task.related_person.full_name;
        const new_data = changed_user.full_name;

        task.related_person = related_person;
        const updatedTask = await task.save();

        // Activity Log
        const user_id = req.auth.user_id;
        const user = await User.findById(user_id);
        addActivityLog(user, task, taskActivityAction.RELATED_PERSON_CHANGED, old_data, new_data);

        updatedTask.related_person.password = undefined;
        updatedTask.created_from.password = undefined;
        res.json(updatedTask);
    }
    catch (err) {
        next(err);
    }
});


router.put('/tasks/:id', async (req, res, next) => {
    const id = req.params.id;
    const { title, description, related_person, related_project, related_department, type, status, priority } = req.body.data;
    try {
        var task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const old_data = task;

        task.title = title;
        task.description = description;
        task.related_person = related_person;
        task.related_project = related_project;
        task.related_department = related_department;
        task.type = type;
        task.status = status;
        task.priority = priority;

        const updatedTask = await task.save();

        // Activity Log
        const user_id = req.auth.user_id;
        const user = await User.findById(user_id);
        //addActivityLog(user, task, taskActivityAction.UPDATED, old_data);

        updatedTask.related_person.password = undefined;
        updatedTask.created_from.password = undefined;
        res.json(updatedTask);
    }
    catch (err) {
        next(err);
    }
});


router.delete('/tasks/:id', async (req, res, next) => {
    try {
        const taskId = req.params.id;
        const deletedTask = await Task.findByIdAndDelete(taskId);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Activity Log
        const user_id = req.auth.user_id;
        const user = await User.findById(user_id);
        //addActivityLog(user, task, taskActivityAction.DELETED, deletedTask);

        deletedTask.related_person.password = undefined;
        deletedTask.created_from.password = undefined;
        res.json(deletedTask);
    }
    catch (err) {
        next(err);
    }
});


router.get('/tasks/send-reminder/:taskId', async (req, res, next) => {
    const task_id = req.params.taskId;
    try {
        const task = await Task.findById(task_id)
            .populate('related_person')
            .populate('created_from')
            .populate('related_department');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // send reminder
        var taskManager = await getTaskManager(task);
        var taskPerson = task.related_person;
        var taskCreator = task.created_from;
        sendReminderMail(taskManager, taskPerson, taskCreator, task._id, task.title);

        // Activity Log
        const user_id = req.auth.user_id;
        const user = await User.findById(user_id);
        addActivityLog(user, task, taskActivityAction.REMINDER_SENT, null, null);

        res.status(200).json({ message: 'Reminder sent' });
    }
    catch (err) {
        next(err);
    }
});

async function getTaskManager(task) {
    var managerRole = await UserRole.findOne({ name: 'yönetici' });
    var taskManager = await User.findOne({ role: managerRole, department: task.related_department });
    return taskManager;
}

module.exports = router;