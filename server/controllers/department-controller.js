const express = require('express');
const router = express.Router();
const { Department, User, UserRole } = require('../db');
const { body, validationResult } = require('express-validator');
const { get_errors_string } = require('../helpers/error-handler')

//department list
router.get('/departments', async (req, res, next) => {
    try {
        const departments = await Department.find();
        res.json(departments);
    } catch (err) {
        next({
            message: get_errors_string(err),
            stack: err.stack,
            status: 500
        });
    }
});

router.get('/departments/manager/:departmentId', async (req, res, next) => {
    try {
        const departmentId = req.params.departmentId;
        const managerRole = await UserRole.findOne({ name: 'yönetici' });
        const user = await User.findOne({ department: departmentId, role: managerRole._id });
        user.password = undefined;
        res.json(user);
    } catch (err) {
        next({
            message: get_errors_string(err),
            stack: err.stack,
            status: 500
        });
    }
});

router.post('/departments', [
    body('data.name').notEmpty().withMessage('Departman adı boş bırakılamaz'),
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = errors.array().map(e => '* ' + e.msg).join('\n');
            return res.status(400).json({ message: error });
        }

        const { name } = req.body.data;
        const department = new Department({ name });

        if ((await Department.find({ name: name })).length > 0) {
            return res.status(400).json({ message: 'Bu departman zaten mevcut' });
        }

        const savedDepartment = await department.save();
        res.status(201).json(savedDepartment);
    } catch (err) {
        next({
            message: get_errors_string(err),
            stack: err.stack,
            status: 500
        });
    }
});

router.put('/departments/:id', [
    body('data.name').notEmpty().withMessage('Departman adı boş bırakılamaz'),
], async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = errors.array().map(e => '* ' + e.msg).join('\n');
            return res.status(400).json({ message: error });
        }

        const departmentId = req.params.id;
        const { name } = req.body.data;

        if (await Department.findOne({ name: name, _id: { $ne: departmentId } })) {
            return res.status(400).json({ message: 'Bu departman zaten mevcut' });
        }

        const updatedDepartment = await Department.findByIdAndUpdate(
            departmentId,
            { name },
            { new: true }
        );
        if (!updatedDepartment) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.json(updatedDepartment);
    } catch (err) {
        next({
            message: get_errors_string(err),
            stack: err.stack,
            status: 500
        });
    }
});


router.delete('/departments/:id', async (req, res, next) => {
    try {
        const departmentId = req.params.id;
        const deletedDepartment = await Department.findByIdAndDelete(departmentId);
        if (!deletedDepartment) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.json(deletedDepartment);
    } catch (err) {
        next({
            message: get_errors_string(err),
            stack: err.stack,
            status: 500
        });
    }
});

module.exports = router;