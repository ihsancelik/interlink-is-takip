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

router.post('/projects', async (req, res) => {
    try {
        const { name } = req.body.data;
        const project = new Project({ name });
        const savedProject = await project.save();
        res.status(201).json(savedProject);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not create project' });
    }
});

router.put('/projects/:id', async (req, res) => {
    try {
        const projectId = req.params.id;
        const { name } = req.body.data;

        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { name },
            { new: true }
        );
        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(updatedProject);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not update project' });
    }
});


router.delete('/projects/:id', async (req, res) => {
    try {
        const projectId = req.params.id;
        const deletedProject = await Project.findByIdAndDelete(projectId);
        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(deletedProject);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not delete project' });
    }
});

module.exports = router;