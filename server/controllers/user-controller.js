const express = require('express');
const router = express.Router();
const { Department, User, UserRole } = require('../db');


router.get('/users', async (req, res, next) => {
    try {
        const users = await User.find().populate('department').populate('role');
        res.json(users);
    }
    catch (err) {
        next(err);
    }
});

router.post('/users', async (req, res, next) => {
    try {
        const { full_name, email, gsm, username, password, departmentid, roleid } = req.body.data;

        // Check if the department exists
        const existingDepartment = await Department.findById(departmentid);
        if (!existingDepartment) {
            return res.status(400).json({ message: 'Department not found' });
        }

        const existingRole = await UserRole.findById(roleid);
        if (!existingRole) {
            return res.status(400).json({ message: 'Role not found' });
        }

        // check the username expect the current user
        if (User.find({ username: username })) {
            return res.status(400).json({ message: 'Bu kullanıcı adı zaten mevcut' });
        }

        // check the email expect the current user
        if (User.find({ email: email })) {
            return res.status(400).json({ message: 'Bu e-posta adresi zaten mevcut' });
        }

        const user = new User({
            full_name,
            username,
            password,
            email,
            gsm,
            department: existingDepartment._id,
            role: existingRole._id
        });

        const savedUser = await user.save();
        res.status(201).json(savedUser);
    }
    catch (err) {
        next(err);
    }
});

router.put('/users/:id', async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { full_name, email, gsm, username, password, departmentid, roleid } = req.body.data;

        // Check if the user exists
        let existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // check the username expect the current user
        if (User.find({ username: username, _id: { $ne: userId } })) {
            return res.status(400).json({ message: 'Bu kullanıcı adı zaten mevcut' });
        }

        // check the email expect the current user
        if (User.find({ email: email, _id: { $ne: userId } })) {
            return res.status(400).json({ message: 'Bu e-posta adresi zaten mevcut' });
        }


        // Check if the department exists
        const existingDepartment = await Department.findById(departmentid);
        if (!existingDepartment) {
            return res.status(400).json({ message: 'Department not found' });
        }

        const existingRole = await UserRole.findById(roleid);
        if (!existingRole) {
            return res.status(400).json({ message: 'Role not found' });
        }

        existingUser.full_name = full_name;
        existingUser.email = email;
        existingUser.gsm = gsm;
        existingUser.username = username;
        existingUser.password = password;
        existingUser.department = existingDepartment._id;
        existingUser.role = existingRole._id;

        const updatedUser = await existingUser.save();
        res.json(updatedUser);
    }
    catch (err) {
        next(err);
    }
});

router.delete('/users/:id', async (req, res, next) => {
    try {
        const userId = req.params.id;

        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(deletedUser);
    }
    catch (err) {
        next(err);
    }
});

module.exports = router;
