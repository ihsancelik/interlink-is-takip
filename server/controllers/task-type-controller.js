const express = require('express');
const router = express.Router();
const { TaskType } = require('../db');

router.get('/task-types', async (req, res) => {
    try {
        const data = await TaskType.find();

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not get task types' });
    }
});

module.exports = router;