const express = require('express');
const router = express.Router();
const { Project } = require('../db');
const { body, validationResult } = require('express-validator');
const { get_errors_string } = require('../helpers/error-handler')

router.get('/projects', async (req, res, next) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        next({
            message: get_errors_string(err),
            stack: err.stack,
            status: 500
        });
    }
});

router.post('/projects', [
    body('data.name').notEmpty().withMessage('Proje adı boş olamaz'),
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = errors.array().map(e => '* ' + e.msg).join('\n');
            return res.status(400).json({ message: error });
        }

        const { name } = req.body.data;

        if (await Project.findOne({ name: name })) {
            return res.status(400).json({ message: 'Bu proje zaten mevcut' });
        }

        const project = new Project({ name });
        const savedProject = await project.save();
        res.status(201).json(savedProject);
    } catch (err) {
        next({
            message: get_errors_string(err),
            stack: err.stack,
            status: 500
        });
    }
});

router.put('/projects/:id', [
    body('data.name').notEmpty().withMessage('Proje adı boş olamaz'),
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = errors.array().map(e => '* ' + e.msg).join('\n');
            return res.status(400).json({ message: error });
        }

        const projectId = req.params.id;
        const { name } = req.body.data;

        if (await Project.findOne({ name: name, _id: { $ne: projectId } })) {
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
        next({
            message: get_errors_string(err),
            stack: err.stack,
            status: 500
        });
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
        next({
            message: get_errors_string(err),
            stack: err.stack,
            status: 500
        });
    }
});

module.exports = router;