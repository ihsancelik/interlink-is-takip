const express = require('express');
const router = express.Router();
const { Department, User, UserRole } = require('../db');

//department list
router.get('/departments', async (req, res, next) => {
    try {
        const departments = await Department.find();
        res.json(departments);
    } catch (err) {
        next(err);
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
        next(err);
    }
});

router.post('/departments', async (req, res, next) => {
    try {
        const { name } = req.body.data;
        const department = new Department({ name });

        if (Department.find({ name: name })) {
            return res.status(400).json({ message: 'Bu departman zaten mevcut' });
        }

        const savedDepartment = await department.save();
        res.status(201).json(savedDepartment);
    } catch (err) {
        next(err);
    }
});

router.put('/departments/:id', async (req, res, next) => {
    try {
        const departmentId = req.params.id;
        const { name } = req.body.data;

        if (Department.find({ name: name, _id: { $ne: departmentId } })) {
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
        next(err);
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
        next(err);
    }
});

module.exports = router;