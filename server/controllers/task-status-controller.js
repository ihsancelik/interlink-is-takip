const express = require('express');
const router = express.Router();
const { TaskStatus } = require('../db');

router.get('/task-statuses', async (req, res, next) => {
    try {
        const data = await TaskStatus.find();

        res.json(data);
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;