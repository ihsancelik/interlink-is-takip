const express = require('express');
const router = express.Router();
const { TaskStatus } = require('../db');

router.get('/task-statuses', async (req, res) => {
    try {
        const data = await TaskStatus.find();

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not get task statuses' });
    }
});

module.exports = router;