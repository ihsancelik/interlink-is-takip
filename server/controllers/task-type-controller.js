const express = require('express');
const router = express.Router();
const { TaskType } = require('../db');
const { get_errors_string } = require('../helpers/error-handler')

router.get('/task-types', async (req, res, next) => {
    try {
        const data = await TaskType.find();

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