const express = require('express');
const router = express.Router();
const { UserRole } = require('../db');
const { get_errors_string } = require('../helpers/error-handler')

//roles list
router.get('/roles', async (req, res, next) => {
    try {
        const roles = await UserRole.find();
        res.json(roles);
    }
    catch (err) {
        next({
            message: get_errors_string(err),
            stack: err.stack,
            status: 500
        });
    }
});

router.post('/roles', async (req, res, next) => {
    try {
        const { name } = req.body;
        const role = new UserRole({ name });
        const savedRole = await role.save();
        res.status(201).json(savedRole);
    }
    catch (err) {
        next({
            message: get_errors_string(err),
            stack: err.stack,
            status: 500
        });
    }
});

router.put('/roles/:id', async (req, res, next) => {
    try {
        const roleId = req.params.id;
        const { name } = req.body;

        const updatedRole = await UserRole.findByIdAndUpdate(
            roleId,
            { name },
            { new: true }
        );
        if (!updatedRole) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.json(updatedRole);
    }
    catch (err) {
        next({
            message: get_errors_string(err),
            stack: err.stack,
            status: 500
        });
    }
});


router.delete('/roles/:id', async (req, res, next) => {
    try {
        const roleId = req.params.id;
        const deletedRole = await UserRole.findByIdAndDelete(roleId);
        if (!deletedRole) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.json(deletedRole);
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