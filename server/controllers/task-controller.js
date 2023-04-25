const express = require('express');
const router = express.Router();
const { Task } = require('../db');

//task list
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not get tasks' });
    }
});

router.post('/tasks', async (req, res) => {
    try {
        const { name, description, departmentId } = req.body;
        const task = new Task({ name, description, departmentId });
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not create task' });
    }
});

router.put('/tasks/:id', async (req, res) => {
    const { title, description } = req.body;
    const { id } = req.params;
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title, description },
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