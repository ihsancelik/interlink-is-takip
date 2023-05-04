const express = require('express');
const router = express.Router();
const { UserRole } = require('../db');

//roles list
router.get('/roles', async (req, res) => {
    try {
        const roles = await UserRole.find();
        res.json(roles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not get roles' });
    }
});

router.post('/roles', async (req, res) => {
    try {
        const { name } = req.body;
        const role = new UserRole({ name });
        const savedRole = await role.save();
        res.status(201).json(savedRole);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not create role' });
    }
});

router.put('/roles/:id', async (req, res) => {
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
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not update role' });
    }
});


router.delete('/roles/:id', async (req, res) => {
    try {
        const roleId = req.params.id;
        const deletedRole = await UserRole.findByIdAndDelete(roleId);
        if (!deletedRole) {
            return res.status(404).json({ message: 'Role not found' });
        }
        res.json(deletedRole);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Could not delete role' });
    }
});

module.exports = router;