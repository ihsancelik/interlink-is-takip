const express = require('express');
const router = express.Router();
const { TaskPriority } = require('../db');

router.get('/task-priorities', async (req, res, next) => {
    try {
        const data = await TaskPriority.find();

        res.json(data);
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;