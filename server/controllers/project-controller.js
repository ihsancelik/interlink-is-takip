const express = require('express');
const router = express.Router();
const { Project } = require('../db');

router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not get projects' });
    }
});

module.exports = router;