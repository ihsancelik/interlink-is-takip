const express = require('express');
const router = express.Router();
const { TaskPriority } = require('../db');

router.get('/task-priorities', async (req, res) => {
    try {
        const data = await TaskPriority.find();

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not get task priorities' });
    }
});

module.exports = router;