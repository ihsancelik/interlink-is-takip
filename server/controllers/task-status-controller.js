const express = require('express');
const router = express.Router();
const { TaskStatus } = require('../db');
const { get_errors_string } = require('../helpers/error-handler')

router.get('/task-statuses', async (req, res, next) => {
    try {
        const data = await TaskStatus.find();

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