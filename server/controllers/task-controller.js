const express = require('express');
const router = express.Router();
const { Task, User } = require('../db');
const { addActivityLog } = require('../services/activity-log-service');
const { taskActivityAction } = require('../constants/task-activity-action');

// get task from id
router.get('/tasks/:id', async (req, res) => {
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
        console.error(err);
        res.status(500).json({ message: 'Could not get task' });
    }
});

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate('related_project')
            .populate('related_person')
            .populate('related_department')
            .populate('type')
            .populate('status')
            .populate('priority')
            .populate('created_from')

        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not get tasks' });
    }
});

router.post('/tasks', async (req, res) => {
    try {
        const { title, description, related_project, related_person, related_department, type, status, priority } = req.body.data;
        const created_from = req.auth.user_id;
        const task = new Task({ title, description, related_project, related_person, related_department, type, status, priority, created_from });
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not create task' });
    }
});

router.put('/tasks/change-status/:taskId', async (req, res) => {
    const taskId = req.params.taskId;
    const { status } = req.body.data;
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { status },
            { new: true }
        );
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(updatedTask);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not update task status' });
    }
});

router.put('/tasks/:id', async (req, res) => {
    const id = req.params.id;
    const { title, description, related_person, related_project, related_department, type, status, priority } = req.body.data;
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title, description, related_person, related_project, related_department, type, status, priority },
            { new: true }
        );
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(updatedTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not update task' });
    }
});


router.delete('/tasks/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const deletedTask = await Task.findByIdAndDelete(taskId);
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(deletedTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not delete task' });
    }
});


router.get('/tasks/send-reminder/:taskId', async (req, res) => {
    const task_id = req.params.taskId;
    try {
        const task = Task.findById(task_id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const user_id = req.auth.user_id;
        const user = await User.findById(user_id);

        // send reminder
        addActivityLog(user, task, taskActivityAction.REMINDER_SENT, null, user_id);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not send reminder' });
    }
});

module.exports = router;