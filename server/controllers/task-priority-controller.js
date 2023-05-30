const express = require('express');
const router = express.Router();
const { TaskPriority } = require('../db');
const { get_errors_string } = require('../helpers/error-handler')

router.get('/task-priorities', async (req, res, next) => {
    try {
        const data = await TaskPriority.find();

        res.json(data);
    }
    catch (err) {
        next({
            message: get_errors_string(err),
            stack: err.stack,
            status: 500
        });
    }
});

module.exports = router;