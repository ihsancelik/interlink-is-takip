const express = require('express');
const router = express.Router();
const { Task } = require('../db');

//task list
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find()
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
        const { title, description, related_person, related_department, type, status, priority, created_from } = req.body;
        const task = new Task({ title, description, related_person, related_department, type, status, priority, created_from });
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not create task' });
    }
});

router.put('/tasks/:id', async (req, res) => {
    const { taskId } = req.params.taskId;
    const { title, description, related_person, related_department, type, status, priority, created_from } = req.body;
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { title, description, related_person, related_department, type, status, priority, created_from },
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

module.exports = router;