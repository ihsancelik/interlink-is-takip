const express = require('express');
const router = express.Router();
const { TaskType } = require('../db');

router.get('/task-types', async (req, res, next) => {
    try {
        const data = await TaskType.find();

        res.json(data);
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;