const express = require('express');
const router = express.Router();
const { Project } = require('../db');

router.get('/projects', async (req, res, next) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        next(err);
    }
});

router.post('/projects', async (req, res, next) => {
    try {
        const { name } = req.body.data;

        if (Project.find({ name: name })) {
            return res.status(400).json({ message: 'Bu proje zaten mevcut' });
        }

        const project = new Project({ name });
        const savedProject = await project.save();
        res.status(201).json(savedProject);
    } catch (err) {
        next(err);
    }
});

router.put('/projects/:id', async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const { name } = req.body.data;

        if (Project.find({ name: name, _id: { $ne: projectId } })) {
            return res.status(400).json({ message: 'Bu proje zaten mevcut' });
        }

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
        next(err);
    }
});


router.delete('/projects/:id', async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const deletedProject = await Project.findByIdAndDelete(projectId);
        if (!deletedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(deletedProject);
    } catch (err) {
        next(err);
    }
});

module.exports = router;