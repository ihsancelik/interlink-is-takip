const express = require('express');
const router = express.Router();
const { Department, User, UserRole } = require('../db');

//department list
router.get('/departments', async (req, res) => {
    try {
        const departments = await Department.find();
        res.json(departments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not get departments' });
    }
});

router.get('/departments/manager/:departmentId', async (req, res) => {
    try {
        const departmentId = req.params.departmentId;
        const managerRole = await UserRole.findOne({ name: 'yönetici' });
        const user = await User.findOne({ department: departmentId, role: managerRole._id });
        user.password = undefined;
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not get department manager' });
    }
});

router.post('/departments', async (req, res) => {
    try {
        const { name } = req.body;
        const department = new Department({ name });
        const savedDepartment = await department.save();
        res.status(201).json(savedDepartment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not create department' });
    }
});

router.put('/departments/:id', async (req, res) => {
    try {
        const departmentId = req.params.id;
        const { name } = req.body;

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
        console.error(err);
        res.status(500).json({ message: 'Could not update department' });
    }
});


router.delete('/departments/:id', async (req, res) => {
    try {
        const departmentId = req.params.id;
        const deletedDepartment = await Department.findByIdAndDelete(departmentId);
        if (!deletedDepartment) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.json(deletedDepartment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not delete department' });
    }
});

module.exports = router;