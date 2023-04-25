const express = require('express');
const router = express.Router();
const { Department, User } = require('../db');


router.get('/users', async (req, res) => {
    try {
        const users = await User.find().populate('department');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not get users' });
    }
});

router.post('/users', async (req, res) => {
    try {
        const { full_name, username, password, departmentid } = req.body;

        // Check if the department exists
        const existingDepartment = await Department.findById(departmentid);
        if (!existingDepartment) {
            return res.status(400).json({ message: 'Department not found' });
        }

        const user = new User({
            full_name,
            username,
            password,
            department: existingDepartment._id
        });

        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not create user' });
    }
});

router.put('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const { full_name, username, password, department, token } = req.body;

        // Check if the user exists
        let existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user properties only if the value is not null
        if (token !== null) {
            existingUser.token = token;
        }
        if (full_name !== null) {
            existingUser.full_name = full_name;
        }
        if (username !== null) {
            existingUser.username = username;
        }
        if (password !== null) {
            existingUser.password = password;
        }
        if (department !== null) {
            // Check if the department exists
            const existingDepartment = await Department.findById(department);
            if (!existingDepartment) {
                return res.status(400).json({ message: 'Department not found' });
            }
            existingUser.department = existingDepartment._id;
        }

        const updatedUser = await existingUser.save();
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not update user' });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(deletedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not delete user' });
    }
});

module.exports = router;